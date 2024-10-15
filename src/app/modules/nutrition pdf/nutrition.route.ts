import auth from "../../middlewares/auth";
import express from "express";
import { USER_ROLE } from "../user/user.constant";
import { generatePetNutritionPDF } from "./nutrition.controller";

const router = express.Router();
router.post(
  "/generate-pdf",
  auth(USER_ROLE.user),
 generatePetNutritionPDF
);


export const Nutrition = router;
