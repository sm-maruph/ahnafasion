import { api } from "./apiClient";
import { supabase } from "./supabaseClient";

// Register/login go through your API; the returned session is stored by supabase-js
// so apiClient automatically attaches the token on later requests.
export async function register({ full_name, email, password, phone }) {
  const res = await api.post("/auth/register", { full_name, email, password, phone });
  if (res.session) {
    await supabase.auth.setSession(res.session);
    await supabase.auth.getSession(); // ensure it is persisted before we continue
  }
  return res.user;
}
export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  if (res.session) {
    await supabase.auth.setSession(res.session);
    await supabase.auth.getSession(); // ensure it is persisted before we continue
  }
  return res.user;
}
export async function logout() {
  await supabase.auth.signOut();
}
export async function updatePassword({ currentPassword, newPassword }) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user?.email) throw new Error("Could not verify the signed-in admin account.");

  // Supabase requires a fresh authentication to verify the current password.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (verifyError) throw new Error("Current password is incorrect.");

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();
  if (!data?.session) return null;
  return api.get("/auth/me"); // profile row (includes role)
}
export function onAuthChange(cb) {
  return supabase.auth.onAuthStateChange((_e, session) => cb(session?.user || null));
}
