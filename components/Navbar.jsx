"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
import { FaRegUser, FaBars, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);

  const [userEmail, setUserEmail] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedEmail = localStorage.getItem("email");
    const storedPhoto = localStorage.getItem("photoURL");
    if (storedEmail) setUserEmail(storedEmail);
    if (storedPhoto) setUserPhoto(storedPhoto);
  }, []);

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, logout!",
    });

    if (confirm.isConfirmed) {
      dispatch(logout());
      localStorage.removeItem("email");
      localStorage.removeItem("photoURL");
      Swal.fire("Logged out!", "You have been successfully logged out.", "success");
      router.push("/login");
    }
  };

  if (!mounted) return null;

  return (
    <nav className="bg-base-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            Product Manager
          </h2>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Middle: Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          {token && (
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              Products
            </Link>
          )}
        </div>

        {/* Right: Auth / User */}
        <div className="hidden md:flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-3">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-gray-300 shadow hover:border-blue-500 transition"
                />
              ) : (
                <FaRegUser className="text-2xl text-gray-600" />
              )}
              <span className="text-gray-700 font-medium">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg py-4 px-6 flex flex-col gap-4 overflow-hidden">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </Link>

          {token && (
            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Products
            </Link>
          )}

          {token ? (
            <>
              <div className="flex items-center gap-3 border-t pt-3">
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 shadow"
                  />
                ) : (
                  <FaRegUser className="text-2xl text-gray-600" />
                )}
                <span className="text-gray-700 font-medium">{userEmail}</span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                router.push("/login");
                setMenuOpen(false);
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
