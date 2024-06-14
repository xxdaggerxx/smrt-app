import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [process.env.GRAPH_QL || "", process.env.GRAPH_QL_RELAY || ""],
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  debug: true,
  verbose: true,
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
