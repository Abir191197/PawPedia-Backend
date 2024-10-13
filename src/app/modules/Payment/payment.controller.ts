import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync"; // Error handling middleware
import { paymentServices } from "./payment.service"; // Adjust this import according to your project structure

const confirmationPayment = catchAsync(async (req: Request, res: Response) => {
  const { bookingId, status, userId, postId } = req.query; // Destructure bookingId, status, userId, and postId from query parameters

  // Validate query parameters
  if (
    typeof bookingId !== "string" ||
    typeof status !== "string" ||
    typeof userId !== "string" ||
    typeof postId !== "string"
  ) {
    return res.status(400).send("Invalid query parameters");
  }

  try {
    // Call the service to get the confirmation template, passing userId, bookingId, and postId
    const result = await paymentServices.confirmationService(
      bookingId,
      status,
      userId,
      postId
    );

    // Set content-type to HTML
    res.setHeader("Content-Type", "text/html");

    // Send the HTML response
    res.send(result);
  } catch (error) {
    console.error("Error in confirmationPayment:", error);
    res
      .status(500)
      .send("An error occurred while processing your payment confirmation.");
  }
});

export const PaymentController = {
  confirmationPayment,
};
