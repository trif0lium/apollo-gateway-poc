import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";

async function start() {
  try {
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

    await apolloServer.start();
    const app = express();
    apolloServer.applyMiddleware({ app });

    app.listen(5000);
    console.log(process.memoryUsage());
  } catch (e) {
    await start();
  }
}

start();
