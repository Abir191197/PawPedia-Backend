"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetPostModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CommentSchema = new mongoose_1.Schema({
    authorId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    authorName: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const PetPostSchema = new mongoose_1.Schema({
    authorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ["Tip", "Story"], required: true },
    isPremium: { type: Boolean, default: false },
    PremiumAmount: { type: Number, default: null },
    PaidByUserPostId: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Users", default: [] }],
    images: [String],
    upvote: { type: [mongoose_1.Schema.Types.ObjectId], ref: "Users" },
    downvote: { type: [mongoose_1.Schema.Types.ObjectId], ref: "Users" },
    comments: [CommentSchema],
}, { timestamps: true });
exports.PetPostModel = mongoose_1.default.model("PetPost", PetPostSchema, "PetPost");
