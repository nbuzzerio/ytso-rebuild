import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import searchSchema from "../../validations/searchSchema";
import { useAuth } from "../AuthContext/AuthContext";

type Props = yup.InferType<typeof searchSchema>;

const SearchForm: NextPage<{ setSearch }> = ({ setSearch }) => {
  const auth = useAuth();
  const [subsNextPageToken, setSubsNextPageToken] = useState('');

  useEffect(() => {
    return () => {};
  }, []);

  function onSubmit(data) {
    console.log("data:", data.search);

    fetch(`http://localhost:3000/api/search?q=${data.search}${subsNextPageToken ? `&&nextPageToken=${subsNextPageToken}` : ''}`, {
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
          setSearch(data.items);
          setSubsNextPageToken(data.nextPageToken);
        }
      })
      .catch((er) => console.log(er));
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Props>({
    resolver: yupResolver(searchSchema),
  });

  return (
    <div className="form-type w-10/12 lg:w-6/12 bg-zinc-400 my-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col py-5 px-10"
      >
        <div className="form-input-wrapper flex flex-col my-3">
          <input
            type="text"
            id="search"
            minLength={0}
            maxLength={255}
            placeholder="Search"
            {...register("search")}
            className={`p-3 ${errors["name"] ? "bg-red-100" : ""}`}
          />
          <input
            type="submit"
            value="submit"
            className="my-5 p-3 bg-white hover:bg-gray-800 hover:text-white"
          />
          <span className="text-red-600 text-center text-sm">
            {errors["search"]?.message}
          </span>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
