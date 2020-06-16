import { GraphQLError, responsePathAsArray, GraphQLResolveInfo } from 'graphql';

export const ERROR_SYMBOL = Symbol('subschemaErrors');

export interface RelativeGraphQLError {
  relativePath: Array<string | number>;
  graphQLError: GraphQLError;
}

export function relocatedError(originalError: GraphQLError, path?: ReadonlyArray<string | number>): GraphQLError {
  return new GraphQLError(
    originalError.message,
    originalError.nodes,
    originalError.source,
    originalError.positions,
    path === null ? undefined : path === undefined ? originalError.path : path,
    originalError.originalError,
    originalError.extensions
  );
}

export function slicedError(originalError: GraphQLError) {
  return relocatedError(originalError, originalError.path != null ? originalError.path.slice(1) : undefined);
}

export function getErrorsByPathSegment(
  errors: Array<RelativeGraphQLError>
): Record<string, Array<RelativeGraphQLError>> {
  const record: Record<string, Array<RelativeGraphQLError>> = Object.create(null);
  errors.forEach(error => {
    if (!error.relativePath || error.relativePath.length < 2) {
      return;
    }

    const pathSegment = error.relativePath[1];

    const current: Array<RelativeGraphQLError> = pathSegment in record ? record[pathSegment] : [];
    current.push({
      relativePath: error.relativePath.slice(1),
      graphQLError: error.graphQLError,
    });
    record[pathSegment] = current;
  });

  return record;
}

export function toRelativeError(error: Readonly<GraphQLError>, info: GraphQLResolveInfo): RelativeGraphQLError {
  const relativePath = error.path?.slice() || [];
  const sourcePath = info != null ? responsePathAsArray(info.path) : [];
  return {
    relativePath,
    graphQLError: relocatedError(error, sourcePath.concat(relativePath.slice(1))),
  };
}

export function sliceRelativeError(error: RelativeGraphQLError): RelativeGraphQLError {
  return {
    ...error,
    relativePath: error.relativePath.slice(1),
  };
}

export function setErrors(result: any, errors: Array<RelativeGraphQLError>) {
  result[ERROR_SYMBOL] = errors;
}

export function getErrors(result: any, pathSegment: string): Array<RelativeGraphQLError> {
  const errors = result != null ? result[ERROR_SYMBOL] : result;

  if (!Array.isArray(errors)) {
    return null;
  }

  const fieldErrors = [];

  for (const error of errors) {
    if (!error.relativePath || error.relativePath[0] === pathSegment) {
      fieldErrors.push(error);
    }
  }

  return fieldErrors;
}
