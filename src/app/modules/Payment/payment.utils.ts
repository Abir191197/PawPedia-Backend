import axios from "axios";
import config from "../../../config";

// Define the structure for the user data
interface UserData {
  bookingId: string;
  postId: string;
  userId: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

// Function to send a payment request
export async function sendPaymentRequest(userData: UserData) {
  console.log("User data for payment request:", userData);

  // Payment API URL from the configuration
  const url = config.PAYMENT_URL;

  // Headers for the request
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json", // Optional, but good practice
  };

  // Payload for the payment request
  const payload = {
    store_id: config.STORE_ID,
    signature_key: config.SIGNATURE_KEY,
    tran_id: userData.bookingId, // Transaction/booking ID
    success_url: `https://paw-pedia-backend.vercel.app/api/payment/confirmation?postId=${userData.postId}&userId=${userData.userId}&bookingId=${userData.bookingId}&status=success`,
    fail_url: `https://paw-pedia-backend.vercel.app/api/payment/confirmation?bookingId=${userData.bookingId}&status=failed`,
    cancel_url: "https://paw-pedia-frontend.vercel.app/", // Update the frontend cancel URL
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
    const response = await axios.post(url as string, payload, { headers });
    console.log("Payment response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during payment request:", error);

    if (error) {
      console.error(
        "Payment request failed with response:",
       
      );
    } else {
      console.error("Unexpected error:");
    }

    throw error;
  }
}

// Function to verify a payment using the transaction ID
export async function verifyPayment(tnxId: string) {
  const verifyUrl = `${config.PAYMENT_VERIFY_URL}`;

  try {
    const response = await axios.get(verifyUrl, {
      params: {
        store_id: config.STORE_ID,
        signature_key: config.SIGNATURE_KEY,
        type: "json",
        request_id: tnxId,
      },
    });

    console.log("Verification response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment verification error:", error);

    if (error) {
      console.error("Verification failed with response:");
    } else {
      console.error("Unexpected error:");
    }

    throw new Error("Payment verification failed!");
  }
}
