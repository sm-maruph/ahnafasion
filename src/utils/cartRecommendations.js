export async function loadCartRecommendations(cart, getProduct, getProducts) {
  const slugs = [...new Set(cart.map((item) => item.slug).filter(Boolean))];
  const details = await Promise.allSettled(slugs.map(getProduct));
  const sources = details.filter((r) => r.status === "fulfilled" && r.value).map((r) => r.value);
  const categories = [...new Set(sources.map((p) => p.category).filter(Boolean))];
  const subcategories = [...new Map(sources.filter((p) => p.category && p.subcategory).map((p) =>
    [`${p.category}/${p.subcategory}`, { category: p.category, subcategory: p.subcategory }])).values()];
  const queries = [...subcategories, ...categories.map((category) => ({ category }))];
  const results = await Promise.allSettled(queries.map((query) => getProducts({ ...query, pageSize: 24 })));
  const seen = new Set(cart.map((p) => String(p.id)));
  const inBag = new Set(slugs);
  return results.flatMap((result) => result.status === "fulfilled" ? result.value.items || [] : []).filter((p) => {
    if (!p.inStock || !p.slug || seen.has(String(p.id)) || inBag.has(p.slug)) return false;
    seen.add(String(p.id));
    return true;
  }).slice(0, 8);
}
