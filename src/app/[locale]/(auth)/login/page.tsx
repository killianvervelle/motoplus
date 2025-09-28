"use client";

import Link from "next/link";

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
    <section className="section">
      <div className="container pt-12 2xl:pt-36 xl:pt-28 2xl:pb-60">
        <div className="row">
          <div className="col-11 sm:col-9 md:col-7 mx-auto">
            <div className="mb-14 text-center">
              <h2 className="max-md:h1 md:mb-2">Login</h2>
              <p className="md:text-lg">
                Please fill your email and password to login
              </p>
            </div>

            <button
              onClick={() => handleLogin()}
              className="btn btn-primary md:text-lg md:font-medium w-full mt-10 hover:bg-gray-700"
            >
              Log in with Email
            </button>

            <div className="flex gap-x-2 text-sm md:text-base mt-4">
              <p className="text-text-light dark:text-darkmode-text-light">
                Don&apos;t have an account?
              </p>
              <Link
                className="hover:underline font-medium text-text-dark dark:text-darkmode-text-dark"
                href={"/sign-up"}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

export default Login;
