import { apiRequest } from "./api";

export const getTasks = () => {
  return apiRequest("/tasks");
};

export const createTask = (taskData) => {
  return apiRequest("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
};

export const updateTask = (id, taskData) => {
  return apiRequest(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });
};

export const deleteTask = (id) => {
  return apiRequest(`/tasks/${id}`, {
    method: "DELETE",
  });
};
