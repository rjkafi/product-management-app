import api from "./api";

export default async function getSingleProduct(slug) {
  try {
    const res = await api.get(`/products/${slug}`);
    return res.data;
  } catch (err) {
    console.error(
      "Failed to fetch single product:",
      err.response?.data || err.message
    );
    return null;
  }
}
