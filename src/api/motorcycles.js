import client from "./client";

export const getMotorcycles = async () => {
  const { data } = await client.get("/motorcycles");
  return data;
};

export const getMotorcycle = async (id) => {
  const { data } = await client.get(`/motorcycles/${id}`);
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
