"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/slices/productSlice";
import api from "@/lib/api";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Swal from "sweetalert2";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { list = [], loading, error } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const itemsPerPage = 6;

  // Fetch products with pagination TODO: Improve error handling
  const loadProducts = async (page = 1) => {
    if (!token) return;
    try {
      const offset = (page - 1) * itemsPerPage;
      const res = await api.get(`/products?offset=${offset}&limit=${itemsPerPage}`);
      setTotalProducts(res.data.length ? 50 : 0);
      dispatch(fetchProducts({ offset, limit: itemsPerPage }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProducts(currentPage);
  }, [token, currentPage]);

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.trim() === "") return setSearchResults([]);
      try {
        const res = await api.get(`/products/search?searchedText=${searchTerm}`);
        setSearchResults(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
// debounce search product
    const delayDebounce = setTimeout(searchProducts, 500); 
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
// handle to deleting a product
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
        console.log("Simulated delete for product id:", id);

        Swal.fire("Deleted!", "Product has been removed.", "success");
        // reload current page
        loadProducts(currentPage);
      } catch (err) {
        Swal.fire("Error!", "Failed to delete product.", "error");
      }
    }
  };

  // Determine which products to show
  const displayedProducts = searchTerm.trim() ? searchResults : list;

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  if (!token) return null; 

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search product..."
              className="border px-3 py-2 rounded-md w-64"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Link
              href="/products/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Loading / Error / Empty */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh] text-lg">
            Loading products...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[50vh] text-red-600">
            Error: {error}
          </div>
        ) : displayedProducts.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No products found.</p>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300"
                >
                  {/* Product Iamge */}
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-1">
                    Category: {product.category?.name || "N/A"}
                  </p>
                  <p className="text-gray-800 font-semibold">Price: ${product.price}</p>
                  <div className="flex justify-between mt-3">
                    {/* Details button */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-3 inline-block text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                    <div className="flex gap-2">
                      {/* Eidit Button */}
                      <Link
                        href={`/products/edit/${product.id}`}
                        className="text-yellow-600 hover:underline"
                      >
                        Edit
                      </Link>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination  bar*/}
            {totalPages > 1 && !searchTerm && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md border ${currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
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
