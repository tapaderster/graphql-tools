import {
  GraphQLCompositeType,
  GraphQLSchema,
  isAbstractType,
  FieldNode,
  GraphQLObjectType,
  GraphQLResolveInfo,
} from 'graphql';

import {
  collectFields,
  GraphQLExecutionContext,
  setErrors,
  RelativeGraphQLError,
  sliceRelativeError,
} from '@graphql-tools/utils';
import { setObjectSubschema, isSubschemaConfig } from '../Subschema';
import { mergeFields } from '../mergeFields';
import { MergedTypeInfo, SubschemaConfig } from '../types';

export function handleObject(
  type: GraphQLCompositeType,
  object: any,
  errors: Array<RelativeGraphQLError>,
  subschema: GraphQLSchema | SubschemaConfig,
  context: Record<string, any>,
  info: GraphQLResolveInfo,
  skipTypeMerging?: boolean
) {
  const stitchingInfo = info?.schema.extensions?.stitchingInfo;

  setErrors(
    object,
    errors.map(error => sliceRelativeError(error))
  );

  setObjectSubschema(object, subschema);

  if (skipTypeMerging || !stitchingInfo) {
    return object;
  }

  const typeName = isAbstractType(type) ? info.schema.getTypeMap()[object.__typename].name : type.name;
  const mergedTypeInfo = stitchingInfo.mergedTypes[typeName];
  let targetSubschemas: Array<SubschemaConfig>;

  if (mergedTypeInfo != null) {
    targetSubschemas = mergedTypeInfo.subschemas;
  }

  if (!targetSubschemas) {
    return object;
  }

  targetSubschemas = targetSubschemas.filter(s => s !== subschema);
  if (!targetSubschemas.length) {
    return object;
  }

  const subFields = collectSubFields(info, object.__typename);

  const selections = getFieldsNotInSubschema(subFields, subschema, mergedTypeInfo, object.__typename);

  return mergeFields(
    mergedTypeInfo,
    typeName,
    object,
    selections,
    [subschema as SubschemaConfig],
    targetSubschemas,
    context,
    info
  );
}

function collectSubFields(info: GraphQLResolveInfo, typeName: string) {
  let subFieldNodes: Record<string, Array<FieldNode>> = Object.create(null);
  const visitedFragmentNames = Object.create(null);
  info.fieldNodes.forEach(fieldNode => {
    subFieldNodes = collectFields(
      ({
        schema: info.schema,
        variableValues: info.variableValues,
        fragments: info.fragments,
      } as unknown) as GraphQLExecutionContext,
      info.schema.getType(typeName) as GraphQLObjectType,
      fieldNode.selectionSet,
      subFieldNodes,
      visitedFragmentNames
    );
  });
  return subFieldNodes;
}

function getFieldsNotInSubschema(
  subFieldNodes: Record<string, Array<FieldNode>>,
  subschema: GraphQLSchema | SubschemaConfig,
  mergedTypeInfo: MergedTypeInfo,
  typeName: string
): Array<FieldNode> {
  const typeMap = isSubschemaConfig(subschema) ? mergedTypeInfo.typeMaps.get(subschema) : subschema.getTypeMap();
  const fields = (typeMap[typeName] as GraphQLObjectType).getFields();

  const fieldsNotInSchema: Array<FieldNode> = [];
  Object.keys(subFieldNodes).forEach(responseName => {
    subFieldNodes[responseName].forEach(subFieldNode => {
      if (!(subFieldNode.name.value in fields)) {
        fieldsNotInSchema.push(subFieldNode);
      }
    });
  });

  return fieldsNotInSchema;
}
