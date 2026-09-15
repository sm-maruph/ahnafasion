import { loadCartRecommendations } from "./cartRecommendations";
test("prioritizes subcategory matches, excludes bag items and unavailable items, and deduplicates", async () => {
  const product = (id) => ({ id, slug: `p${id}`, inStock: true });
  const getProduct = jest.fn().mockResolvedValue({ category: "kids", subcategory: "dress" });
  const getProducts = jest.fn(({ subcategory }) => Promise.resolve({ items: subcategory ? [product(1), product(3)] : [product(2), product(3), { ...product(4), inStock: false }] }));
  const result = await loadCartRecommendations([{ id: 1, slug: "p1" }], getProduct, getProducts);
  expect(result.map((p) => p.id)).toEqual([3, 2]);
  expect(getProducts).toHaveBeenCalledWith({ category: "kids", subcategory: "dress", pageSize: 24 });
});
test("uses category results when a subcategory request fails", async () => {
  const result = await loadCartRecommendations([{ id: 1, slug: "p1" }], async () => ({ category: "kids", subcategory: "dress" }),
    async ({ subcategory }) => { if (subcategory) throw Error("unavailable"); return { items: [{ id: 2, slug: "p2", inStock: true }] }; });
  expect(result.map((p) => p.id)).toEqual([2]);
});
