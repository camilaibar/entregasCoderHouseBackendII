import { Router } from "express";
import { passportCall } from "../../utils/jwtUtils.js";

const router = Router();

router.get("/", (req, res, next) => res.send("session"));

router.get("/current", passportCall("jwt-cookies"), (req, res) => {
  return res.json({
    ...req.user, // This will contain user data if authentication succeeds
  });
});

export default router;
