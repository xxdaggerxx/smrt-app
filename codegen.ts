import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    "https://smrt-db-test.fly.dev/v1/graphql",
    "https://smrt-db-test.fly.dev/v1beta1/relay",
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
