export default async function getAllProducts() {
  try {
    const res = await fetch("https://api.bitechx.com/products", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();

    // console.log(" Products come from API:", data);

  //  data is already an array, no need for products
    return Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.error(" Error fetching products:", error);
    return [];
  }
}
