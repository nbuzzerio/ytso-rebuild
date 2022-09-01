import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import categorySchema from "../../validations/categorySchema";
import { useAuth } from "../AuthContext/AuthContext";
import { useState } from "react";

type Props = yup.InferType<typeof categorySchema>;

const CategoriesForm: NextPage<{ categories; setCategories }> = ({
  categories,
  setCategories,
}) => {
  const [dupWarning, setDupWarning] = useState(false);
  const auth = useAuth();

  function onSubmit(data) {
    if (
      !categories.some((category) => category.categoryName === data.category)
    ) {
      fetch(`${window.location.origin}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": auth,
        },
        body: JSON.stringify({
          category: data.category,
        }),
      })
        .then((res) => {
          if (!res.ok) console.log("Respons status: ", res.status, res);
          return res.json();
        })
        .then((data) => {
          if (data.error) console.error(data.error);
          else {
            setCategories(data);
          }
        })
        .catch((er) => console.log(er));
    } else {
      setDupWarning(true);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Props>({
    resolver: yupResolver(categorySchema),
  });

  return (
    <div className="form-type w-10/12 lg:w-6/12 bg-zinc-400 my-3 lg:my-20 rounded-2xl shadow-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col py-5 px-10"
      >
        <div className="form-input-wrapper flex flex-col my-3">
          <input
            type="text"
            id="category"
            minLength={0}
            maxLength={50}
            placeholder="Category"
            {...register("category")}
            className={`p-3 ${errors["name"] ? "bg-red-100" : ""}`}
            onChange={() => setDupWarning(false)}
          />
          <input
            type="submit"
            value="submit"
            className="my-5 p-3 bg-white hover:bg-gray-800 hover:text-white"
          />
          <span className="text-red-600 text-center text-sm">
            {errors["category"]?.message}
          </span>
          {dupWarning && (
            <span className="text-red-600 text-center text-sm">
              Category already exists
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoriesForm;
