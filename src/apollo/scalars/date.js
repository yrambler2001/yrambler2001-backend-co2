import { gql } from 'apollo-server-express';
import GraphQLDateTime from 'graphql-type-datetime';

export const typeDef = gql`
  scalar DateTime
`;

export const resolvers = {
  DateTime: GraphQLDateTime,
};
