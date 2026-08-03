import { api } from "./apiClient";

export const getSizeCharts = (all = false) => api.get("/size-charts", { params: all ? { all: true } : {} }).then((d) => d.items || []);
export const createSizeChart = (body) => api.post("/size-charts", body);
export const updateSizeChart = (id, body) => api.put(`/size-charts/${id}`, body);
export const deleteSizeChart = (id) => api.del(`/size-charts/${id}`);
