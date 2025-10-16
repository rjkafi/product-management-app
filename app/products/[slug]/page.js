"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";


export function ProductDetailsClient({ slug }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          setError("Authorization token not found");
          setLoading(false);
          return;
        }

        const res = await api.get(`/products/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch single product:", err);
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 my-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-gray-600 mb-4">
        Category: <span className="font-semibold">{product.category?.name}</span>
      </p>

      <img
        src={product.images?.[0] || "/placeholder.png"}
        alt={product.name}
        className="w-full h-64 object-cover rounded-md mb-4"
      />

      <p className="text-gray-800 font-semibold mb-2">Price: ${product.price}</p>
      <p className="text-gray-700 mb-4">{product.description}</p>
    </div>
  );
}

// Wrapper Page component 
export default function Page({ params }) {
  return <ProductDetailsClient slug={params.slug} />;
}
