"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  //  Fetch all products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);
  // Fetch Categories
    const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

 
  // filtered by (category + Search) 
const filteredProducts = products
  .filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((product) =>
    selectedCategory ? product.category?.id === selectedCategory : true
  );

  //  Pagination logic TODO: But Some work for tab index
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  //  Delete product
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/products/${id}`);
        Swal.fire("Deleted!", "Product has been removed.", "success");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        Swal.fire("Error!", "Failed to delete product.", "error");
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <ProtectedRoute>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
            All Products
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search product..."
              className="border border-gray-400 px-2 py-2 rounded-md w-full sm:w-52 md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Link
              href="/products/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center"
            >
              + Add Product
            </Link>
          </div>
        </div>
        {/*  Category Filter */}
        <div className="flex justify-start items-center gap-2 mb-6">
          <label className="font-semibold text-gray-700">Filter by:</label>
          <select
            className="border border-gray-400 px-2 py-2 rounded-md focus:ring-blue-500"
            value={selectedCategory}   
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); 
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {/* Products Grid */}
        {displayedProducts.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300 flex flex-col"
                >
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-800 font-semibold mb-2">
                    Price: ${product.price}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <Link
                      href={`/products/${product.slug}`}
                      className="tooltip tooltip-success text-slate-600 hover:text-gray-400 text-lg lg:text-xl font-bold transition-all duration-300 delay-200"
                      data-tip="View Details"
                    >
                      <FiEye />
                    </Link>
                    <div className="flex gap-3">
                      <Link
                        href={`/products/edit/${product.slug}`}
                        className="tooltip tooltip-accent text-green-400  hover:text-gray-400 text-lg lg:text-xl font-bold transition-all duration-300 delay-200"
                        data-tip="Edit Product"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="tooltip tooltip-error text-red-400  hover:text-gray-400 text-lg lg:text-xl font-bold transition-all duration-300 delay-200"
                        data-tip="Delete Product"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/*  Pagination Tabs is here */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md border transition ${currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
