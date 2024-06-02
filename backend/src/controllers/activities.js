import { Router } from "express";
import * as Activities from "../models/activities.js";
import auth from "../middleware/auth.js";
import validator from "validator";

const activityController = Router();

activityController.get("/", async (req, res) => {
  const activities = await Activities.getAll();

  if (!activities) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve all activities",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all activities",
      activities,
    });
  }
});

activityController.get("/:id", async (req, res) => {
  const activityID = req.params.id;

  if (isNaN(activityID) || activityID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  Activities.getByID(activityID)
    .then((activity) => {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved activity by ID",
        activity,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve activity by ID",
      });
    });
});

activityController.post("/", async (req, res) => {
  const activityData = req.body;

  // Data format validation
  if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(activityData.name)) {
    return res.status(422).json({
      status: 422,
      message:
        "Invalid format. All activity names must start with a capital letter.",
    });
  }

  if (!/^[A-Za-z0-9 \-!',.]{1,400}$/.test(activityData.description)) {
    return res.status(422).json({
      status: 422,
      message: `Invalid format. Please use only letters, numbers, spaces, hyphens, apostrophes, and 
        exclamation marks, with a maximum length of 400 characters.`,
    });
  }

  if (!/^\d+$/.test(activityData.duration)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  // Convert activity data into an Activity model object
  const activity = Activities.newActivity(
    null,
    validator.escape(activityData.name),
    validator.escape(activityData.description),
    activityData.duration
  );

  // Use the create model function to insert the activity into the database
  Activities.create(activity)
    .then((activity) => {
      res.status(200).json({
        status: 200,
        message: "Successfully created new activity",
        activity,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to create new activity",
      });
    });
});

activityController.patch("/:id", async (req, res) => {
  const activityID = req.params.id;
  const activityData = req.body;

  // Data format validation
  if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(activityData.name)) {
    return res.status(422).json({
      status: 422,
      message:
        "Invalid format. All activity names must start with a capital letter.",
    });
  }

  if (!/^[A-Za-z0-9 \-!',.]{1,400}$/.test(activityData.description)) {
    return res.status(422).json({
      status: 422,
      message: `Invalid format. Please use only letters, numbers, spaces, hyphens, apostrophes,
      and exclamation marks, with a maximum length of 400 characters.`,
    });
  }

  if (!/^\d+$/.test(activityData.duration)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Should be a non-negative integer.",
    });
  }

  if (isNaN(activityID) || activityID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  try {
    const existingActivity = await Activities.getByID(activityID);

    if (!existingActivity) {
      return res.status(404).json({
        status: 404,
        message: "Activity with that ID not found",
      });
    }

    activityData.id = activityID;

    const activity = Activities.newActivity(
      activityData.id,
      validator.escape(activityData.name),
      validator.escape(activityData.description),
      activityData.duration
    );

    // Use the update model function to update the activity in the database
    const updatedActivity = await Activities.update(activity);

    if (updatedActivity) {
      return res.status(200).json({
        status: 200,
        message: "Successfully updated the activity",
        activity: updatedActivity,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to update the activity",
    });
  }
});

activityController.delete("/:id", async (req, res) => {
  const activityID = req.params.id;

  if (isNaN(activityID) || activityID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  try {
    const activityToDelete = await Activities.getByID(activityID);
    if (!activityToDelete) {
      return res.status(404).json({
        status: 404,
        message: "Activity was not found with that ID",
      });
    }

    await Activities.deleteByID(activityID);

    res.status(200).json({
      status: 200,
      message: "Successfully deleted the activity",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to delete the activity",
    });
  }
});

export default activityController;
