import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1. Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          // 2. Create user if they don't exist
          user = await prisma.user.create({
            data: {
              email,
              googleId: profile.id,
              isVerified: true, // Google emails are already verified
            },
          });
        } else if (!user.googleId) {
          // 3. Link Google ID if they previously signed up with email
          user = await prisma.user.update({
            where: { email },
            data: { googleId: profile.id },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;
