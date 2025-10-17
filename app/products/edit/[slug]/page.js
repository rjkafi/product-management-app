"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function EditProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Fetch single product by slug
  useEffect(() => {
    if (!slug || !token) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch product", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, token]);

  //  Handle update
  const handleUpdate = async (formData) => {
    if (!product) return;
    try {
      await api.put(`/products/${product.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Success", "Product updated successfully", "success");
      router.push("/products");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update product", "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10 text-red-500">Product not found.</p>;

  return <ProductForm initialData={product} onSubmit={handleUpdate} />;
}
