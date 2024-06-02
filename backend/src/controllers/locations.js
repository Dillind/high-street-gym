import * as Locations from "../models/locations.js";
import { Router } from "express";
import auth from "../middleware/auth.js";
import validator from "validator";

const locationController = Router();

locationController.get("/", async (req, res) => {
  const locations = await Locations.getAll();

  if (!locations) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve all locations",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all locations",
      locations,
    });
  }
});

export default locationController;
