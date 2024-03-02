"use client";
import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  // If the user is already signed in,
  // redirect them to the home page
  if (isSignedIn) {
    router.push("/");
  }

  // Send the password reset code to the user's email
  async function create(e: any) {
    e.preventDefault();
    const email = e.target[0].value;
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: any) {
    e.preventDefault();
    const password = e.target[0].value;
    const code = e.target[1].value;
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now logged in)
          setActive({ session: result.createdSessionId });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <div className="mx-auto max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Forgot Password?</h1>
      <form
        className="space-y-4"
        onSubmit={!successfulCreation ? create : reset}
      >
        {!successfulCreation && (
          <>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Please provide your email address
            </label>
            <input
              type="email"
              placeholder="e.g john@doe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />

            <button className="w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-700">
              Send password reset code
            </button>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </>
        )}

        {successfulCreation && (
          <>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your new password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />

            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Enter the password reset code that was sent to your email
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />

            <button className="w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-700">
              Reset
            </button>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </>
        )}

        {secondFactor && (
          <p className="text-gray-500 text-xs">
            2FA is required, but this UI does not handle that
          </p>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
