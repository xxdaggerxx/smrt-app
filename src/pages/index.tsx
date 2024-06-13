import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";

import { useEffect, useMemo, useRef, useState } from "react";
import { GetBlogsQuery } from "@/gql/graphql";
import dayjs from "dayjs";

type BlogList = {
  author: string;
  created_at: string;
  slug: string;
  title: string;
  views: number;
  id: number;
};

type Pagination = {
  after?: string;
  before?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export default function Home() {
  const DEFAULT_COUNT = 3;
  const router = useRouter();
  const [blogList, setBlogList] = useState<BlogList[]>([]);

  const page = useRef<string>(DEFAULT_COUNT + "");

  const [pagination, setPagination] = useState<Pagination>({
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window?.location?.search);
    const after = urlParams.get("after");
    const before = urlParams.get("before");
    const count = urlParams.get("count") || DEFAULT_COUNT + "";
    page.current = count;
    console.log(after, before, count);
    getBlogsData(after, before, count);
  }, [router.asPath]);

  //get blogs
  const getBlogsData = (
    after?: string | null,
    before?: string | null,
    count?: string | null
  ) => {
    setBlogList([]);

    let url = new URL(window.location.origin + "/api/getBlogs");
    let params = url.searchParams;
    if (after) params.append("after", after);
    if (before) params.append("before", before);
    params.append("count", count + "");
    console.log(url.toString());
    fetch(url.toString())
      .then(async (response) => {
        const data = (await response.json()) as GetBlogsQuery;
        console.log(data);

        setBlogList(
          data.blog_connection.edges.map((x) => ({
            author: x.node.author || "",
            created_at: dayjs(x.node.created_at || "").format(
              "MMMM D, YYYY, HH:MM"
            ),
            slug: x.node.slug || "",
            title: x.node.title || "",
            views: x.node.views || 0,
            id: x.node.ID,
          }))
        );
        setPagination({
          hasNextPage: data.blog_connection.pageInfo.hasNextPage,
          hasPreviousPage: data.blog_connection.pageInfo.hasPreviousPage,
          after: data.blog_connection.pageInfo.endCursor,
          before: data.blog_connection.pageInfo.startCursor,
        });
      })
      .catch((x) => {
        setBlogList([]);
        console.error(x);
      });
  };

  const getList = useMemo(() => {
    return blogList.map((x) => (
      <li
        key={x.id}
        onClick={() => {
          router.push(`/article/${x.slug}`);
        }}
      >
        <span>
          <h2>
            {x.title} {x.id}
          </h2>
          <span className={styles.blogDetails}>
            By {x.author}, {x.created_at}
          </span>
        </span>
        <span className={styles.blogView}>
          <Image
            width={30}
            height={30}
            src={"/icons/eye-solid2.svg"}
            alt="view counter"
          ></Image>
          <span className={styles.viewCount}>{x.views}</span>
        </span>
      </li>
    ));
  }, [blogList]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <header>
          <h1>Demo Blog</h1>
          <input
            type="text"
            placeholder="Search Blog..."
            id="fname"
            name="fname"
            className="searchInput"
          />
        </header>
        <section>
          <ul className={styles.blogList}>
            {blogList.length > 0 && getList}
            {blogList.length == 0 && (
              <h2 className={styles.centered}>Loading...</h2>
            )}
          </ul>
        </section>
        <nav>
          <div
            className={!pagination.hasPreviousPage ? styles.disabled : ""}
            onClick={() => {
              if (pagination.hasPreviousPage)
                router.push(
                  `/?count=${page.current}&before=${pagination.before}`
                );
            }}
          >
            <Image
              width={20}
              height={20}
              src={"/icons/left-arrow.svg"}
              alt="view counter"
            ></Image>
            Prev
          </div>
          <div
            className={!pagination.hasNextPage ? styles.disabled : ""}
            onClick={() => {
              if (pagination.hasNextPage)
                router.push(
                  `/?count=${page.current}&after=${pagination.after}`
                );
            }}
          >
            Next{" "}
            <Image
              width={20}
              height={20}
              src={"/icons/right-arrow.svg"}
              alt="view counter"
            ></Image>
          </div>
        </nav>
      </main>
    </>
  );
}
