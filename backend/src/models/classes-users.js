import { db } from "../database.js";

export const newClassesUser = (
  class_id,
  class_datetime,
  class_activity_id,
  class_location_id,
  class_trainer_id,
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
    class_id,
    class_datetime,
    class_activity_id,
    class_location_id,
    class_trainer_id,
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

// GET ALL
export const getAll = async () => {
  return db
    .query(
      `SELECT * FROM classes INNER JOIN users ON classes.class_trainer_id = users.user_id`
    )
    .then(([queryResult]) => {
      return queryResult.map((result) =>
        newClassesUser(
          result.class_id,
          result.class_datetime,
          result.class_activity_id,
          result.class_location_id,
          result.class_trainer_id,
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
