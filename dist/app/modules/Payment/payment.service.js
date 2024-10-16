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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentServices = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const payment_utils_1 = require("./payment.utils");
const post_model_1 = require("../Pet Post/post.model");
const confirmationService = (bookingId, status, userId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify the payment status using the transaction/order ID
        const verifyResponse = yield (0, payment_utils_1.verifyPayment)(bookingId);
        let statusMessage;
        let templateFile;
        // Determine status message and template based on verification response
        if (status === "success") {
            statusMessage = "Payment successful";
            templateFile = "ConfirmationSuccess.html";
            // Update the payment status in the database by pushing the userId into the array
            yield post_model_1.PetPostModel.findOneAndUpdate({ _id: postId }, // Assuming postId is the MongoDB document ID
            { $addToSet: { PaidByUserPostId: userId } }, // Use $addToSet to avoid duplicates
            { new: true } // Return the modified document
            );
        }
        else if (verifyResponse.pay_status === "Failed") {
            statusMessage = "Payment failed";
            templateFile = "ConfirmationFailure.html";
        }
        else {
            throw new Error("Unexpected payment status or response");
        }
        // Read and modify the HTML template
        const filePath = (0, path_1.join)(__dirname, `../../../views/${templateFile}`);
        let template;
        try {
            template = (0, fs_1.readFileSync)(filePath, "utf-8");
        }
        catch (fileError) {
            console.error("Error reading template file:", fileError);
            throw new Error("Template file not found");
        }
        // Replace placeholder in the template
        template = template.replace("{{message}}", statusMessage);
        return template;
    }
    catch (error) {
        console.error("Error in confirmationService:", error);
        throw new Error("Failed to confirm payment");
    }
});
exports.paymentServices = {
    confirmationService,
};
