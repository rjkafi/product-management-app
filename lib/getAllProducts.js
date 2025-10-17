export default async function getAllProducts(token) {
  try {
    const res = await fetch("https://api.bitechx.com/products", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", 
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    // data is an array of products directly

    // console.log(" Products from API:", data);
    // console.log(" Total products:", data.length);

    return Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.error(" Error fetching products:", error);
    return [];
  }
}
