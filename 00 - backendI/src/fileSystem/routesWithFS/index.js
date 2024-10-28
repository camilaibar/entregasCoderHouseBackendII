import { Router } from "express";
import productRouter from "./v1/productRouter.js";
import cartRouter from "./v1/cartRouter.js";

const router = Router();

router.use("/products/v1", productRouter);
router.use("/carts/v1", cartRouter);

export default router;
