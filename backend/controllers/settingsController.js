import { success } from "../utils/response.js";

export const getSettings = async (req, res) => {
  return success(res, "Settings fetched", {
    theme: "light",
    notifications: true,
  });
};

export const updateSettings = async (req, res) => {
  return success(res, "Settings updated");
};
