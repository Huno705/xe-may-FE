import client from "./client";

export const getMotorcycles = async ({ signal } = {}) => {
  const { data } = await client.get("/motorcycles", { signal });
  return data;
};

export const getLatestMotorcycles = async ({ signal } = {}) => {
  const motorcycles = await getMotorcycles({ signal });
  return [...motorcycles]
    .sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0))
    .slice(0, 6);
};

export const getMotorcycle = async (id, { signal } = {}) => {
  const { data } = await client.get(`/motorcycles/${id}`, { signal });
  return data;
};

export const createMotorcycle = async (formData) => {
  const { data } = await client.post("/motorcycles", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateMotorcycle = async (id, formData) => {
  const { data } = await client.put(`/motorcycles/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteMotorcycle = async (id) => {
  const { data } = await client.delete(`/motorcycles/${id}`);
  return data;
};
