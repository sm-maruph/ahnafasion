// Color order matches gallery order: first color -> first photo, etc.
export function productColorImage(product, selectedColor) {
  const index = (product.colors || []).findIndex((color) =>
    String(typeof color === "string" ? color : color.name).trim().toLowerCase() === String(selectedColor || "").trim().toLowerCase()
  );
  const images = product.images?.length ? product.images :
    [...(product.product_images || [])].sort((a, b) => a.position - b.position).map((image) => image.url);
  return (index >= 0 && images[index]) || product.image || images[0] || null;
}
