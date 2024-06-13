import { useRouter } from "next/router";
import styles from "@/styles/Article.module.scss";
import Image from "next/image";
import { client } from "../../../graphql-client";
import { GetServerSideProps } from "next";
import { graphql } from "@/gql";
import { Blog } from "@/gql/graphql";
import { gql } from "graphql-request";
import { ParsedUrlQuery } from "querystring";

const dayjs = require("dayjs");
/*
Need to create a better schema
*/
const GET_BLOG_BY_SLUG = graphql(`
  query GetBlog($slug: String!) {
    blog(where: { slug: { _eq: $slug } }) {
      ID
      title
      content
      author
      slug
      updated_at
      created_at
    }
  }
`);

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

type BlogNew = Blog & { ip: string };
const Article = (article: Blog & { ip: string }) => {
  console.log(article);

  return (
    <main className={`${styles.main}`}>
      <header>
        <div>
          <h1>{article.title}</h1>
          <span className={styles.caption}>
            By {article.author}, {article?.created_at} , {article?.ip}
          </span>
        </div>
        <span className={styles.blogView}>
          <Image
            width={30}
            height={30}
            src={"/icons/eye-solid2.svg"}
            alt="view counter"
          ></Image>
          <span className={styles.viewCount}>{article?.views}</span>
        </span>
      </header>
      <article>{article.content}</article>
    </main>
  );
};

export default Article;

interface Params extends ParsedUrlQuery {
  slug: string;
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  const { slug } = context.params as Params;

  try {
    // get blog details
    const data = await client.request(GET_BLOG_BY_SLUG, { slug });
    data.blog[0].created_at = dayjs(data.blog[0].created_at).format(
      "MMMM D, YYYY"
    );

    //log the view
    const forwarded = context.req.headers["x-forwarded-for"];
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(/, /)[0]
        : context.req.socket.remoteAddress;

    //https://api.iplocation.net/?ip=220.255.198.67

    fetch("https://api.iplocation.net/?ip=220.255.198.67")
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
      })
      .catch((e) => {
        //error occured
        //  console.log("ERROR", e);
      });

    return {
      props: { ...data?.blog?.[0], ip },
    };
  } catch (e) {
    //redirect if error.
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }
};

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
