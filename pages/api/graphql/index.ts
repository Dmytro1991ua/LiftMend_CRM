import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import typeDefs from "./schemas";
import resolvers from "./resolvers";

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const server = new ApolloServer({
  schema,
  introspection: process.env.NODE_ENV !== "production",
});

export default startServerAndCreateNextHandler(server);
