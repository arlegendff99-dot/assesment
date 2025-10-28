import express from "express";
import Patient from "../models/Patient.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.use(authMiddleware);

// Get all patients
router.get("/patients", async (req, res) => {
  const patients = await Patient.find({ doctorId: req.user.doctorId });
  res.json(patients);
});

// Add patient
router.post("/patients", async (req, res) => {
  const { name, disease, wardNumber } = req.body;
  const newPatient = new Patient({ doctorId: req.user.doctorId, name, disease, wardNumber });
  await newPatient.save();
  res.status(201).json(newPatient);
});

// Update patient
router.put("/patients/:id", async (req, res) => {
  const updated = await Patient.findOneAndUpdate(
    { _id: req.params.id, doctorId: req.user.doctorId },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Patient not found" });
  res.json(updated);
});

// Delete patient
router.delete("/patients/:id", async (req, res) => {
  const deleted = await Patient.findOneAndDelete({
    _id: req.params.id,
    doctorId: req.user.doctorId,
  });
  if (!deleted) return res.status(404).json({ message: "Patient not found" });
  res.json({ message: "Patient deleted successfully" });
});

export default router;
