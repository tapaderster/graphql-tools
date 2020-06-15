import {
  ExecutionResult,
  GraphQLSchema,
  getOperationRootType,
  getOperationAST,
  Kind,
  GraphQLObjectType,
  FieldNode,
  GraphQLOutputType,
  isListType,
  getNullableType,
  isCompositeType,
  isAbstractType,
} from 'graphql';

import { Request, GraphQLExecutionContext } from './Interfaces';
import { collectFields } from './collectFields';

export function visitResult(result: ExecutionResult, request: Request, schema: GraphQLSchema): void {
  const operation = getOperationAST(request.document);

  const operationRootType = getOperationRootType(schema, operation);

  const exeContext = {
    schema,
    fragments: request.document.definitions.reduce((acc, def) => {
      if (def.kind === Kind.FRAGMENT_DEFINITION) {
        acc[def.name.value] = def;
      }
      return acc;
    }, {}),
    variableValues: request.variables,
  } as GraphQLExecutionContext;

  const collectedFields = collectFields(
    exeContext,
    operationRootType,
    operation.selectionSet,
    Object.create(null),
    Object.create(null)
  );

  if (result.data != null) {
    const data = result.data;
    Object.keys(collectedFields).forEach(responseKey => {
      const subfieldNodes = collectedFields[responseKey];
      const type = operationRootType.getFields()[subfieldNodes[0].name.value].type;
      data[responseKey] = visitField(data[responseKey], type, subfieldNodes, exeContext);
    });
  }
}

function visitField(
  field: any,
  returnType: GraphQLOutputType,
  fieldNodes: Array<FieldNode>,
  exeContext: GraphQLExecutionContext
): any {
  if (field == null) {
    return field;
  }

  const nullableType = getNullableType(returnType);
  if (isListType(nullableType)) {
    return (field as Array<any>).map(listMember => visitField(listMember, nullableType, fieldNodes, exeContext));
  } else if (isCompositeType(nullableType)) {
    const finalType = isAbstractType(nullableType)
      ? (exeContext.schema.getType(field.__typename) as GraphQLObjectType)
      : nullableType;
    const collectedFields = collectSubfields(exeContext, finalType, fieldNodes);
    Object.keys(collectedFields).forEach(responseKey => {
      const subfieldNodes = collectedFields[responseKey];
      const type = finalType.getFields()[subfieldNodes[0].name.value].type;
      field[responseKey] = visitField(field[responseKey], type, subfieldNodes, exeContext);
    });
    return field;
  } else {
    return field;
  }
}

/**
 * A memoized collection of relevant subfields with regard to the return
 * type. Memoizing ensures the subfields are not repeatedly calculated, which
 * saves overhead when resolving lists of values.
 */
function collectSubfields(
  exeContext: GraphQLExecutionContext,
  returnType: GraphQLObjectType,
  fieldNodes: ReadonlyArray<FieldNode>
): Record<string, Array<FieldNode>> {
  let subFieldNodes = Object.create(null);
  const visitedFragmentNames = Object.create(null);
  for (const node of fieldNodes) {
    if (node.selectionSet) {
      subFieldNodes = collectFields(exeContext, returnType, node.selectionSet, subFieldNodes, visitedFragmentNames);
    }
  }
  return subFieldNodes;
}
