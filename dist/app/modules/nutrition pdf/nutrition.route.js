"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nutrition = void 0;
const auth_1 = __importDefault(require("../../middlewares/auth"));
const express_1 = __importDefault(require("express"));
const user_constant_1 = require("../user/user.constant");
const nutrition_controller_1 = require("./nutrition.controller");
const router = express_1.default.Router();
router.post("/generate-pdf", (0, auth_1.default)(user_constant_1.USER_ROLE.user), nutrition_controller_1.generatePetNutritionPDF);
exports.Nutrition = router;
