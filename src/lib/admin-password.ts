export function getAdminPassword() {
  return (
    process.env.ADMIN_PASSWORD ??
    process.env.ADMIN_PASS ??
    process.env.ADMIN_PANEL_PASSWORD
  );
}
