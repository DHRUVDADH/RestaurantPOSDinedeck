import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createItem,
  getAllItems,
  updateItem,
  updateItemImage,
  deleteItem
} from "../controllers/menu.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(upload.single("image"), createItem).get(getAllItems);

router.route("/update-item-details/:itemId").patch(updateItem);
router.route("/update-image/:itemId").patch(upload.single("image"), updateItemImage);
router.route("/delete-item/:itemId").delete(deleteItem);

export default router;
