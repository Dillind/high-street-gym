import { Router } from "express";
import * as Bookings from "../models/bookings.js";
import auth from "../middleware/auth.js";
import validator from "validator";

const bookingController = Router();

bookingController.get("/", async (req, res) => {
  const bookings = await Bookings.getAll();

  if (!bookings) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve all bookings",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all bookings",
      bookings,
    });
  }
});

bookingController.get("/:id", async (req, res) => {
  const bookingID = req.params.id;

  if (isNaN(bookingID) || bookingID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  Bookings.getByID(bookingID)
    .then((booking) => {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved booking by ID",
        booking,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve booking by ID",
      });
    });
});

bookingController.get("/user/:id", async (req, res) => {
  const userID = req.params.id;

  if (isNaN(userID) || userID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  try {
    const bookings = await Bookings.getByUserID(userID);
    if (!bookings) {
      res.status(404).json({
        status: 404,
        message: "Booking with that user ID not found",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all bookings by user ID",
        bookings,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve bookings with the provided user ID",
    });
  }
});

bookingController.get("/userAndDate/:id", async (req, res) => {
  const userID = req.params.id;

  if (isNaN(userID) || userID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  try {
    const bookings = await Bookings.getByUserIDAndDate(userID);
    if (!bookings) {
      res.status(404).json({
        status: 404,
        message: "Booking with that user ID not found",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all bookings by user ID and date",
        bookings,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve bookings with the provided user ID",
    });
  }
});

bookingController.post("/", async (req, res) => {
  const bookingData = req.body;

  if (!/^\d+$/.test(bookingData.user_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  if (!/^\d+$/.test(bookingData.class_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  // Convert booking data into a Bookings model object
  const booking = Bookings.newBooking(
    null,
    bookingData.user_id,
    bookingData.class_id,
    new Date()
  );

  // Use the create model function to insert the booking into the database
  Bookings.create(booking)
    .then((booking) => {
      res.status(200).json({
        status: 200,
        message: "Successfully created new booking",
        booking,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to create new booking",
      });
    });
});

bookingController.patch("/:id", async (req, res) => {
  const bookingID = req.params.id;
  const bookingData = req.body;

  if (!/^\d+$/.test(bookingData.id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  if (!/^\d+$/.test(bookingData.user_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  if (!/^\d+$/.test(bookingData.class_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  if (isNaN(bookingID) || bookingID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  try {
    const existingBooking = await Bookings.getByID(bookingID);

    if (!existingBooking) {
      return res.status(404).json({
        status: 404,
        message: "Booking with that ID not found",
      });
    }

    bookingData.id = bookingID;

    const booking = Bookings.newBooking(
      bookingData.id,
      bookingData.user_id,
      bookingData.class_id,
      bookingData.created_datetime
    );

    const updatedBooking = await Bookings.update(booking);

    if (updatedBooking) {
      res.status(200).json({
        status: 200,
        message: "Successfully updated the booking",
        booking: updatedBooking,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to update the booking",
    });
  }
});

bookingController.delete("/:id", async (req, res) => {
  const bookingID = req.params.id;

  if (isNaN(bookingID) || bookingID <= 0) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  try {
    const bookingToDelete = await Bookings.getByID(bookingID);

    if (!bookingToDelete) {
      res.status(404).json({
        status: 404,
        message: "Booking was not found with that ID",
      });
    }

    await Bookings.deleteByID(bookingID);

    res.status(200).json({
      status: 200,
      message: "Successfully deleted the booking",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to delete the booking",
    });
  }
});

export default bookingController;
