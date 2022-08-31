import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext/AuthContext";
import SubsForm from "@/components/SubsForm";
import { useSubs, useUpdateSubs } from "@/components/SubsContext/SubsContext";
import SubsList from "@/components/SubsList";

export default function Subs() {
  const [subsSearch, setSubsSearch] = useState([]);

  const auth = useAuth();
  const subs = useSubs();
  const setSubs = useUpdateSubs();
  const router = useRouter();

  useEffect(() => {
    if (!auth) router.push("/login");

    const lastChannelObserver = new IntersectionObserver((channels) => {
      const lastChannel = channels[0];
      if (!lastChannel.isIntersecting) return;

      const search = document.querySelector("#subs-search") as HTMLInputElement;
      search.click();
    }, {});

    if (subsSearch.length > 0) {
      lastChannelObserver.observe(
        document.querySelector(".searchSub-wrapper:last-child")
      );
    }

    return () => {};
  }, [subsSearch]);

  const handleSubscribe = (e) => {
    if (
      subs.length === 0 ||
      !subs.some(
        (sub) =>
          sub?.channelId ===
          subsSearch[Number(e.target.id.slice(10))]?.id?.channelId
      )
    ) {
      const sub = subsSearch[Number(e.target.id.slice(10))];

      fetch(`http://localhost:3000/api/subs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": auth,
        },
        body: JSON.stringify({
          subName: sub.snippet.channelTitle,
          channelId: sub.id.channelId,
          channelDesc: sub.snippet.description,
          channelThumbnails: {
            default: sub.snippet.thumbnails.default.url,
            medium: sub.snippet.thumbnails.medium.url,
            high: sub.snippet.thumbnails.high.url,
          },
        }),
      })
        .then((res) => {
          if (!res.ok) console.log("Respons status: ", res.status, res);
          return res.json();
        })
        .then((data) => {
          if (data.error) console.error(data.error);
          else {
            setSubs(data);
          }
        })
        .catch((er) => console.log(er));
    }
  };

  const searchSubsList = subsSearch.map((sub, i) => {
    return (
      <div
        className={`searchSub-wrapper relative flex justify-start bg-gray gap-12 w-8/12 p-5 border border-black my-10 drop-shadow-2xl bg-white/50 group ${
          subs.some((sub) => sub?.channelId === subsSearch[i]?.id?.channelId)
            ? "hidden"
            : ""
        }`}
        key={i}
        id={`searchSub-${i}`}
        onClick={handleSubscribe}
      >
        <div className="subscribe-overlay w-full h-full bg-red-600/75 absolute top-0 left-0 hidden capitalize cursor-pointer group-hover:flex justify-center items-center text-5xl text-white pointer-events-none">
          subscribe
        </div>
        <img
          src={sub.snippet.thumbnails.medium.url}
          alt="searchSub thumbnail"
          className="pointer-events-none"
        />
        <div className="searchSub-info flex flex-col gap-5 pointer-events-none">
          <h2 className="searchSub-title text-red text-3xl">
            {sub.snippet.channelTitle}
          </h2>
          <p className="searchSub-desc">{sub.snippet.description}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="bg-blue-200 min-h-full">
      <main className="main">
        <h1 className="text-5xl lg:text-7xl text-red-600 text-center py-10">
          Subscriptions
        </h1>
        <SubsList category={null} setCategory={null} />
        <div className="form-wrapper flex flex-col items-center mx-auto">
          <SubsForm subsSearch={subsSearch} setSearch={setSubsSearch} />
          {searchSubsList}
        </div>
      </main>
    </div>
  );
}
