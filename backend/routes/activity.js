import express from "express";
import { supabaseAdmin } from "../config/supabase.js";
import { success, error } from "../utils/response.js";

const router = express.Router();

// GET /activity?task_id=xxx
router.get("/", async (req, res) => {
  try {
    const { task_id } = req.query;
    if (!task_id) return error(res, "task_id is required");

    const { data, error: err } = await supabaseAdmin
      .from("activity_log")
      .select("*")
      .eq("task_id", task_id)
      .order("created_at", { ascending: false });

    if (err) return error(res, err.message);
    return success(res, "Activity fetched", data);
  } catch (e) {
    return error(res, "Failed to fetch activity");
  }
});

router.post("/", async (req, res) => {
  try {
    const { task_id, message } = req.body;
    if (!task_id || !message || message.trim() === "") {
      return error(res, "task_id and message are required");
    }

    const { data, error: err } = await supabaseAdmin
      .from("activity_log")
      .insert([{ task_id, message }])
      .select();

    if (err) return error(res, err.message);
    return success(res, "Activity added", data[0]);
  } catch (e) {
    return error(res, "Failed to add activity");
  }
});

export default router;
