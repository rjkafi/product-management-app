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

  //  Prevent SSR-client mismatch
  if (!mounted) return null;

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-200 fixed top-0 left-0 z-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            Product Manager
          </h2>
        </Link>

        <button
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          {token && (
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              Products
            </Link>
          )}

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
              <span className="hidden sm:inline text-gray-700 font-medium">
                {userEmail}
              </span>
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
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg py-3 px-6 flex flex-col gap-4 overflow-x-hidden">
          {token && (
            <Link
              href={"/products"}
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Products
            </Link>
          )}

          {token ? (
            <>
              <div className="flex items-center gap-3">
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
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
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
