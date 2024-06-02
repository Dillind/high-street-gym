// TESTING MODELS

import {
  getAll,
  getByID,
  getByEmail,
  create,
  newUser,
  update,
  deleteByID,
  getByAuthenticationKey,
} from "./models/users.js";

// import {
//   newBooking,
//   getAll,
//   getByID,
//   create,
//   update,
//   deleteByID,
// } from "./models/bookings.js";

import {
  getAllFutureGymClassDetails,
  getAllGymClassDetails,
} from "./models/classes.js";

getAllFutureGymClassDetails()
  .then((result) => console.log(result))
  .catch((error) => console.log(error));

// getAllGymClassDetails()
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// import { getAll } from "./models/bookings-users.js";
// import { getAll } from "./models/classes-users.js";
// import { getAll } from "./models/blogs-users.js";
// import { getAll } from "./models/classes-activities.js";

// import { getByID } from "./models/bookings-details.js";

// const booking = newBooking(null, 5, 1, new Date());

// create(booking)
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// getAll()
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// getByID(1)
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// getByID(3).then((booking) => {
//   booking.user_id = 4;
//   update(booking)
//     .then((result) => console.log(result))
//     .catch((error) => console.log(error));
// });

// getByEmail("dylan@email.com")
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// getByID(2).then((user) => {
//   user.first_name = "Bart"
//   user.email = "bart@email.com"
//   update(user)
//     .then((result) => console.log(result))
//     .catch((error) => console.log(error));
// });

// deleteByID(4)
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));

// getByAuthenticationKey("3da1bb21-de3b-45f4-919b-196e0cb312c0")
//   .then((result) => {
//     result.authentication_key = null;
//     console.log(result);
//     update(result).then((user) => {
//       console.log(`This is the result: ${result}`);
//     });
//   })
//   .catch((error) => console.log(error));
