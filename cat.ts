import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const typeDefs = gql`
  type Query {
    cat: String!
  }
`;

const resolvers = {
  Query: {
    cat: () => `${Date.now()}`,
  },
};

new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
}).listen(5001);
