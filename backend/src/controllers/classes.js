import { Router } from "express";
import * as Classes from "../models/classes.js";
import xml2js from "xml2js";
import auth from "../middleware/auth.js";

const classController = Router();

classController.get("/", async (req, res) => {
  const gymClasses = await Classes.getAll();

  if (!gymClasses) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve all gym classes",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all gym classes",
      gymClasses,
    });
  }
});

classController.get("/details", async (req, res) => {
  const gymClasses = await Classes.getAllGymClassDetails();

  if (!gymClasses) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve all the detailed gym classes",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all the detailed gym classes",
      gymClasses,
    });
  }
});

classController.get("/futureDetails", async (req, res) => {
  const gymClasses = await Classes.getAllFutureGymClassDetails();

  if (!gymClasses) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve all the detailed gym classes",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all the detailed gym classes",
      gymClasses,
    });
  }
});

classController.get("/:id", async (req, res) => {
  const gymClassID = req.params.id;

  if (isNaN(gymClassID) || gymClassID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  Classes.getByID(gymClassID)
    .then((gymClass) => {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved gym class by ID",
        gymClass,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve gym class by ID",
      });
    });
});

classController.get("/user/:id", async (req, res) => {
  const userID = req.params.id;

  if (isNaN(userID) || userID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  try {
    const gymClasses = await Classes.getByUserID(userID);
    if (!gymClasses) {
      res.status(404).json({
        status: 404,
        message: "Class with that user ID not found",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all gym classes by user ID",
        gymClasses,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve gym classes with the provided user ID",
    });
  }
});

classController.get("/userAndDate/:id", async (req, res) => {
  const userID = req.params.id;

  if (isNaN(userID) || userID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  try {
    const gymClasses = await Classes.getByUserIDAndDate(userID);
    if (!gymClasses) {
      res.status(404).json({
        status: 404,
        message: "Class with that user ID not found",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all gym classes by user ID and date",
        gymClasses,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve gym classes with the provided user ID",
    });
  }
});

classController.post("/", async (req, res) => {
  const gymClassData = req.body;

  // Data format validation
  if (!/^\d+$/.test(gymClassData.activity_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  if (!/^\d+$/.test(gymClassData.location_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  if (!/^\d+$/.test(gymClassData.trainer_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  // Convert gym class data into a Classes model object
  const gymClass = Classes.newGymClass(
    null,
    new Date(),
    gymClassData.activity_id,
    gymClassData.location_id,
    gymClassData.trainer_id
  );

  // Use the create model function to insert the gym class into the database
  Classes.create(gymClass)
    .then((gymClass) => {
      res.status(200).json({
        status: 200,
        message: "Successfully created new gym class",
        gymClass,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to create new gym class",
      });
    });
});

classController.post("/xml-upload", auth(["admin", "trainer"]), (req, res) => {
  if (req.files && req.files["xml-file"]) {
    // Access the XML file as a String
    const XMLFile = req.files["xml-file"];
    const file_text = XMLFile.data.toString();

    // Set up the XML Parser
    const parser = new xml2js.Parser();
    parser
      .parseStringPromise(file_text)
      .then((data) => {
        const timetableUpload = data["timetable-upload"];
        const timetableUploadAttributes = timetableUpload["$"];
        const operation = timetableUploadAttributes["operation"];
        const timetablesData = timetableUpload["timetables"][0]["timetable"];

        if (operation == "insert") {
          Promise.all(
            timetablesData.map((timetableData) => {
              // Convert the xml object into a model object
              const timetableModel = Classes.newGymClass(
                null,
                timetableData.datetime.toString(),
                timetableData.activity_id.toString(),
                timetableData.location_id.toString(),
                timetableData.trainer_id.toString()
              );
              // Return the promise of each creation query
              return Classes.create(timetableModel);
            })
          )
            .then((results) => {
              res.status(200).json({
                status: 200,
                message: "XML Upload insert was successful.",
              });
            })
            .catch((error) => {
              res.status(500).json({
                status: 500,
                message: `XML upload failed on database operation: ${error}`,
              });
            });
        } else if (operation == "update") {
          Promise.all(
            timetablesData.map((timetableData) => {
              const timetableModel = Classes.newGymClass(
                timetableData.id.toString(),
                timetableData.datetime.toString(),
                timetableData.activity_id.toString(),
                timetableData.location_id.toString(),
                timetableData.trainer_id.toString()
              );
              // Return the promise of each creation query
              return Classes.update(timetableModel);
            })
          )
            .then((results) => {
              res.status(200).json({
                status: 200,
                message: "XML Upload update was successful.",
              });
            })
            .catch((error) => {
              res.status(500).json({
                status: 500,
                message: `XML upload update failed on database operation: ${error}`,
              });
            });
        } else {
          res.status(400).json({
            status: 400,
            message: "XML contains invalid operation attribute value",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Error parsing XML: ${error}`,
        });
      });
  } else {
    res.status(400).json({
      status: 400,
      message: "No file was selected",
    });
  }
});

classController.patch("/:id", async (req, res) => {
  const gymClassID = req.params.id;
  const gymClassData = req.body;

  if (isNaN(gymClassID) || gymClassID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  // Data format validation
  if (!/^\d+$/.test(gymClassData.id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  if (!/^\d+$/.test(gymClassData.activity_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  if (!/^\d+$/.test(gymClassData.location_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  if (!/^\d+$/.test(gymClassData.trainer_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  try {
    const existingGymClass = await Classes.getByID(gymClassID);

    if (!existingGymClass) {
      return res.status(404).json({
        status: 404,
        message: "Gym class with that ID not found",
      });
    }

    gymClassData.id = gymClassID;

    const gymClass = Classes.newGymClass(
      gymClassData.id,
      gymClassData.datetime,
      gymClassData.activity_id,
      gymClassData.location_id,
      gymClassData.trainer_id
    );

    const updatedGymClass = await Classes.update(gymClass);

    if (updatedGymClass) {
      res.status(200).json({
        status: 200,
        message: "Successfully updated the gym class",
        gymClass: updatedGymClass,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to update the gym class",
    });
  }
});

classController.delete("/:id", async (req, res) => {
  const gymClassID = req.params.id;

  if (isNaN(gymClassID) || gymClassID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  try {
    const gymClassToDelete = await Classes.getByID(gymClassID);

    if (!gymClassToDelete) {
      res.status(404).json({
        status: 404,
        message: "Gym class was not found with that ID",
      });
    }

    await Classes.deleteByID(gymClassID);

    res.status(200).json({
      status: 200,
      message: "Successfully deleted the gym class",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to delete the gym class",
    });
  }
});

export default classController;
