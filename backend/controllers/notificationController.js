import { supabaseAdmin } from "../config/supabase.js";
import { success, error } from "../utils/response.js";

/**
 * GET /notifications?user_id=...
 * Returns list of notifications for user (most recent first)
 */
export const getNotifications = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return error(res, "user_id is required");

    const { data, error: err } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (err) return error(res, err.message);
    return success(res, "Notifications fetched", data);
  } catch (e) {
    return error(res, "Failed to fetch notifications");
  }
};

/**
 * GET /notifications/unread-count?user_id=...
 */
export const getUnreadCount = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return error(res, "user_id is required");

    const { count, error: err } = await supabaseAdmin
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user_id)
      .eq("is_read", false);

    if (err) return error(res, err.message);
    return success(res, "Unread count fetched", { unread: count ?? 0 });
  } catch (e) {
    return error(res, "Failed to fetch unread count");
  }
};

/**
 * PATCH /notifications/:id/mark-read
 * Marks the notification as read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error: err } = await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .select();

    if (err) return error(res, err.message);
    return success(res, "Notification marked read", data[0]);
  } catch (e) {
    return error(res, "Failed to mark notification read");
  }
};
