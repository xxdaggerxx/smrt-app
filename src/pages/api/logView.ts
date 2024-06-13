// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../graphql-client";
import { GetBlogsQuery } from "@/gql/graphql";
import { gql } from "graphql-request";

//insert view
const INSERT_BLOG_VIEW = gql`
  mutation InsertBlogViews(
    $hash: String
    $ip: String
    $location: String
    $blog_slug: bpchar = ""
  ) {
    insert_blog_views(
      objects: {
        hash: $hash
        ip: $ip
        location: $location
        blog_slug: $blog_slug
      }
    ) {
      affected_rows
    }
  }
`;

interface CustomApiRequest extends NextApiRequest {
  query: {
    slug?: string;
  };
}

export default async function handler(
  req: CustomApiRequest,
  res: NextApiResponse<GetBlogsQuery | unknown>
) {
  try {
    //log the view
    const slug = req.query.slug;
    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(/, /)[0]
        : req.socket.remoteAddress;

    //https://api.iplocation.net/?ip=220.255.198.67

    fetch(`https://api.iplocation.net/?ip=${ip}`)
      .then(async (response) => {
        return await response.json();
      })
      .then(async (x) => {
        return await client.request(INSERT_BLOG_VIEW, {
          hash: cyrb53(ip + "+++" + slug) + "",
          ip: ip,
          location: x.country_name,
          blog_slug: slug,
        });
      })
      .then(() => {
        ///all APIs success
        res.status(200).json({ slug, ip });
      })
      .catch((e) => {
        //error occured
        res.status(400).json(e);
      });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
}

// hashing function
function cyrb53(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
