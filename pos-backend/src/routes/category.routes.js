import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  getAllCategory,
} from "../controllers/category.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .post((req, res, next) => {
    upload.fields([
      {
        name: "image1",
        maxCount: 1,
      },
      {
        name: "image2",
        maxCount: 1,
      },
    ])(req, res, function (err) {
      if (err) {
        // Handle Multer errors (e.g., "Unexpected field" or file size limits)
        return res.status(400).json(new ApiError(400, err.message));
      }
      next();
    });
  }, createCategory)
  .get(getAllCategory);

export default router;
