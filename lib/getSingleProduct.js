import api from "./api";

export default async function getSingleProduct(slug, token) {
  try {
    const res = await api.get(`/products/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched product:", data);
    console.log("Fetched product:", res.data);

    return res.data;
  } catch (err) {
    console.error(
      "Failed to fetch single product:",
      err.response?.data || err.message
    );
    return null;
  }
}
