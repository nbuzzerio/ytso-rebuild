import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth, useUpdateAuth } from "../AuthContext/AuthContext";

import jwt from "jsonwebtoken";

function Header() {
  const [dropDown, setDropDown] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [userName, setUserName] = useState("");
  const auth = useAuth();
  const setAuth = useUpdateAuth();

  const checkAuthToken = async () => {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      if (cookie.includes("x-auth-token=")) {
        const token = cookie.trim().slice(13);
        setAuth(token);
        if (token) setUserName(jwt.decode(token).name);
      }
    });
  };
  const router = useRouter();

  useEffect(() => {
    checkAuthToken();

    document
      .querySelector(".menu-btn-wrapper")
      .addEventListener("click", (e) => {
        document.querySelector(".menu-btn").classList.add("clicked");
      });

    if (dropDown && !loaded) setLoaded(true);
  }, [dropDown, auth]);

  const handleDropDown = () => {
    if (!dropDown) {
      document.body.style.height = "100vh";
      document.body.style.width = "100%";
    } else {
      document.querySelector(".menu-btn").classList.remove("clicked");
    }

    setDropDown(!dropDown);
  };

  const handleLogOut = () => {
    document.cookie = "x-auth-token=";
    setAuth("");
  };

  return (
    <>
      <div className="navbar absolute w-full h-[80px] lg:h-[140px] flex justify-center z-50">
        <nav
          className={`absolute z-10 wrapper max-w-bg w-full h-[80px] lg:h-[140px] flex justify-between items-center bg-red-600 mx-auto`}
        >
          <div className="logo-wrapper px-10 nav-item hidden lg:flex z-10">
            <Link href="/">
              <a href="/">
                <img
                  className="px-2 h-7 lg:h-10 cursor-pointer"
                  src="/images/logo.svg"
                  alt="logo image"
                />
              </a>
            </Link>
          </div>

          <div className="home-wrapper lg:absolute lg:w-full px-10 flex justify-center">
            <Link href="/">
              <a
                title="home"
                className="uppercase text-4xl md:text-6xl lg:text-7xl text-black font-extrabold"
              >
                TEXT LOGO
              </a>
            </Link>
          </div>

          <div className="right-header-wrapper flex items-center nav-item px-10 z-10">
            <div className="login-wrapper flex">
              {!auth && router.pathname !== "/login" && (
                <>
                  <Link href="/login">
                    <a className="sign-in hidden md:flex bg-white shadow-inner px-3 mx-2">
                      Sign In
                    </a>
                  </Link>
                  <Link href="/login?signup=true">
                    <a className="sign-in hidden md:flex bg-white shadow-inner px-3 mx-2">
                      Sign Up
                    </a>
                  </Link>
                </>
              )}
              {auth && (
                <>
                  <div className="loggedIn-wrapper flex flex-col items-center">
                    {userName && (
                      <div className="userName mb-2 uppercase text-sm">
                        Hi, {userName}
                      </div>
                    )}
                    <button
                      className="sign-in flex bg-white shadow-inner px-3 mx-2"
                      onClick={handleLogOut}
                    >
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
            <div
              className="menu-btn-wrapper flex items-center"
              onClick={handleDropDown}
            >
              <div className="uppercase text-black text-2xl lg:text-3xl hidden sm:block tracking-[0.07rem]"></div>
              <div className="menu-btn w-[40px] sm:w-[50px] flex flex-col cursor-pointer">
                <span className="line1 w-1/2"></span>
                <span className="line2 w-full"></span>
                <span className="line3 w-9/12"></span>
              </div>
            </div>
          </div>
          {loaded && (
            <div
              className={`dropdown-wrapper ${
                dropDown ? "animate-open" : "animate-close"
              } fixed h-[calc(100vh-80px)] lg:h-[calc(100vh-140px)] w-full top-[80px] lg:top-[140px] flex justify-end hd:right-[calc((100vw-1937px)/2)]`}
            >
              <div
                className="dropdown-overlay w-0 lg:w-7/12"
                onClick={handleDropDown}
              ></div>
              <ul
                className={
                  "bg-gray-500 bg-cover flex flex-col justify-evenly text-right px-20 py-10 overflow-hidden h-full w-full lg:w-[56%] xl:w-5/12"
                }
              >
                <li className="text-green-400 text-xl xs:text-2xl lg:text-3xl pb-10 uppercase tracking-[.2rem]">
                  Menu
                </li>
                {!auth && router.pathname !== "/login" && (
                  <>
                    <li onClick={handleDropDown}>
                      <Link href="/login">
                        <a className="sign-in md:hidden bg-white shadow-inner px-3 mx-2 w-20">
                          Sign In
                        </a>
                      </Link>
                    </li>
                    <li onClick={handleDropDown}>
                      <Link href="/login?signup=true">
                        <a className="sign-in md:hidden bg-white shadow-inner px-3 mx-2">
                          Sign Up
                        </a>
                      </Link>
                    </li>
                  </>
                )}
                <li className="uppercase tracking-[.2rem]">
                  <Link href="/">
                    <a
                      className="text-green-400 hover:text-red-700 text-2xl xs:text-3xl lg:text-4xl"
                      onClick={handleDropDown}
                    >
                      Home
                    </a>
                  </Link>
                </li>
                <li className="uppercase tracking-[.2rem]">
                  <Link href="/groups">
                    <a
                      className="text-green-400 hover:text-red-700 text-2xl xs:text-3xl lg:text-4xl"
                      onClick={handleDropDown}
                    >
                      Groups
                    </a>
                  </Link>
                </li>
                <li className="uppercase tracking-[.2rem]">
                  <Link href="/subs">
                    <a
                      className="text-green-400 hover:text-red-700 text-2xl xs:text-3xl lg:text-4xl"
                      onClick={handleDropDown}
                    >
                      Subs
                    </a>
                  </Link>
                </li>
                <li className="uppercase tracking-[.2rem]">
                  <Link href="/categories">
                    <a
                      className="text-green-400 hover:text-red-700 text-2xl xs:text-3xl lg:text-4xl"
                      onClick={handleDropDown}
                    >
                      Categories
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}

export default Header;
