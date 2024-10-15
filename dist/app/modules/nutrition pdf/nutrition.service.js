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
exports.generatePetNutritionPDFService = void 0;
// src/services/petNutritionService.ts
const pdf_lib_1 = require("pdf-lib"); // Import StandardFonts
const nutrition_model_1 = __importDefault(require("./nutrition.model"));
const generatePetNutritionPDFService = (petType, age, weight) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Service Data:", { petType, age, weight }); // Log incoming data
    try {
        const ageRange = getAgeRange(petType, age);
        console.log("Age Range:", ageRange); // Log the age range
        const nutritionData = yield nutrition_model_1.default.findOne({
            petType,
            ageRange,
        });
        if (!nutritionData) {
            console.error("Nutrition data not found for:", { petType, ageRange }); // Log if data is not found
            throw new Error("Nutrition data not found");
        }
        const calories = calculateCalories(petType, weight, age, nutritionData.caloriesFactor);
        // Create PDF
        const pdfDoc = yield pdf_lib_1.PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]); // Set a specific page size
        // Draw a white background
        page.drawRectangle({
            x: 0,
            y: 0,
            width: page.getWidth(),
            height: page.getHeight(),
            color: (0, pdf_lib_1.rgb)(1, 1, 1), // White background
        });
        // Embed the Helvetica Bold font
        const helveticaBold = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
        const helvetica = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        // Header
        page.drawText("Pet Nutrition Chart", {
            x: 50,
            y: 770,
            size: 30,
            color: (0, pdf_lib_1.rgb)(0.2, 0.5, 0.8), // Blue color
            font: helveticaBold,
        });
        // Subtitle
        page.drawText(`For ${petType.charAt(0).toUpperCase() + petType.slice(1)}`, {
            x: 50,
            y: 740,
            size: 20,
            color: (0, pdf_lib_1.rgb)(0.0, 0.0, 0.0), // Black
            font: helvetica,
        });
        // Divider Line
        page.drawRectangle({
            x: 50,
            y: 725,
            width: 500,
            height: 1,
            color: (0, pdf_lib_1.rgb)(0.2, 0.5, 0.8),
        });
        // Pet Information
        const infoYStart = 680;
        page.drawText(`Age: ${age} years (${ageRange})`, {
            x: 50,
            y: infoYStart,
            size: 18,
            color: (0, pdf_lib_1.rgb)(0, 0, 0), // Black
            font: helvetica,
        });
        page.drawText(`Weight: ${weight} kg`, {
            x: 50,
            y: infoYStart - 30,
            size: 18,
            color: (0, pdf_lib_1.rgb)(0, 0, 0), // Black
            font: helvetica,
        });
        page.drawText(`Recommended daily calories: ${calories.toFixed(2)} kcal`, {
            x: 50,
            y: infoYStart - 60,
            size: 18,
            color: (0, pdf_lib_1.rgb)(0, 0, 0), // Black
            font: helvetica,
        });
        // Nutrition Facts Header
        const nutritionYStart = infoYStart - 100;
        page.drawText("Nutrition Facts:", {
            x: 50,
            y: nutritionYStart,
            size: 24,
            color: (0, pdf_lib_1.rgb)(0.2, 0.5, 0.8), // Blue color
            font: helveticaBold,
        });
        // Nutrition Facts Table
        const nutritionDataYStart = nutritionYStart - 30;
        const nutritionFacts = [
            { label: "Protein", value: `${nutritionData.proteinPercentage}%` },
            { label: "Fat", value: `${nutritionData.fatPercentage}%` },
            {
                label: "Carbohydrates",
                value: `${nutritionData.carbohydratePercentage}%`,
            },
        ];
        nutritionFacts.forEach((fact, index) => {
            page.drawText(`${fact.label}:`, {
                x: 50,
                y: nutritionDataYStart - index * 30,
                size: 18,
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
                font: helvetica,
            });
            page.drawText(fact.value, {
                x: 300,
                y: nutritionDataYStart - index * 30,
                size: 18,
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
                font: helvetica,
            });
        });
        // Footer with date
        const currentDate = new Date().toLocaleDateString();
        page.drawText(`Generated on: ${currentDate}`, {
            x: 50,
            y: 50,
            size: 12,
            color: (0, pdf_lib_1.rgb)(0.5, 0.5, 0.5), // Gray
            font: helvetica,
        });
        const pdfBytes = yield pdfDoc.save();
        return Buffer.from(pdfBytes);
    }
    catch (error) {
        console.error("Error in PDF generation service:", error); // Log error details
        throw new Error("Failed to generate PDF");
    }
});
exports.generatePetNutritionPDFService = generatePetNutritionPDFService;
// Age Range Calculation
function getAgeRange(petType, age) {
    switch (petType.toLowerCase()) {
        case "dog":
            if (age < 1)
                return "puppy";
            if (age < 7)
                return "adult";
            return "senior";
        case "cat":
            if (age < 1)
                return "kitten";
            if (age < 7)
                return "adult";
            return "senior";
        case "rabbit":
            if (age < 1)
                return "young";
            if (age < 6)
                return "adult";
            return "senior";
        default:
            throw new Error("Unsupported pet type");
    }
}
// Calculate Daily Caloric Needs
function calculateCalories(petType, weight, age, factor) {
    let baseCalories = weight * factor;
    // Adjust calories based on age and pet type
    switch (petType.toLowerCase()) {
        case "dog":
            if (age < 1)
                baseCalories *= 1.2; // Puppies need more calories
            if (age > 7)
                baseCalories *= 0.8; // Senior dogs need fewer calories
            break;
        case "cat":
            if (age < 1)
                baseCalories *= 1.3; // Kittens need more calories
            if (age > 7)
                baseCalories *= 0.9; // Senior cats need slightly fewer calories
            break;
        case "rabbit":
            if (age < 1)
                baseCalories *= 1.2; // Young rabbits need more calories
            if (age > 6)
                baseCalories *= 0.9; // Senior rabbits need fewer calories
            break;
        default:
            throw new Error("Unsupported pet type");
    }
    return baseCalories;
}
