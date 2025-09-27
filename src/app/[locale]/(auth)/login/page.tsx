"use client";

import Link from "next/link";
import { FormEvent, useState, ChangeEvent } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { sendSignInLink } from '@/lib/shopify'

const Login = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true);
    setError(null)
    try {
      const res = await sendSignInLink(email)
      const errs = res.body.data.customerRecover.userErrors
      if (errs.length) setError(errs.map(e => e.message).join(', '))
      else setSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


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

            {!sent ? (
              <form onSubmit={handleSubmit}>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>

                {error && <p className="text-red-600 text-sm">Failed to login, please try again</p>}

                <button
                  type="submit"
                  className="btn btn-primary md:text-lg md:font-medium w-full mt-10 hover:bg-gray-700"
                  disabled={loading}
                >
                  {loading ? (
                    <BiLoaderAlt className={`animate-spin mx-auto`} size={26} />
                  ) : (
                    "Log In"
                  )}
                </button>
              </form>
            ) : (
              <p className="text-green-700 text-sm mt-6">
                Check your email. A one-time sign-in code has been sent.
              </p>
            )}

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
