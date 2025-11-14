// backend/controllers/activityDashboardController.js
import { supabaseAdmin } from "../config/supabase.js";
import { success, error } from "../utils/response.js";

/**
 * GET /activity/recent
 * Returns latest activity with task + project info
 */
export const getRecentActivity = async (req, res) => {
  try {
    const { data, error: err } = await supabaseAdmin
      .from("activity_log")
      .select(`
        id,
        message,
        created_at,
        task_id,
        meta,
        tasks (
          id,
          title,
          project_id,
          projects ( id, name )
        )
      `)
      .order("created_at", { ascending: false })
      .limit(20);

    if (err) return error(res, err.message);

    return success(res, "Recent activity fetched", data);

  } catch (e) {
    console.error("[getRecentActivity] error:", e);
    return error(res, "Failed to fetch recent activity");
  }
};
