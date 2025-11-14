import { supabaseAdmin } from "../config/supabase.js";
import { success, error } from "../utils/response.js";

export const getProjects = async (req, res) => {
  try {
    const { data, error: err } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) return error(res, err.message);

    return success(res, "Projects fetched", data);
  } catch (e) {
    return error(res, "Failed to fetch projects");
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const { data, error: err } = await supabaseAdmin
      .from("projects")
      .insert([{ name, description }])
      .select();

    if (err) return error(res, err.message);

    return success(res, "Project created", data[0]);
  } catch (e) {
    return error(res, "Failed to create project");
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error: err } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (err) return error(res, err.message);

    return success(res, "Project fetched", data);
  } catch (e) {
    return error(res, "Failed to fetch project");
  }
};
