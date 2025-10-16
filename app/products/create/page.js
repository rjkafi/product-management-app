"use client";
import ProductForm from "@/components/ProductForm";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/redux/slices/productSlice";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CreateProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();

// Handle to create a new product
  const handleCreate = async (data) => {
    try {
      const res = await api.post("/products", data); 
      console.log("Product created:", res.data);

      // Refresh product list
      dispatch(fetchProducts({ offset: 0, limit: 6 }));
      router.push("/products");
    } catch (err) {
      console.error(err.response?.data || err.message);

    }
  };

  return <ProductForm onSubmit={handleCreate} />;
}
