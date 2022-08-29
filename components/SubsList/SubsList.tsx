import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { useSubs, useUpdateSubs } from "../SubsContext/SubsContext";

import Category from "@/interfaces/Category";

const SubsList: NextPage<{ category: Category; setCategory: any }> = ({
  category,
  setCategory,
}) => {
  const [deleteSubs, setDeleteSubs] = useState(false);
  const auth = useAuth();
  const subs = useSubs();
  const setSubs = useUpdateSubs();

  const router = useRouter();

  useEffect(() => {
    return () => {};
  }, [auth]);

  const handleDelete = (e: any) => {
    const deleteSub = subs.filter(
      (sub) => sub?.channelId === subs[Number(e.target.id.slice(4))]?.channelId
    )[0];

    fetch(`http://localhost:3000/api/subs`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": auth,
      },
      body: JSON.stringify({
        channelId: deleteSub.channelId,
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
  };

  const handleAddSub = (e: any) => {
    const addSub = subs.filter(
      (sub) => sub?.channelId === subs[Number(e.target.id.slice(4))]?.channelId
    )[0];

    fetch(`http://localhost:3000/api/categories`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": auth,
      },
      body: JSON.stringify({
        sub: addSub,
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
          setCategory({ ...category, subs: data.subs });
        }
      })
      .catch((er) => console.log(er));
  };

  const subsList = subs.map((sub, i) => {
    return (
      <div
        className={`sub-wrapper relative flex flex-col items-center bg-gray gap-12 p-5 border border-black my-10 drop-shadow-2xl bg-white/50 transition duration-200 group ${
          deleteSubs || category
            ? "hover:bg-black  border-2 border-red-600 hover:text-red-600 cursor-pointer"
            : ""
        }`}
        key={i}
        id={`sub-${i}`}
        onClick={(e) => {
          if (deleteSubs) handleDelete(e);
          if (category) handleAddSub(e);
        }}
      >
        <div
          className={`delete-overlay w-full h-full bg-black/75 absolute top-0 left-0 hidden capitalize cursor-pointer ${
            deleteSubs || category ? "group-hover:flex" : ""
          } justify-center items-center text-3xl text-red-600 pointer-events-none`}
        >
          {deleteSubs ? "unsubscribe" : "Subscribe"}
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
    <div className="subs-container flex flex-col items-start gap-5 px-10">
      {router.pathname === "/subs" && (
        <button
          className={`delete-sub  transition duration-1000 p-5 rounded-2xl uppercase ${
            deleteSubs ? " bg-black  text-red-600" : "bg-red-600  text-white "
          } ${subs.length > 0 ? "" : "hidden"}`}
          onClick={() => setDeleteSubs(!deleteSubs)}
        >
          Delete Subs
        </button>
      )}
      {/* {router.pathname.includes("/categories") && (
        <button
          className={`add-sub  transition duration-1000 p-5 rounded-2xl uppercase ${
            deleteSubs ? " bg-black  text-red-600" : "bg-red-600  text-white "
          } ${subs.length > 0 ? "" : "hidden"}`}
          onClick={(e) => handleAddSub(e)}
        >
          Add Subs
        </button>
      )} */}
      <div className="subs-wrapper w-full flex gap-10 overflow-x-auto">
        {subsList}
      </div>
    </div>
  );
};

export default SubsList;
