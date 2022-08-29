import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext/AuthContext";
import SubsList from "@/components/SubsList";

import CategoryInterface from "@/interfaces/Category";
import Link from "next/link";

export default function Category() {
  const auth = useAuth();
  const router = useRouter();
  const [feedSubs, setFeedSubs] = useState([]);
  const [category, setCategory] = useState<CategoryInterface | null>(null);
  const [deleteSubs, setDeleteSubs] = useState(false);

  useEffect(() => {
    if (auth === "") router.push("/login");

    fetch(`http://localhost:3000/api/categories/subs?id=${router.query.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": auth,
      },
    })
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

  const handleDelete = (e) => {
    const deleteSub = category?.subs.filter(
      (sub) =>
        sub?.channelId ===
        category?.subs[Number(e.target.id.slice(4))]?.channelId
    )[0];

    fetch(`http://localhost:3000/api/categories`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": auth,
      },
      body: JSON.stringify({
        channelId: deleteSub.channelId,
        categoryId: category._id
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

  return (
    <div className="bg-blue-200">
      <main className="main min-h-[85vh]">
        <Link href="/categories">
          <a>
            <nav className="breadcrumbs underline p-5 hover:text-red-600 transition duration-100">categories</nav>
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
        </div>
      </main>
    </div>
  );
}
