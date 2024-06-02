import { db } from "../database.js";

export const newGymClass = (
  id,
  datetime,
  activity_id,
  location_id,
  trainer_id
) => {
  return {
    id,
    datetime,
    activity_id,
    location_id,
    trainer_id,
  };
};

export const newCompleteGymClassDetails = (
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
  const [allGymClassResults] = await db.query("SELECT * FROM classes");

  return await allGymClassResults.map((gymClassResult) => {
    return newGymClass(
      gymClassResult.class_id.toString(),
      gymClassResult.class_datetime,
      gymClassResult.class_activity_id,
      gymClassResult.class_location_id,
      gymClassResult.class_trainer_id
    );
  });
};

export const getAllGymClassDetails = async () => {
  const [allGymClassDetailsResults] = await db.query(
    `SELECT * FROM classes 
    INNER JOIN activities ON classes.class_activity_id = activities.activity_id
    INNER JOIN locations ON classes.class_location_id = locations.location_id
    INNER JOIN users ON classes.class_trainer_id = users.user_id`
  );

  return await allGymClassDetailsResults.map((gymClassDetailsResult) => {
    return newCompleteGymClassDetails(
      gymClassDetailsResult.class_id,
      gymClassDetailsResult.class_datetime,
      gymClassDetailsResult.class_activity_id,
      gymClassDetailsResult.class_location_id,
      gymClassDetailsResult.class_trainer_id,
      gymClassDetailsResult.activity_id,
      gymClassDetailsResult.activity_name,
      gymClassDetailsResult.activity_description,
      gymClassDetailsResult.activity_duration,
      gymClassDetailsResult.location_id,
      gymClassDetailsResult.location_name,
      gymClassDetailsResult.user_id,
      gymClassDetailsResult.user_first_name,
      gymClassDetailsResult.user_last_name,
      gymClassDetailsResult.user_email,
      gymClassDetailsResult.user_password,
      gymClassDetailsResult.user_phone,
      gymClassDetailsResult.user_role,
      gymClassDetailsResult.user_profile_img,
      gymClassDetailsResult.user_authentication_key
    );
  });
};

export const getAllFutureGymClassDetails = async () => {
  const currentDate = new Date();

  const [allFutureGymClassDetailsResults] = await db.query(
    `SELECT * FROM classes 
    INNER JOIN activities ON classes.class_activity_id = activities.activity_id
    INNER JOIN locations ON classes.class_location_id = locations.location_id
    INNER JOIN users ON classes.class_trainer_id = users.user_id
    WHERE classes.class_datetime >= ?`,
    [currentDate]
  );

  return await allFutureGymClassDetailsResults.map(
    (futureGymClassDetailsResult) => {
      return newCompleteGymClassDetails(
        futureGymClassDetailsResult.class_id,
        futureGymClassDetailsResult.class_datetime,
        futureGymClassDetailsResult.class_activity_id,
        futureGymClassDetailsResult.class_location_id,
        futureGymClassDetailsResult.class_trainer_id,
        futureGymClassDetailsResult.activity_id,
        futureGymClassDetailsResult.activity_name,
        futureGymClassDetailsResult.activity_description,
        futureGymClassDetailsResult.activity_duration,
        futureGymClassDetailsResult.location_id,
        futureGymClassDetailsResult.location_name,
        futureGymClassDetailsResult.user_id,
        futureGymClassDetailsResult.user_first_name,
        futureGymClassDetailsResult.user_last_name,
        futureGymClassDetailsResult.user_email,
        futureGymClassDetailsResult.user_password,
        futureGymClassDetailsResult.user_phone,
        futureGymClassDetailsResult.user_role,
        futureGymClassDetailsResult.user_profile_img,
        futureGymClassDetailsResult.user_authentication_key
      );
    }
  );
};

export const getByID = async (gymClassID) => {
  const [gymClassResults] = await db.query(
    "SELECT * FROM classes WHERE class_id = ?",
    gymClassID
  );

  if (gymClassResults.length > 0) {
    const gymClassResult = gymClassResults[0];
    return Promise.resolve(
      newGymClass(
        gymClassResult.class_id.toString(),
        gymClassResult.class_datetime,
        gymClassResult.class_activity_id,
        gymClassResult.class_location_id,
        gymClassResult.class_trainer_id
      )
    );
  } else {
    return Promise.reject("No results found");
  }
};

