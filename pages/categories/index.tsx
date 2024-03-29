import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext/AuthContext";
import CategoriesForm from "@/components/CategoriesForm";
import Link from "next/link";

export default function Categories() {
  const [deleteCategories, setDeleteCategories] = useState(false);
  const [categories, setCategories] = useState([]);

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth === "") router.push("/login");

    fetch(`${window.location.origin}/api/categories`, {
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
          setCategories(data);
        }
      })
      .catch((er) => console.log(er));

    return () => {};
  }, [auth]);

  const handleDelete = (e) => {
    const deleteCategory = categories.filter(
      (category) =>
        category?.categoryName ===
        categories[Number(e.target.id.slice(11))]?.categoryName
    )[0];

    fetch(`${window.location.origin}/api/categories`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": auth,
      },
      body: JSON.stringify({
        categoryName: deleteCategory.categoryName,
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
  };

  const categoriesList = categories.map((category, i) => {
    return (
      <div
        key={i}
        className={`categories-wrapper relative flex flex-col items-center bg-gray p-5 border border-black my-2 bg-white/50 transition duration-200 cursor-pointer group rounded-2xl border-2 ${
          deleteCategories
            ? "hover:bg-black border-red-600 hover:text-red-600 pointer-events-auto z-10"
            : ""
        }`}
      >
        <div
          className={`delete-overlay w-full h-full bg-black/75 absolute top-0 left-0 hidden capitalize cursor-pointer ${
            deleteCategories ? "group-hover:flex rounded-2xl" : ""
          } justify-center items-center text-3xl text-red-600`}
          id={`categories-${i}`}
          onClick={(e) => {
            if (deleteCategories) handleDelete(e);
          }}
        >
          delete
        </div>
        <h2 className="sub-title text-red text-3xl">{category.categoryName}</h2>
        <Link
          href={{
            pathname: `/categories/${category.categoryName
              .toLowerCase()
              .replace(/ /g, "-")}`,
            query: { id: category._id },
          }}
          className={`${
            deleteCategories ? "hidden" : ""
          } w-full h-full absolute top-0 left-0`}
        ></Link>
      </div>
    );
  });

  return (
    <div className="bg-blue-200 h-full">
      <main className="main">
        <h1 className="text-7xl text-red-600 text-center py-10">Categories</h1>
        <div className="categories-container flex flex-col items-center lg:items-start gap-5 px-10">
          {router.pathname === "/categories" && (
            <button
              className={`delete-category transition duration-1000 p-5 rounded-2xl uppercase w-full md:w-auto ${
                deleteCategories
                  ? " bg-black  text-red-600"
                  : "bg-red-600  text-white "
              } ${categories.length > 0 ? "" : "hidden"}`}
              onClick={() => setDeleteCategories(!deleteCategories)}
            >
              Delete Categories
            </button>
          )}
          <div className="w-full flex md:gap-10 overflow-x-auto flex-col md:flex-row">
            {categoriesList}
          </div>
        </div>
        <div className="form-wrapper flex flex-col items-center mx-auto">
          <CategoriesForm
            categories={categories}
            setCategories={setCategories}
          />
        </div>
      </main>
    </div>
  );
}
