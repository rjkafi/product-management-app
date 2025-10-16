"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);
  // if not receive token,then display a loading spinner
  if (!token) return null; 

  return <>{children}</>;
}
