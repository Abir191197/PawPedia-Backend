import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();


router.post("/confirmation", PaymentController.confirmationPayment);
router.post("/failed", PaymentController.confirmationPayment);



export const PaymentRoutes = router;
