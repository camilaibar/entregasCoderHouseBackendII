import { Router } from "express";
import passport from "passport";

import { createHash, isValidPassword } from "../../utils/utils.js";
import {
  createUser,
  findUserByEmail,
} from "../../dao/managers/users.manager.js";
import { addJWTTokenToCookies } from "../../utils/jwtUtils.js";

const router = Router();

// Register with form
router.post(
  "/signup",
  //passport.authenticate("signup"),
  async (req, res, next) => {
    try {
      let { first_name, last_name, email, age, password } = req.body;

      // Check if user already exists
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        console.error("User already exist");
        return res.redirect("/hbs");
      }

      // Encript password
      password = await createHash(password);

      // Create new user
      const newUser = await createUser({
        first_name,
        last_name,
        email,
        age,
        password,
      });
      return res.redirect("/hbs/profile");
    } catch (error) {
      return next(error); // Pass error to next middleware (for better error handling)
    }
  }
);

// Login with form
router.post(
  "/signin",
  passport.authenticate("signin"),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Check password of existing user
      const isMatch = await isValidPassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // JWT
      addJWTTokenToCookies(res, user);

      return res.redirect(`/hbs/profile`);

      /*return res.status(200).json({
        message: "Login successful",
        session: req.session,
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
      });*/
    } catch (error) {
      return next(error); // Pass error to next middleware
    }
  }
);

// Login with github
router.get(
  "/github",
  passport.authenticate("github", {
    failureRedirect: "/hbs/register",
    passReqToCallback: true,
  })
);

// Login with google
router.get(
  "/oauth2/redirect/accounts.google.com",
  passport.authenticate("google", {
    assignProperty: "user",
    failureRedirect: "/hbs/register",
  }),
  async (req, res, next) => {
    // JWT
    addJWTTokenToCookies(res, req.user);
    return res.redirect("/hbs");
  }
);

// Logout
router.get("/logout", async (req, res, next) => {
  req.logOut((error) => {
    if (error) return next(error); // Pass error to next middleware
    res.clearCookie("token");
    return res.redirect("/hbs/login");
  });
});

// Example route for testing
router.get("/", (req, res, next) => {
  return res.send("User management system");
});

export default router;
