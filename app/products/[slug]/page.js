"use client"; 

import { useEffect, useState } from "react";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Page({ params }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return <ProductDetailsClient slug={params.slug} />;
}
