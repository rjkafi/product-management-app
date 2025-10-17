import api from "./api";

export default async function updateProductById(id, data, token) {
  try {
    const res = await api.put(`/products/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to update product:", err.response?.data || err.message);
    throw err;
  }
}
