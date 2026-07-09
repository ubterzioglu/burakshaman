/**
 * Single source of truth for the admin password.
 * Set ADMIN_PASSWORD in the deployment environment (e.g. Coolify env vars) —
 * WITHOUT surrounding quotes.
 */
export function getAdminPassword() {
  const raw = process.env.ADMIN_PASSWORD;
  if (!raw) return undefined;
  // Defensive: trim whitespace and strip one layer of surrounding quotes,
  // so ADMIN_PASSWORD="pass" or ADMIN_PASSWORD=pass both work.
  return raw.trim().replace(/^(['"])(.*)\1$/, "$2") || undefined;
}
