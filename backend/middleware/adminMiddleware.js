export function isAdmin(req, res, next) {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ error: "Access denied, admin only" });
}

export function isSuperAdmin(req, res, next) {
  if (req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ error: "Access denied, superadmin only" });
}
