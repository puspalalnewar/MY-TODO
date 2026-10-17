import { apiRequest } from "./api";

export const signupUser = (userData) => {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const logoutUser = () => {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
};

export const getCurrentUser = () => {
  return apiRequest("/auth/me");
};
