import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import session from "express-session";
import APInotfound from "./app/middlewares/APInotfound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import config from "./config";

const app = express();

// Parsers
app.use(express.json());
app.use(cookieParser());

// CORS Options
// const corsOptions = {
//   origin: [
//     "http://localhost:5173",
//     "http://localhost:3000",
//     "https://paw-pedia-frontend.vercel.app",
//     "https://paw-pedia-backend.vercel.app",
//   ],
//   credentials: true,
//   methods: "GET,POST,PUT,DELETE",
//   optionsSuccessStatus: 200,
//   allowedHeaders: "Content-Type, Authorization",
// };
const corsOptions = {
  origin: "*", // Allow all origins
  credentials: true,
};

app.use(cors(corsOptions));
// CORS Middleware
app.use(cors(corsOptions));

// Session middleware
app.use(
  session({
    secret: config.SESSION_SECRET as string, // Ensure this is set in your environment
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Pet Care Service");
});
app.use("/api", router);

// Handle errors and not found routes
app.use(globalErrorHandler);
app.use(APInotfound);

export default app;
