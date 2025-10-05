"use client";

import Link from "next/link";
import { translateClient } from "@/lib/utils/translateClient";

const Login = () => {
  const handleLogin = () => {
    // Optionally remember where the user was before clicking Login
    sessionStorage.setItem(
      "postLoginRedirect",
      window.location.pathname || "/"
    );

    // Kick off the OAuth / PKCE login flow
    window.location.href = "/api/customer/auth/login";
  };

  return (
    <section className="flex-1 flex flex-col">
      <div className="container py-28 md:py-36 xl:py-44 2xl:py-52 max-w-5xl">
        <div className="row">
          <div className="col-7 md:col-6 lg:col-4 mx-auto">
            <div className="mb-14 text-center">
              <h2 className="max-md:h1 md:mb-2">{translateClient("login", "login")}</h2>
              <p className="md:text-lg">
                {translateClient("login", "fill")}
              </p>
            </div>

            <button
              onClick={() => handleLogin()}
              className="btn btn-primary md:text-lg md:font-medium w-full hover:bg-gray-700"
            >
              {translateClient("login", "login-email")}
            </button>

            <div className="flex gap-x-2 text-sm md:text-base mt-4">
              <p className="text-text-light dark:text-darkmode-text-light">
                {translateClient("login", "no-account")}
              </p>
              <Link
                className="hover:underline font-medium text-text-dark dark:text-darkmode-text-dark"
                href={"/sign-up"}
              >
                {translateClient("login", "register")}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-1" />
      </div>
    </section >
  );
};

export default Login;
