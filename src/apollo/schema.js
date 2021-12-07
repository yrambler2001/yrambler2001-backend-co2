import { makeExecutableSchema, gql } from 'apollo-server-express';
import merge from 'lodash/merge';
import { typeDef as DateScalarTypeDef, resolvers as DateScalarResolvers } from './scalars/date';
import AirModel from '../models/index';

const Common = gql`
  type CO2DataItem {
    _id: ID!
    date: DateTime
    co2: Float
    temp: Float
  }
  type CO2Data {
    _id: ID!
    items: [CO2DataItem]
    latestItem: CO2DataItem
  }
  type Query {
    co2Data(from: DateTime!, to: DateTime!): CO2Data
  }

  type Mutation {
    _empty: String
  }
`;
const resolvers = {
  Query: { co2Data: (root, args) => ({ _id: JSON.stringify(args), items: AirModel.findInRange(args.from, args.to), latestItem: AirModel.findLast() }) },
};

const schema = makeExecutableSchema({
  typeDefs: [Common, DateScalarTypeDef],
  resolvers: merge({}, DateScalarResolvers, resolvers),
  schemaDirectives: {},
});

export default schema;
