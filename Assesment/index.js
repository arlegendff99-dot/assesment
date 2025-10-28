import express from "express";
import mongoose from "mongoose";
require("dotenv").config(); 
import cors from "cors";

import doctorRoutes from "./routes/doctorROUTE.js";
import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// Routes
app.use("/api", doctorRoutes);
app.use("/api", patientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
