const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    searchPizza(location: String!): [Place]
    searchJuice(location: String!): [Place]
    searchCombo(location: String!): [Place]
  }

  type Place {
    name: String
    address: String
    rating: Float
    phone: String
  }
`;

module.exports = typeDefs;

module.exports = { typeDefs };
