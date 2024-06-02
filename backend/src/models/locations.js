import { db } from "../database.js";

export const newLocation = (id, name) => {
  return {
    id,
    name,
  };
};

export const getAll = async () => {
  const [allLocationResults] = await db.query("SELECT * FROM locations");

  return await allLocationResults.map((locationResult) => {
    return newLocation(
      locationResult.location_id.toString(),
      locationResult.location_name
    );
  });
};

export const getByID = async (locationID) => {
  const [locationResults] = await db.query(
    "SELECT * FROM locations WHERE location_id = ?",
    locationID
  );

  if (locationResults.length > 0) {
    const locationResult = locationResults[0];
    return Promise.resolve(
      newLocation(
        locationResult.location_id.toString(),
        locationResult.location_name
      )
    );
  } else {
    return Promise.reject("No results found");
  }
};

export const create = async (location) => {
  delete location.id;

  return db
    .query(`INSERT INTO locations (location_name) VALUE (?)`, [location.name])
    .then(([result]) => {
      return { ...location, id: result.insertId };
    });
};

export const update = async (location) => {
  return db
    .query(
      `
    UPDATE locations SET
      location_name = ?
    WHERE location_id = ?`,
      [location.name, location.id]
    )
    .then(([result]) => {
      return { ...location, id: result.insertId };
    });
};

export const deleteByID = async (locationID) => {
  return db.query(`DELETE FROM locations WHERE location_id = ?`, locationID);
};
