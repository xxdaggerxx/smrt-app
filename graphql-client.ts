import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(process.env.GRAPH_QL || "");

export const relayClient = new GraphQLClient(process.env.GRAPH_QL_RELAY || "");
