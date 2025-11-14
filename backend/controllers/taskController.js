// backend/controllers/Taskcontroller.js
import { supabaseAdmin } from "../config/supabase.js";
import { success, error } from "../utils/response.js";

// GET /tasks  -> return tasks (optionally filter by project_id)
export const getTasks = async (req, res) => {
  try {
    const { project_id } = req.query;

    let query = supabaseAdmin
      .from("tasks")
      .select(`
        *,
        projects:project_id ( id, name )
      `)
      .order("created_at", { ascending: false });

    if (project_id) {
      query = query.eq("project_id", project_id);
    }

    const { data, error: err } = await query;

    if (err) return error(res, err.message);
    return success(res, "Tasks fetched", data);
  } catch (e) {
    return error(res, "Failed to fetch tasks");
  }
};

// GET /tasks/:id
export const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error: err } = await supabaseAdmin
      .from("tasks")
      .select(`
        *,
        projects:project_id ( id, name )
      `)
      .eq("id", id)
      .single();

    if (err) return error(res, err.message);
    return success(res, `Task ${id} fetched`, data);
  } catch (e) {
    return error(res, "Failed to fetch task");
  }
};

// POST /tasks  -> auto-assign to current user (x-user-id)
export const createTask = async (req, res) => {
  try {
    const { title, description, project_id } = req.body;
    // DEMO fallback
let currentUser = req.headers["x-user-id"];

if (!currentUser) {
  currentUser = "ee477366-b054-4355-9610-1180d34cc991"; // <-- replace with your real profile.id
  console.log("[createTask] No x-user-id header → using demo user:", currentUser);
}


    const { data, error: err } = await supabaseAdmin
      .from("tasks")
      .insert([
        {
          title,
          description,
          project_id,
          assignee: currentUser,
        },
      ])
      .select();

    if (err) {
      console.error("[createTask] insert error:", err);
      return error(res, err.message);
    }

    return success(res, "Task created", data[0]);
  } catch (e) {
    console.error("[createTask] unexpected error:", e);
    return error(res, "Failed to create task");
  }
};

// PATCH /tasks/:id   -> update status (and log activity + create notification)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id;
    let currentUser = req.headers["x-user-id"];

if (!currentUser) {
  currentUser = "ee477366-b054-4355-9610-1180d34cc991"; // same ID as createTask
  console.log("[updateTaskStatus] No x-user-id → using demo user:", currentUser);
}

    console.log(`[updateTaskStatus] request taskId=${taskId} status=${status} by=${currentUser}`);

    // fetch old task (project name included)
    const { data: old, error: e1 } = await supabaseAdmin
      .from("tasks")
      .select("*, projects:project_id(id, name)")
      .eq("id", taskId)
      .single();

    if (e1) {
      console.error("[updateTaskStatus] fetch task error:", e1);
      return error(res, "Task not found");
    }

    console.log("[updateTaskStatus] fetched task:", {
      id: old.id,
      title: old.title,
      assignee: old.assignee,
      project_id: old.project_id,
      project_name: old.projects?.name,
      old_status: old.status,
    });

    // update status
    const { data, error: err } = await supabaseAdmin
      .from("tasks")
      .update({ status })
      .eq("id", taskId)
      .select();

    if (err) {
      console.error("[updateTaskStatus] update error:", err);
      return error(res, err.message);
    }

    console.log("[updateTaskStatus] updated task id=", data?.[0]?.id ?? taskId);

    // insert activity log
    const activityMsg = `Status changed from ${old.status} to ${status}`;
    const { data: activityData, error: activityErr } = await supabaseAdmin
      .from("activity_log")
      .insert([
  {
    task_id: taskId,
    project_id: old.project_id,
    message: activityMsg,
    meta: {
      task_title: old.title,
      project_name: old.projects?.name
    }
  }
])

      .select();

    if (activityErr) {
      console.error("[updateTaskStatus] activity insert error:", activityErr);
    } else {
      console.log("[updateTaskStatus] activity created id=", activityData?.[0]?.id);
    }

    // Create notification for current user (demo behaviour)
    try {
      const notifyMsg = `Your task "${old.title}" in project "${old.projects?.name ?? "—"}" was marked ${status}.`;

      const { data: notifData, error: notifErr } = await supabaseAdmin
        .from("notifications")
        .insert([
          {
            user_id: currentUser,
            task_id: taskId,
            project_id: old.project_id,
            message: notifyMsg,
            meta: { task_title: old.title, project_name: old.projects?.name },
          },
        ])
        .select();

      if (notifErr) {
        console.error("[updateTaskStatus] notification insert error:", notifErr);
      } else {
        console.log("[updateTaskStatus] notification created id=", notifData?.[0]?.id);
      }
    } catch (nfErr) {
      console.error("[updateTaskStatus] notification try/catch error:", nfErr);
    }

    return success(res, "Task status updated", data[0]);
  } catch (e) {
    console.error("[updateTaskStatus] unexpected error:", e);
    return error(res, "Failed to update task");
  }
};
