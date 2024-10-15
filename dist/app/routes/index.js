"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("../modules/Auth/auth.router");
const user_route_1 = require("../modules/user/user.route");
const post_route_1 = require("../modules/Pet Post/post.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const nutrition_route_1 = require("../modules/nutrition pdf/nutrition.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_router_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/pet",
        route: post_route_1.PetPostRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/Nutrition",
        route: nutrition_route_1.Nutrition,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
