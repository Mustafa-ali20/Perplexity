import cookieParser from "cookie-parser";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.midleware.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// health Check
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);

app.use(errorHandler);

export default app;
