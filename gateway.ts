import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: "cat",
      url: "http://localhost:5001",
    },
  ],
});

const apolloServer = new ApolloServer({
  gateway,
  introspection: true,
  playground: true,
  subscriptions: false,
});

const app = express();
apolloServer.applyMiddleware({ app });

app.listen(5000);
