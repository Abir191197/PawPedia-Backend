import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { generatePetNutritionPDFService } from "./nutrition.service";


export const generatePetNutritionPDF = catchAsync(
  async (req: Request, res: Response) => {
    const { petType, age, weight } = req.body;
    console.log("Request Data:", { petType, age, weight }); // Log incoming data

    if (!req.user) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "User not authenticated",
        data: null,
      });
    }

    try {
      const pdfBuffer = await generatePetNutritionPDFService(
        petType,
        age,
        weight
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=pet_nutrition_chart.pdf"
      );
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error); // Log the error
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to generate pet nutrition PDF",
        data: null,
      });
    }
  }
);

