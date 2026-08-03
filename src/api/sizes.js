import { api } from "./apiClient";

export const getSizes = (all = false) => api.get("/sizes", { params: all ? { all: true } : {} }).then((d) => d.items || []);
export const createSize = (body) => api.post("/sizes", body);
export const updateSize = (id, body) => api.patch(`/sizes/${id}`, body);
export const deleteSize = (id) => api.del(`/sizes/${id}`);
