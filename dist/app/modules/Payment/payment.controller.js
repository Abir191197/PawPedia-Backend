"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync")); // Error handling middleware
const payment_service_1 = require("./payment.service"); // Adjust this import according to your project structure
const confirmationPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, status, userId, postId } = req.query; // Destructure bookingId, status, userId, and postId from query parameters
    // Validate query parameters
    if (typeof bookingId !== "string" ||
        typeof status !== "string" ||
        typeof userId !== "string" ||
        typeof postId !== "string") {
        return res.status(400).send("Invalid query parameters");
    }
    try {
        // Call the service to get the confirmation template, passing userId, bookingId, and postId
        const result = yield payment_service_1.paymentServices.confirmationService(bookingId, status, userId, postId);
        // Set content-type to HTML
        res.setHeader("Content-Type", "text/html");
        // Send the HTML response
        res.send(result);
    }
    catch (error) {
        console.error("Error in confirmationPayment:", error);
        res
            .status(500)
            .send("An error occurred while processing your payment confirmation.");
    }
}));
exports.PaymentController = {
    confirmationPayment,
};
