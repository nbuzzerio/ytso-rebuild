import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext/AuthContext";
import SubsForm from "@/components/subsForm";

export default function Subs() {
  const [subsSearch, setSubsSearch] = useState([]);

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("auth: ", auth);
    if (!auth) router.push("/login");

    return () => {};
  }, []);

  const searchSubsList = subsSearch.map((sub, i) => {
    return (
      <div
        className="sub-wrapper flex justify-between bg-gray gap-12 w-8/12"
        key={i}
      >
        <img src={sub.snippet.thumbnails.default.url} alt="sub thumbnail" />
        <h2 className="sub-title text-red text-3xl">
          {sub.snippet.channelTitle}
        </h2>
      </div>
    );
  });

  return (
    <div className="bg-blue-200 h-screen">
      <main className="main">
        <h1 className="text-7xl text-green-400 text-center py-10">
          Subscriptions
        </h1>
        <div className="form-wrapper flex flex-col items-center mx-auto">
          <SubsForm setSearch={setSubsSearch} />
          {searchSubsList}
        </div>
      </main>
    </div>
  );
}
