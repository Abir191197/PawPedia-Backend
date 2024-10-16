import { readFileSync } from "fs";
import { join } from "path";

import { verifyPayment } from "./payment.utils";
import { PetPostModel } from "../Pet Post/post.model";

const confirmationService = async (
  bookingId: string,
  status: string,
  userId: string,
  postId: string
) => {
  try {
    // Verify the payment status using the transaction/order ID
    const verifyResponse = await verifyPayment(bookingId);

    let statusMessage;
    let templateFile;

    // Determine status message and template based on verification response
    if (status === "success") {
      statusMessage = "Payment successful";
      templateFile = "ConfirmationSuccess.html";

      // Update the payment status in the database by pushing the userId into the array
      await PetPostModel.findOneAndUpdate(
        { _id: postId }, // Assuming postId is the MongoDB document ID
        { $addToSet: { PaidByUserPostId: userId } }, // Use $addToSet to avoid duplicates
        { new: true } // Return the modified document
      );
    } else if (verifyResponse.pay_status === "Failed") {
      statusMessage = "Payment failed";
      templateFile = "ConfirmationFailure.html";
    } else {
      throw new Error("Unexpected payment status or response");
    }

    // Read and modify the HTML template
    const filePath = join(__dirname, `../../../views/${templateFile}`);
    let template;
    try {
      template = readFileSync(filePath, "utf-8");
    } catch (fileError) {
      console.error("Error reading template file:", fileError);
      throw new Error("Template file not found");
    }

    // Replace placeholder in the template
    template = template.replace("{{message}}", statusMessage);

    return template;
  } catch (error) {
    console.error("Error in confirmationService:", error);
    throw new Error("Failed to confirm payment");
  }
};

export const paymentServices = {
  confirmationService,
};
