import { useRouter } from "next/router";
import styles from "@/styles/Article.module.scss";
import Image from "next/image";
import { client } from "../../../graphql-client";
import { GetServerSideProps } from "next";
import { graphql } from "@/gql";
import { Blog } from "@/gql/graphql";
import { gql } from "graphql-request";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";

const dayjs = require("dayjs");

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

const Article = (article: Blog) => {
  useEffect(() => {
    //log view after 1s
    setTimeout(logView, 500);
  }, []);

  const logView = () => {
    fetch(`/api/logView?slug=${article.slug}`)
      .then(async (x) => {
        console.log("View Logged", await x.json());
      })
      .catch((x) => console.error(x));
  };

  return (
    <main className={`${styles.main}`}>
      <header>
        <div>
          <h1>{article.title}</h1>
          <span className={styles.caption}>
            By {article.author}, {article?.created_at}
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

    return {
      props: { ...data?.blog?.[0] },
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
