"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, loading, error, user } = useSelector((state) => state.auth);

  // Redirect if already user logged in
  useEffect(() => {
    if (token) router.push("/products");
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(loginUser(email));

    if (res.meta.requestStatus === "fulfilled") {
      // Save user info in localStorage
      localStorage.setItem("email", email);
      localStorage.setItem("photoURL", user?.photoURL || "");

      // Redirect to products page
      router.push("/products");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      {/*  Marquee section */}
      <div className="marquee rounded-2xl border border-none bg-blue-50 w-80 border-b border-blue-200 py-2">
        <div className="marquee-content text-blue-600 font-semibold">
          🚀 Please log in first to access all features of this application. 🚀 Please log in first to access all features of this application 🚀
        </div>
      </div>

      {/*  Login Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 border border-gray-300 rounded-xl shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
