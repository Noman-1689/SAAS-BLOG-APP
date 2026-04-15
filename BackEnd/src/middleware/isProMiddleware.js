export const isPro = (req, res, next) => {
  // 1. Ensure the user exists (populated by 'protect' middleware)
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // 2. Define allowed plans
  const allowedPlans = ["PRO", "ENTERPRISE"];

  // 3. Check if the user's plan is in the allowed list
  if (!allowedPlans.includes(req.user.plan)) {
    return res.status(403).json({
      message:
        "Access Denied. Please upgrade to a PRO or Enterprise plan to use this feature.",
      upgradeRequired: true,
      currentPlan: req.user.plan,
    });
  }

  // 4. If they have PRO or ENTERPRISE, move to the next function
  next();
};
