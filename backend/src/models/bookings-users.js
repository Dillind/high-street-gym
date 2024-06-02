import { db } from "../database.js";

export const newBookingUser = (
  booking_id,
  booking_user_id,
  booking_class_id,
  booking_created_datetime,
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
  return db
    .query(
      `SELECT * FROM bookings INNER JOIN users ON bookings.booking_user_id = users.user_id`
    )
    .then(([queryResult]) => {
      return queryResult.map((result) =>
        newBookingUser(
          result.booking_id,
          result.booking_user_id,
          result.booking_class_id,
          result.booking_created_datetime,
          result.user_id,
          result.user_first_name,
          result.user_last_name,
          result.user_email,
          result.user_password,
          result.user_phone,
          result.user_role,
          result.user_profile_img,
          result.user_authentication_key
        )
      );
    });
};
