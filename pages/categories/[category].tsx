import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext/AuthContext";
import SubsList from "@/components/SubsList";

import CategoryInterface from "@/interfaces/Category";
import Link from "next/link";

export default function Category() {
  const auth = useAuth();
  const router = useRouter();
  const [subsFeed, setSubsFeed] = useState([]);
  const [category, setCategory] = useState<CategoryInterface | null>(null);
  const [deleteSubs, setDeleteSubs] = useState(false);

  useEffect(() => {
    if (auth === "") router.push("/login");

    fetch(
      `${window.location.origin}/api/categories/subs?id=${router.query.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": auth,
        },
      }
    )
      .then((res) => {
        if (!res.ok) console.log("Respons status: ", res.status, res);
        return res.json();
      })
      .then((data) => {
        if (data.error) console.error(data.error);
        else {
          setCategory(data);
        }
      })
      .catch((er) => console.log(er));

    return () => {};
  }, [auth]);

  useEffect(() => {
    if (category) {
      const videos = category.subs.map((sub, i) => {
        return fetch(
          `${window.location.origin}/api/search/subVideos?channelId=${
            sub.channelId
          }${false ? `&&nextPageToken=${""}` : ""}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": auth,
            },
          }
        )
          .then((res) => {
            if (!res.ok) console.log("Respons status: ", res.status, res);
            return res.json();
          })
          .then((data) => {
            if (data.error) console.error(data.error);
            else {
              return data;
            }
          })
          .catch((er) => console.log(er));
      });
      Promise.all(videos).then((videoData) => {
        setSubsFeed(videoData);
      });
    }

    return () => {};
  }, [category]);

  const handleDelete = (e) => {
    const deleteSub = category?.subs.filter(
      (sub) =>
        sub?.channelId ===
        category?.subs[Number(e.target.id.slice(4))]?.channelId
    )[0];

    fetch(`${window.location.origin}/api/categories/sub`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": auth,
      },
      body: JSON.stringify({
        channelId: deleteSub.channelId,
        categoryId: category._id,
      }),
    })
      .then((res) => {
        if (!res.ok) console.log("Respons status: ", res.status, res);
        return res.json();
      })
      .then((data) => {
        if (data.error) console.error(data.error);
        else {
          setCategory({ ...category, subs: data });
        }
      })
      .catch((er) => console.log(er));
  };

  const categorySubList = category?.subs.map((sub, i) => {
    return (
      <div
        className={`sub-wrapper relative flex flex-col items-center bg-gray gap-12 p-5 border border-black my-10 drop-shadow-2xl bg-white/50 transition duration-200 group ${
          category
            ? "hover:bg-black  border-2 border-red-600 hover:text-red-600 cursor-pointer"
            : ""
        }`}
        key={i}
        id={`sub-${i}`}
        onClick={handleDelete}
      >
        <div
          className={`delete-overlay w-full h-full bg-black/75 absolute top-0 left-0 hidden capitalize cursor-pointer ${
            deleteSubs ? "group-hover:flex" : ""
          } justify-center items-center text-3xl text-red-600 pointer-events-none`}
        >
          unsubscribe
        </div>
        <img
          src={sub.channelThumbnails.medium}
          alt="sub thumbnail"
          className="pointer-events-none"
        />
        <div className="sub-info flex flex-col gap-5 pointer-events-none">
          <h2 className="sub-title text-red text-3xl">{sub.subName}</h2>
        </div>
      </div>
    );
  });

  let subFeedVids = subsFeed.reduce((previousValue, currentValue) => {
    return previousValue.concat(currentValue?.items);
  }, []);

  subFeedVids.sort(
    (a: any, b: any) =>
      new Date(b.snippet.publishedAt).valueOf() -
      new Date(a.snippet.publishedAt).valueOf()
  );

  const subFeedVidsList = subFeedVids.map((video: any, i: number) => {
    return (
      <div className="video-wrapper flex flex-col w-full" key={i}>
        <div className="video-header flex justify-between w-full">
          <div className="video-titles-wrapper flex flex-col">
            <a
              href={`https://www.youtube.com/watch?v=${video.contentDetails.videoId}`}
              target="_blank"
              rel="noreferrer"
            >
              <h3 className="video-title text-3xl max-w-prose text-ellipsis overflow-hidden whitespace-nowrap hover:text-red-600">
                {video.snippet.title}
              </h3>
            </a>
            <a
              href={`https://www.youtube.com/c/${video.snippet.channelTitle}`}
              target="_blank"
              rel="noreferrer"
            >
              <h4 className="video-channelTitle text-2xl max-w-prose text-ellipsis overflow-hidden whitespace-nowrap hover:text-red-600">
                {video.snippet.channelTitle}
              </h4>
            </a>
          </div>
          <p className="video-date text-xl italics">
            {new Date(video.snippet.publishedAt).toLocaleDateString()}
          </p>
        </div>
        <img
          src={video.snippet.thumbnails.default.url}
          alt=""
          className="sm:hidden cursor-pointer"
          onClick={(e) => {
            handleOpenVid(e, i);
          }}
        />
        <img
          src={video.snippet.thumbnails.medium.url}
          alt=""
          className="hidden md:block lg:hidden cursor-pointer"
          onClick={(e) => {
            handleOpenVid(e, i);
          }}
        />
        <img
          src={video.snippet.thumbnails.high.url}
          alt=""
          className="hidden lg:block cursor-pointer"
          onClick={(e) => {
            handleOpenVid(e, i);
          }}
        />
        <iframe
          src={`https://www.youtube.com/embed/${video.contentDetails.videoId}`}
          frameBorder="0"
          allowFullScreen
          className="aspect-video hidden"
          id={`iframe-${i}`}
        ></iframe>
      </div>
    );
  });

  const handleOpenVid = (e: any, i: any) => {
    const img = e.target;

    img?.classList.add("hidden");
    img?.classList.add("md:hidden");
    img?.classList.add("lg:hidden");

    const iframe = document.querySelector(`#iframe-${i}`);
    iframe?.classList.remove("hidden");
  };

  return (
    <div className="bg-blue-200">
      <main className="main min-h-[85vh]">
        <Link href="/categories">
          <a>
            <nav className="breadcrumbs underline p-5 hover:text-red-600 transition duration-100">
              categories
            </nav>
          </a>
        </Link>
        <h1 className="text-7xl text-red-600 text-center py-10">
          {category?.categoryName}
        </h1>
        <hr />
        <div className="sub-hub flex flex-col p-10">
          <h2 className="text-center text-3xl uppercase py-3">all subs</h2>
          <SubsList category={category} setCategory={setCategory} />
          <h2 className="text-center text-3xl uppercase py-3">category subs</h2>
          <div className="subs-wrapper w-full flex gap-10 overflow-x-auto">
            {categorySubList}
          </div>
          <h2 className="text-center text-5xl uppercase py-3 text-red-600">
            {category?.categoryName} Feed
          </h2>
          <div className="videos-wrapper w-full flex flex-col items-center justify-center gap-10 overflow-x-auto">
            {subFeedVidsList}
          </div>
        </div>
      </main>
    </div>
  );
}
