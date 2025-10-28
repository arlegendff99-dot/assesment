import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.js";

const router = express.Router();

// Doctor Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new Doctor({ name, email, password: hashedPassword });
    await doctor.save();

    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// Doctor Signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ doctorId: doctor._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, doctor: { id: doctor._id, name: doctor.name, email: doctor.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

export default router;
