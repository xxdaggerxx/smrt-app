import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    "https://polished-coral-89.hasura.app/v1/graphql",
    "https://polished-coral-89.hasura.app/v1beta1/relay",
  ],
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
