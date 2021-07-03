import { makeExecutableSchema, gql } from 'apollo-server-express';
import merge from 'lodash/merge';

const Common = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [Common],
  resolvers: merge({}),
  schemaDirectives: {},
});

export default schema;
