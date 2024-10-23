import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/login", (req, res, next) => {
  return res.render("login");
});

router.get("/register", (req, res, next) => {
  return res.render("signup");
});

router.get("/", passport.authenticate("github"), (req, res, next) => {
  return res.render("home", {
    ...req.user.toObject(),
  });
});

export default router;
