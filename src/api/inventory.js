import { api } from "./apiClient";

const mapRow = (r) => ({
  id: r.id,
  name: r.name,
  image: r.image,
  price: Number(r.price || 0),
  stock: Number(r.stock || 0),
  threshold: Number(r.threshold ?? 5),
  level: r.level,                 // "ok" | "low" | "out"
  orderedQty: Number(r.orderedQty || 0),
  activeQty: Number(r.activeQty || 0),
  cancelledQty: Number(r.cancelledQty || 0),
  byStatus: r.byStatus || {},
  suggestedRestock: Number(r.suggestedRestock || 0),
  variants: (r.variants || []).map((v) => ({ ...v, stock: Number(v.stock || 0) })),
});

export const getInventory = () => api.get("/inventory").then((d) => (d.items || []).map(mapRow));
export const setInventory = (id, body) => api.patch(`/inventory/${id}`, body);
export const restockProduct = (id, amount) => api.post(`/inventory/${id}/restock`, { amount });
export const setVariantInventory = (id, stock) => api.patch(`/inventory/variant/${id}`, { stock });
export const restockVariant = (id, amount) => api.post(`/inventory/variant/${id}/restock`, { amount });
