import { MongoClient } from "mongodb";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

const env = await load();
const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");
const mongoDB = mongoClient.db("P3_GQL_CHAINED");
const LibrosCollection = mongoDB.collection("libros");
const AutoresCollection = mongoDB.collection("autores");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ LibrosCollection, AutoresCollection }),
});

console.info(`Server ready at ${url}`);
