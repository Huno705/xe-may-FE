import client from "./client";

export const getBranches = async () => {
  const { data } = await client.get("/branches");
  return data;
};

export const createBranch = async (name) => {
  const { data } = await client.post("/branches", { name });
  return data;
};

export const updateBranch = async (id, name) => {
  const { data } = await client.put(`/branches/${id}`, { name });
  return data;
};

export const deleteBranch = async (id) => {
  const { data } = await client.delete(`/branches/${id}`);
  return data;
};
