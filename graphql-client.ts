import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(
  "https://polished-coral-89.hasura.app/v1/graphql"
);

export const relayClient = new GraphQLClient(
  "https://polished-coral-89.hasura.app/v1beta1/relay"
);
