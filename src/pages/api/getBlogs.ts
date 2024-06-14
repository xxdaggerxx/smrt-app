// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { graphql } from "@/gql";
import { relayClient } from "../../../graphql-client";
import { GetBlogsQuery } from "@/gql/graphql";

const GET_BLOGS = graphql(`
  query GetBlogs(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $search: String
  ) {
    search_blogs_connection(
      args: { search: $search }
      first: $first
      order_by: { ID: desc }

      after: $after
      last: $last
      before: $before
    ) {
      edges {
        node {
          ID
          id
          slug
          author
          title
          created_at
          views
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`);


const getBlogs = async (
  first?: number | null, //after
  last?: number | null, //before
  after?: string | null, //first
  before?: string | null, //last
  search?: string | null
) => {
  const variables = {
    first: first || null,
    after: after || null,
    last: last || null,
    before: before || null,
    search: search || null,
  };
  //console.log("variables", variables);
  const data = await relayClient.request(GET_BLOGS, variables);
  return data;
};

interface CustomApiRequest extends NextApiRequest {
  query: {
    after?: string;
    before?: string;
    count?: string;
    search?: string;
    
  };
}

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse<GetBlogsQuery | null>
) {
  try {
    let after;
    if (!req?.query?.after && !req?.query?.before) {
      after = Number(req?.query?.count) || 5;
    } else {
      after = req?.query?.after ? Number(req?.query?.count) || 5 : null;
    }
    // console.log(req?.query?.search);
    const blogs = await getBlogs(
      after, //after
      req?.query?.before ? Number(req?.query?.count) || 5 : null, // before
      req?.query?.after,
      req?.query?.before,
      req?.query?.search
    );
    res.status(200).json(blogs);
  } catch (e) {
    console.log(e);
    res.status(400).json(null);
  }
}