export const getByUserID = async (userID) => {
  // Get the collection of all bookings with the matching USER ID
  const [gymClassResults] = await db.query(
    `SELECT * FROM classes 
      INNER JOIN activities ON classes.class_activity_id = activities.activity_id
      INNER JOIN locations ON classes.class_location_id = locations.location_id
      INNER JOIN users ON classes.class_trainer_id = users.user_id
    WHERE classes.class_trainer_id = ?`,
    [userID]
  );

  if (gymClassResults.length >= 0) {
    const gymClasses = gymClassResults.map((gymClassResult) => {
      return newCompleteGymClassDetails(
        gymClassResult.class_id,
        gymClassResult.class_datetime,
        gymClassResult.class_activity_id,
        gymClassResult.class_location_id,
        gymClassResult.class_trainer_id,
        gymClassResult.activity_id,
        gymClassResult.activity_name,
        gymClassResult.activity_description,
        gymClassResult.activity_duration,
        gymClassResult.location_id,
        gymClassResult.location_name,
        gymClassResult.user_id,
        gymClassResult.user_first_name,
        gymClassResult.user_last_name,
        gymClassResult.user_email,
        gymClassResult.user_password,
        gymClassResult.user_phone,
        gymClassResult.user_role,
        gymClassResult.user_profile_img,
        gymClassResult.user_authentication_key
      );
    });
    return Promise.resolve(gymClasses);
  } else {
    return Promise.reject("No results found");
  }
};

export const getByUserIDAndDate = async (userID) => {
  const currentDate = new Date();
  // Get the collection of all bookings with the matching USER ID
  const [gymClassResults] = await db.query(
    `SELECT * FROM classes 
      INNER JOIN activities ON classes.class_activity_id = activities.activity_id
      INNER JOIN locations ON classes.class_location_id = locations.location_id
      INNER JOIN users ON classes.class_trainer_id = users.user_id
    WHERE classes.class_trainer_id = ? AND classes.class_datetime >= ?`,
    [userID, currentDate]
  );

  if (gymClassResults.length >= 0) {
    const gymClasses = gymClassResults.map((gymClassResult) => {
      return newCompleteGymClassDetails(
        gymClassResult.class_id,
        gymClassResult.class_datetime,
        gymClassResult.class_activity_id,
        gymClassResult.class_location_id,
        gymClassResult.class_trainer_id,
        gymClassResult.activity_id,
        gymClassResult.activity_name,
        gymClassResult.activity_description,
        gymClassResult.activity_duration,
        gymClassResult.location_id,
        gymClassResult.location_name,
        gymClassResult.user_id,
        gymClassResult.user_first_name,
        gymClassResult.user_last_name,
        gymClassResult.user_email,
        gymClassResult.user_password,
        gymClassResult.user_phone,
        gymClassResult.user_role,
        gymClassResult.user_profile_img,
        gymClassResult.user_authentication_key
      );
    });
    return Promise.resolve(gymClasses);
  } else {
    return Promise.reject("No results found");
  }
};

export const create = async (gymClass) => {
  delete gymClass.id;

  return db
    .query(
      `INSERT INTO classes (class_datetime, class_activity_id, class_location_id, class_trainer_id) VALUE (?, ?, ?, ?)`,
      [
        gymClass.datetime,
        gymClass.activity_id,
        gymClass.location_id,
        gymClass.trainer_id,
      ]
    )
    .then(([result]) => {
      return { ...gymClass, id: result.insertId };
    });
};

export const update = async (gymClass) => {
  return db
    .query(
      `
    UPDATE classes SET
      class_datetime = ?,
      class_activity_id = ?,
      class_location_id = ?, 
      class_trainer_id = ?
    WHERE class_id = ?`,
      [
        gymClass.datetime,
        gymClass.activity_id,
        gymClass.location_id,
        gymClass.trainer_id,
        gymClass.id,
      ]
    )
    .then(([result]) => {
      return { ...gymClass, id: result.insertId };
    });
};

export const deleteByID = async (gymClassID) => {
  return db.query("DELETE FROM classes WHERE class_id = ?", gymClassID);
};
