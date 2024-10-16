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
exports.verifyPayment = exports.sendPaymentRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config"));
// Function to send a payment request
function sendPaymentRequest(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("User data for payment request:", userData);
        // Payment API URL from the configuration
        const url = config_1.default.PAYMENT_URL;
        // Headers for the request
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json", // Optional, but good practice
        };
        // Payload for the payment request
        const payload = {
            store_id: config_1.default.STORE_ID,
            signature_key: config_1.default.SIGNATURE_KEY,
            tran_id: userData.bookingId, // Transaction/booking ID
            success_url: `https://paw-pedia-backend.vercel.app/api/payment/confirmation?postId=${userData.postId}&userId=${userData.userId}&bookingId=${userData.bookingId}&status=success`,
            fail_url: `https://paw-pedia-backend.vercel.app/api/payment/confirmation?bookingId=${userData.bookingId}&status=failed`,
            cancel_url: "https://paw-pedia-frontend.vercel.app/user", // Update the frontend cancel URL
            amount: (100).toFixed(2), // Fixed amount (can be dynamic if needed)
            currency: "BDT", // Currency (Bangladeshi Taka)
            desc: "Advance Payment", // Description of the transaction
            cus_name: userData.name, // Customer's name
            cus_email: userData.email, // Customer's email
            cus_add1: userData.address, // Customer's address
            cus_add2: "", // Optional second address field
            cus_city: "", // Optional city field
            cus_state: "", // Optional state field
            cus_postcode: "", // Optional postcode field
            cus_country: "BD", // Optional country field, assumed to be Bangladesh
            cus_phone: userData.phone.toString(), // Customer's phone number
            type: "json", // Expected response type
        };
        // Log the payload and headers for debugging purposes
        console.log("Sending payment request to:", url);
        console.log("Payload:", payload);
        console.log("Headers:", headers);
        try {
            const response = yield axios_1.default.post(url, payload, { headers });
            console.log("Payment response:", response.data);
            return response.data;
        }
        catch (error) {
            console.error("Error during payment request:", error);
            if (error) {
                console.error("Payment request failed with response:");
            }
            else {
                console.error("Unexpected error:");
            }
            throw error;
        }
    });
}
exports.sendPaymentRequest = sendPaymentRequest;
// Function to verify a payment using the transaction ID
function verifyPayment(tnxId) {
    return __awaiter(this, void 0, void 0, function* () {
        const verifyUrl = `${config_1.default.PAYMENT_VERIFY_URL}`;
        try {
            const response = yield axios_1.default.get(verifyUrl, {
                params: {
                    store_id: config_1.default.STORE_ID,
                    signature_key: config_1.default.SIGNATURE_KEY,
                    type: "json",
                    request_id: tnxId,
                },
            });
            console.log("Verification response:", response.data);
            return response.data;
        }
        catch (error) {
            console.error("Payment verification error:", error);
            if (error) {
                console.error("Verification failed with response:");
            }
            else {
                console.error("Unexpected error:");
            }
            throw new Error("Payment verification failed!");
        }
    });
}
exports.verifyPayment = verifyPayment;
