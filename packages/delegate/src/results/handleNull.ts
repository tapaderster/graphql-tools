import AggregateError from 'aggregate-error';
import { RelativeGraphQLError } from '@graphql-tools/utils';

export function handleNull(errors: Array<RelativeGraphQLError>) {
  if (errors.length) {
    if (errors.length > 1) {
      return new AggregateError(errors.map(error => error.graphQLError));
    }

    return errors[0].graphQLError;
  }

  return null;
}
