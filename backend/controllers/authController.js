import { supabaseAdmin } from "../config/supabase.js";
import { success, error } from "../utils/response.js";

export const signup = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    // Create user in supabase auth
    const { data: userData, error: signupError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (signupError) return error(res, signupError.message);

    const userId = userData.user.id;

    // Insert profile row
    await supabaseAdmin.from("profiles").insert({
      id: userId,
      full_name
    });

    return success(res, "Signup successful", { userId });
  } catch (err) {
    console.error(err);
    return error(res, "Failed to sign up user");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error: loginError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) return error(res, loginError.message);

    return success(res, "Login successful", data);
  } catch (err) {
    console.error(err);
    return error(res, "Failed to login");
  }
};
