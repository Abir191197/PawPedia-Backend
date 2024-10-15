import mongoose, { Schema, Document } from "mongoose";

export interface IPetNutrition extends Document {
  petType: string;
  ageRange: string;
  caloriesFactor: number;
  proteinPercentage: number;
  fatPercentage: number;
  carbohydratePercentage: number;
  // Add more nutritional fields as needed
}

const petNutritionSchema: Schema = new Schema({
  petType: { type: String, required: true },
  ageRange: { type: String, required: true },
  caloriesFactor: { type: Number, required: true },
  proteinPercentage: { type: Number, required: true },
  fatPercentage: { type: Number, required: true },
  carbohydratePercentage: { type: Number, required: true },
  // Add more fields as needed
});

const PetNutritionModel = mongoose.model<IPetNutrition>(
  "PetNutrition",
  petNutritionSchema
);

export default PetNutritionModel;
