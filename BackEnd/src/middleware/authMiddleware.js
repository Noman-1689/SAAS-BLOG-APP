import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const protect = async (req, res, next) => {
  let token = req.cookies.token;

  // 1. Check Authorization header for Bearer tokens (for Postman/Mobile testing)
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. If no token is found, deny access
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // 3. Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. FETCH THE ACTUAL USER FROM DB (Real-time Plan check)
    // We use findUnique to get the most up-to-date 'plan' and 'name'
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id },
      select: {
        id: true,
        email: true,
        plan: true,
        firstName: true,
        lastName: true,
        subscriptionStatus: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    // 5. If user was deleted but token is still valid
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // 6. Attach the FRESH user object to the request
    // Now req.user.plan will ALWAYS be correct (FREE or PRO)
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
