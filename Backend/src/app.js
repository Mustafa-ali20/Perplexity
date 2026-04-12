import cookieParser from "cookie-parser";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.midleware.js";
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./routes/chat.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// health Check
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

app.use(errorHandler);

export default app;
