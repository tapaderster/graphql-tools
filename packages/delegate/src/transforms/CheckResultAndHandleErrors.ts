import { GraphQLResolveInfo, ExecutionResult, GraphQLOutputType, GraphQLSchema } from 'graphql';

import { Transform, getResponseKeyFromInfo, RelativeGraphQLError, toRelativeError } from '@graphql-tools/utils';
import { handleResult } from '../results/handleResult';
import { SubschemaConfig } from '../types';

export default class CheckResultAndHandleErrors implements Transform {
  private readonly context?: Record<string, any>;
  private readonly info: GraphQLResolveInfo;
  private readonly fieldName?: string;
  private readonly subschema?: GraphQLSchema | SubschemaConfig;
  private readonly returnType?: GraphQLOutputType;
  private readonly typeMerge?: boolean;

  constructor(
    info: GraphQLResolveInfo,
    fieldName?: string,
    subschema?: GraphQLSchema | SubschemaConfig,
    context?: Record<string, any>,
    returnType: GraphQLOutputType = info.returnType,
    typeMerge?: boolean
  ) {
    this.context = context;
    this.info = info;
    this.fieldName = fieldName;
    this.subschema = subschema;
    this.returnType = returnType;
    this.typeMerge = typeMerge;
  }

  public transformResult(result: any): any {
    return checkResultAndHandleErrors(
      result,
      this.context != null ? this.context : {},
      this.info,
      this.fieldName,
      this.subschema,
      this.returnType,
      this.typeMerge
    );
  }
}

export function checkResultAndHandleErrors(
  result: ExecutionResult,
  context: Record<string, any>,
  info: GraphQLResolveInfo,
  responseKey: string = getResponseKeyFromInfo(info),
  subschema?: GraphQLSchema | SubschemaConfig,
  returnType: GraphQLOutputType = info.returnType,
  skipTypeMerging?: boolean
): any {
  const errors: Array<RelativeGraphQLError> =
    result.errors != null ? result.errors.map(error => toRelativeError(error, info)) : [];
  const data = result.data != null ? result.data[responseKey] : undefined;

  return handleResult(data, errors, subschema, context, info, returnType, skipTypeMerging);
}
