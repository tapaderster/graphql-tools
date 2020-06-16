import { GraphQLResolveInfo, getNullableType, isCompositeType, isLeafType, isListType, GraphQLSchema } from 'graphql';

import { RelativeGraphQLError } from '@graphql-tools/utils';

import { SubschemaConfig } from '../types';

import { handleNull } from './handleNull';
import { handleObject } from './handleObject';
import { handleList } from './handleList';

export function handleResult(
  result: any,
  errors: Array<RelativeGraphQLError>,
  subschema: GraphQLSchema | SubschemaConfig,
  context: Record<string, any>,
  info: GraphQLResolveInfo,
  returnType = info.returnType,
  skipTypeMerging?: boolean
): any {
  const type = getNullableType(returnType);

  if (result == null) {
    return handleNull(errors);
  }

  if (isLeafType(type)) {
    return type.parseValue(result);
  } else if (isCompositeType(type)) {
    return handleObject(type, result, errors, subschema, context, info, skipTypeMerging);
  } else if (isListType(type)) {
    return handleList(type, result, errors, subschema, context, info, skipTypeMerging);
  }
}
