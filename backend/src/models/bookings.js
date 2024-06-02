import { db } from "../database.js";

export const newBooking = (id, user_id, class_id, created_datetime) => {
  return {
    id,
    user_id,
    class_id,
    created_datetime,
  };
};

export const newCompleteBookingDetails = (
  booking_id,
  booking_user_id,
  booking_class_id,
  booking_created_datetime,
  class_id,
  class_datetime,
  class_activity_id,
  class_location_id,
  class_trainer_id,
  activity_id,
  activity_name,
  activity_description,
  activity_duration,
  location_id,
  location_name,
  user_id,
  user_first_name,
  user_last_name,
  user_email,
  user_password,
  user_phone,
  user_role,
  user_profile_img,
  user_authentication_key
) => {
  return {
    booking_id,
    booking_user_id,
    booking_class_id,
    booking_created_datetime,
    class_id,
    class_datetime,
    class_activity_id,
    class_location_id,
    class_trainer_id,
    activity_id,
    activity_name,
    activity_description,
    activity_duration,
    location_id,
    location_name,
    user_id,
    user_first_name,
    user_last_name,
    user_email,
    user_password,
    user_phone,
    user_role,
    user_profile_img,
    user_authentication_key,
  };
};

export const getAll = async () => {
  const [allBookingResults] = await db.query("SELECT * FROM bookings");

  return await allBookingResults.map((bookingResult) => {
    return newBooking(
      bookingResult.booking_id.toString(),
      bookingResult.booking_user_id,
      bookingResult.booking_class_id,
      bookingResult.booking_created_datetime
    );
  });
};

export const getByID = async (bookingID) => {
  const [bookingResults] = await db.query(
    "SELECT * FROM bookings WHERE booking_id = ?",
    bookingID
  );

  if (bookingResults.length > 0) {
    const bookingResult = bookingResults[0];
    return Promise.resolve(
      newBooking(
        bookingResult.booking_id.toString(),
        bookingResult.booking_user_id,
        bookingResult.booking_class_id,
        bookingResult.booking_created_datetime
      )
    );
  } else {
    return Promise.reject("No results found");
  }
};

export const getByUserID = async (userID) => {
  // Get the collection of all bookings with the matching USER ID
  const [bookingResults] = await db.query(
    `SELECT * FROM bookings 
      INNER JOIN classes ON bookings.booking_class_id = classes.class_id 
      INNER JOIN activities ON classes.class_activity_id = activities.activity_id
      INNER JOIN locations ON classes.class_location_id = locations.location_id
      INNER JOIN users ON classes.class_trainer_id = users.user_id
    WHERE bookings.booking_user_id = ?`,
    [userID]
  );

  if (bookingResults.length >= 0) {
    const bookings = bookingResults.map((bookingResult) => {
      return newCompleteBookingDetails(
        bookingResult.booking_id,
        bookingResult.booking_user_id,
        bookingResult.booking_class_id,
        bookingResult.booking_created_datetime,
        bookingResult.class_id,
        bookingResult.class_datetime,
        bookingResult.class_activity_id,
        bookingResult.class_location_id,
        bookingResult.class_trainer_id,
        bookingResult.activity_id,
        bookingResult.activity_name,
        bookingResult.activity_description,
        bookingResult.activity_duration,
        bookingResult.location_id,
        bookingResult.location_name,
        bookingResult.user_id,
        bookingResult.user_first_name,
        bookingResult.user_last_name,
        bookingResult.user_email,
        bookingResult.user_password,
        bookingResult.user_phone,
        bookingResult.user_role,
        bookingResult.user_profile_img,
        bookingResult.user_authentication_key
      );
    });
    return Promise.resolve(bookings);
  } else {
    return Promise.reject("No results found");
  }
};

export const getByUserIDAndDate = async (userID) => {
  const currentDate = new Date();
  // Get the collection of all bookings with the matching USER ID
  const [bookingResults] = await db.query(
    `SELECT * FROM bookings 
      INNER JOIN classes ON bookings.booking_class_id = classes.class_id 
      INNER JOIN activities ON classes.class_activity_id = activities.activity_id
      INNER JOIN locations ON classes.class_location_id = locations.location_id
      INNER JOIN users ON classes.class_trainer_id = users.user_id
    WHERE bookings.booking_user_id = ? AND classes.class_datetime >= ?`,
    [userID, currentDate]
  );

  if (bookingResults.length >= 0) {
    const bookings = bookingResults.map((bookingResult) => {
      return newCompleteBookingDetails(
        bookingResult.booking_id,
        bookingResult.booking_user_id,
        bookingResult.booking_class_id,
        bookingResult.booking_created_datetime,
        bookingResult.class_id,
        bookingResult.class_datetime,
        bookingResult.class_activity_id,
        bookingResult.class_location_id,
        bookingResult.class_trainer_id,
        bookingResult.activity_id,
        bookingResult.activity_name,
        bookingResult.activity_description,
        bookingResult.activity_duration,
        bookingResult.location_id,
        bookingResult.location_name,
        bookingResult.user_id,
        bookingResult.user_first_name,
        bookingResult.user_last_name,
        bookingResult.user_email,
        bookingResult.user_password,
        bookingResult.user_phone,
        bookingResult.user_role,
        bookingResult.user_profile_img,
        bookingResult.user_authentication_key
      );
    });
    return Promise.resolve(bookings);
  } else {
    return Promise.reject("No results found");
  }
};

export const create = async (booking) => {
  delete booking.id;

  return db
    .query(
      `INSERT INTO bookings (booking_user_id, booking_class_id, booking_created_datetime) VALUE (?, ?, ?)`,
      [booking.user_id, booking.class_id, booking.created_datetime]
    )
    .then(([result]) => {
      return { ...booking, id: result.insertId };
    });
};

export const update = async (booking) => {
  return db
    .query(
      `
    UPDATE bookings SET
      booking_user_id = ?,
      booking_class_id = ?,
      booking_created_datetime = ?
    WHERE booking_id = ?`,
      [booking.user_id, booking.class_id, booking.created_datetime, booking.id]
    )
    .then(([result]) => {
      return { ...booking, id: result.insertId };
    });
};

export const deleteByID = async (bookingID) => {
  return db.query("DELETE FROM bookings WHERE booking_id = ?", bookingID);
};
