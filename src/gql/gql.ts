/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetBlogs(\n    $first: Int\n    $after: String\n    $last: Int\n    $before: String\n    $search: String\n  ) {\n    search_blogs_connection(\n      args: { search: $search }\n      first: $first\n      order_by: { ID: desc }\n      after: $after\n      last: $last\n      before: $before\n    ) {\n      edges {\n        node {\n          ID\n          id\n          slug\n          author\n          title\n          created_at\n          views\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n": types.GetBlogsDocument,
    "\n  mutation InsertBlogViews(\n    $hash: String\n    $ip: String\n    $location: String\n    $blog_slug: bpchar = \"\"\n  ) {\n    insert_blog_views(\n      objects: {\n        hash: $hash\n        ip: $ip\n        location: $location\n        blog_slug: $blog_slug\n      }\n    ) {\n      affected_rows\n    }\n  }\n": types.InsertBlogViewsDocument,
    "\n  query GetBlog($slug: String!) {\n    blog(where: { slug: { _eq: $slug } }) {\n      ID\n      title\n      content\n      author\n      slug\n      updated_at\n      created_at\n      views\n    }\n  }\n": types.GetBlogDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBlogs(\n    $first: Int\n    $after: String\n    $last: Int\n    $before: String\n    $search: String\n  ) {\n    search_blogs_connection(\n      args: { search: $search }\n      first: $first\n      order_by: { ID: desc }\n      after: $after\n      last: $last\n      before: $before\n    ) {\n      edges {\n        node {\n          ID\n          id\n          slug\n          author\n          title\n          created_at\n          views\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetBlogs(\n    $first: Int\n    $after: String\n    $last: Int\n    $before: String\n    $search: String\n  ) {\n    search_blogs_connection(\n      args: { search: $search }\n      first: $first\n      order_by: { ID: desc }\n      after: $after\n      last: $last\n      before: $before\n    ) {\n      edges {\n        node {\n          ID\n          id\n          slug\n          author\n          title\n          created_at\n          views\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InsertBlogViews(\n    $hash: String\n    $ip: String\n    $location: String\n    $blog_slug: bpchar = \"\"\n  ) {\n    insert_blog_views(\n      objects: {\n        hash: $hash\n        ip: $ip\n        location: $location\n        blog_slug: $blog_slug\n      }\n    ) {\n      affected_rows\n    }\n  }\n"): (typeof documents)["\n  mutation InsertBlogViews(\n    $hash: String\n    $ip: String\n    $location: String\n    $blog_slug: bpchar = \"\"\n  ) {\n    insert_blog_views(\n      objects: {\n        hash: $hash\n        ip: $ip\n        location: $location\n        blog_slug: $blog_slug\n      }\n    ) {\n      affected_rows\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBlog($slug: String!) {\n    blog(where: { slug: { _eq: $slug } }) {\n      ID\n      title\n      content\n      author\n      slug\n      updated_at\n      created_at\n      views\n    }\n  }\n"): (typeof documents)["\n  query GetBlog($slug: String!) {\n    blog(where: { slug: { _eq: $slug } }) {\n      ID\n      title\n      content\n      author\n      slug\n      updated_at\n      created_at\n      views\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;