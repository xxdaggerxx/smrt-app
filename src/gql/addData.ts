import { GraphQLClient, gql } from "graphql-request";
import { generate, count } from "random-words";

// Initialize the GraphQL client
const endpoint = "https://polished-coral-89.hasura.app/v1/graphql";
const client = new GraphQLClient(endpoint, {
  headers: {
    "x-hasura-admin-secret":
      "fnLCtKGI4y9uSXf0WMOJZFpcutFkXhoLp114pD5voOLjCg6XhXeT4VlPg5kVW0c9",
  },
});

// inserting articles
const INSERT_ARTICLES = gql`
  mutation InsertBlog($articles: [blog_insert_input!]!) {
    insert_blog(objects: $articles) {
      affected_rows
    }
  }
`;

// to generate random articles
export const generateRandomArticles = (count: number) => {
  const articles = [];
  for (let i = 0; i < count; i++) {
    const title = generate({ min: 5, max: 10 }) as string[];
    articles.push({
      title: toTitleCase(title.join(" ")),
      content: (generate({ min: 50, max: 400 }) as string[]).join(" "),
      author: toTitleCase((generate({ min: 2, max: 2 }) as string[]).join(" ")),
      slug: title.join("-").toLowerCase(),
    });
  }
  return articles;
};

// Main function to insert articles
export const insertArticles = async () => {
  const articles = generateRandomArticles(1000);
  try {
    const data = await client.request(INSERT_ARTICLES, { articles });
    console.log(`Inserted  articles successfully!`);
  } catch (error) {
    console.error("Error inserting articles:", error);
  }
};

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
