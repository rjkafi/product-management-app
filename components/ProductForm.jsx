"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "@/lib/api";

export default function ProductForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price || "",
    categoryId: initialData.category?.id || "",
    image: initialData.images?.[0] || "",
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.price || isNaN(formData.price))
      newErrors.price = "Price must be a number";
    else if (Number(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
        images: [formData.image],
        price: Number(formData.price),
        categoryId: formData.categoryId,
      });
      Swal.fire("Success", "Product saved successfully", "success");
      setFormData({ name: "", description: "", price: "", categoryId: "", image: "" });
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to save product", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">{initialData.name ? "Update Product" : "Create Product"}</h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md"/>
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-md"/>
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Category</label>
        <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border rounded-md">
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded-md"/>
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      {/* Image */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Image URL</label>
        <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border rounded-md"/>
      </div>

      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">
        {loading ? (initialData.name ? "Updating..." : "Creating...") : (initialData.name ? "Update Product" : "Create Product")}
      </button>
    </form>
  );
}
