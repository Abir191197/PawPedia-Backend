"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const router = express_1.default.Router();
router.get("/me", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), user_controller_1.userControllers.findUser);
router.put("/me/update", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), user_controller_1.userControllers.updatedUser);
router.get("/allUsers", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), // Assuming this checks for admin and user roles
user_controller_1.userControllers.AllUsersController);
router.delete("/allUsers/:userId", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), user_controller_1.userControllers.UserDeleteController);
exports.UserRoutes = router;
