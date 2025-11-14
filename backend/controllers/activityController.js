import { success } from "../utils/response.js";

export const getActivityLog = async (req, res) => {
  return success(res, "Activity log fetched", []);
};
