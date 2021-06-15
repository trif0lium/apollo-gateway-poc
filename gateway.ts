import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";
var cluster = require("cluster");

class ServerInstance {
  private static instance: ServerInstance = null;
  private gateway: ApolloGateway;
  private apolloServer: ApolloServer;
  private app = express();

  public static getInstance(): ServerInstance {
    if (!ServerInstance.instance) {
      const instance = new ServerInstance();
      ServerInstance.instance = instance;
    }
    return ServerInstance.instance;
  }

  private reInit() {
    this.gateway = new ApolloGateway({
      experimental_pollInterval: 1000,
      serviceList: [
        {
          name: "cat",
          url: "http://localhost:5008",
        },
      ],
    });
    this.apolloServer = new ApolloServer({
      gateway: this.gateway,
      introspection: true,
      playground: true,
      subscriptions: false,
    });
  }

  private async listen() {
    await this.apolloServer.start();
    this.apolloServer.applyMiddleware({ app: this.app });
    this.app.listen(5000);
    console.log(process.memoryUsage());
  }

  public async start() {
    this.reInit();
    await this.listen();
  }
}

async function main() {
  if (cluster.isMaster) {
    cluster.fork();
    cluster.on("exit", function (worker, code, signal) {
      cluster.fork();
    });
  }

  if (cluster.isWorker) {
    await ServerInstance.getInstance().start();
  }
}

main();
