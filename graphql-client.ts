import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(
  "https://smrt-db-test.fly.dev/v1/graphql"
);

export const relayClient = new GraphQLClient(
  "https://smrt-db-test.fly.dev/v1beta1/relay"
);
