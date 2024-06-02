import { db } from "../database.js";

export const newActivity = (id, name, description, duration) => {
  return {
    id,
    name,
    description,
    duration,
  };
};

export const getAll = async () => {
  const [allActivityResults] = await db.query("SELECT * FROM activities");

  return await allActivityResults.map((activityResult) => {
    return newActivity(
      activityResult.activity_id.toString(),
      activityResult.activity_name,
      activityResult.activity_description,
      activityResult.activity_duration
    );
  });
};

export const getByID = async (activityID) => {
  const [activityResults] = await db.query(
    "SELECT * FROM activities WHERE activity_id = ?",
    activityID
  );

  if (activityResults.length > 0) {
    const activityResult = activityResults[0];
    return Promise.resolve(
      newActivity(
        activityResult.activity_id.toString(),
        activityResult.activity_name,
        activityResult.activity_description,
        activityResult.activity_duration
      )
    );
  } else {
    return Promise.reject("No results found");
  }
};

export const create = async (activity) => {
  delete activity.id;

  return db
    .query(
      `INSERT INTO activities (activity_name, activity_description, activity_duration) VALUE (?, ?, ?)`,
      [activity.name, activity.description, activity.duration]
    )
    .then(([result]) => {
      return { ...activity, id: result.insertId };
    });
};

export const update = async (activity) => {
  return db
    .query(
      `
    UPDATE activities SET
      activity_name = ?,
      activity_description = ?,
      activity_duration = ?
    WHERE activity_id = ?`,
      [activity.name, activity.description, activity.duration, activity.id]
    )
    .then(([result]) => {
      return { ...activity, id: result.insertId };
    });
};

export const deleteByID = async (activityID) => {
  const result = db.query(
    `DELETE FROM activities WHERE activity_id = ?`,
    activityID
  );

  if (result) {
    return result;
  } else {
    return Promise.reject("No result found");
  }
};
