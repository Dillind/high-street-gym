import express from "express";
import cors from "cors";
import userController from "./controllers/users.js";
import activityController from "./controllers/activities.js";
import fileUpload from "express-fileupload";
import classController from "./controllers/classes.js";
import bookingController from "./controllers/bookings.js";
import blogController from "./controllers/blogs.js";
import locationController from "./controllers/locations.js";

const app = express();
const port = 8080;

// Enable cross-origin resource sharing (CORS)
app.use(
  cors({
    // Allow all origins
    origin: true,
  })
);

// Enable JSON request parsing middleware
app.use(express.json());

// Enable file upload support
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

// Import and use the route defined by the controller
app.use("/users", userController);
app.use("/activities", activityController);
app.use("/classes", classController);
app.use("/bookings", bookingController);
app.use("/blogs", blogController);
app.use("/locations", locationController);

// Catch errors raised by endpoints and respond with JSON error object
app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    status: err.status,
    message: err.message,
    errors: err.errors,
  });
});

// listen for API requests
app.listen(port, () => {
  console.log(`Started a server on http://localhost:${port}`);
});
