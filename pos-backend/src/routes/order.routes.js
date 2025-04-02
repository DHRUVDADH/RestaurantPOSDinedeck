import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

router.use(verifyJWT);
router.route("/:userId").post(createOrder);
router.route("/").get(getOrders);
router.route("/update-status/:orderId").patch(updateOrderStatus);
router.route("/delete-order/:orderId").delete(deleteOrder);

export default router;
