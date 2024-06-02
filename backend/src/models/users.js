import { db } from "../database.js";

export const newUser = (
  id,
  first_name,
  last_name,
  email,
  password,
  phone,
  role,
  profile_img,
  authentication_key
) => {
  return {
    id,
    first_name,
    last_name,
    email,
    password,
    phone,
    role,
    profile_img,
    authentication_key,
  };
};

export const getAll = async () => {
  const [allUserResults] = await db.query("SELECT * FROM users");

  return await allUserResults.map((userResult) => {
    return newUser(
      userResult.user_id.toString(),
      userResult.user_first_name,
      userResult.user_last_name,
      userResult.user_email,
      userResult.user_password,
      userResult.user_phone,
      userResult.user_role,
      userResult.user_profile_img,
      userResult.user_authentication_key
    );
  });
};

export const getByID = async (userID) => {
  const [userResults] = await db.query(
    "SELECT * FROM users WHERE user_id = ?",
    userID
  );

  if (userResults.length > 0) {
    const userResult = userResults[0];
    return Promise.resolve(
      newUser(
        userResult.user_id.toString(),
        userResult.user_first_name,
        userResult.user_last_name,
        userResult.user_email,
        userResult.user_password,
        userResult.user_phone,
        userResult.user_role,
        userResult.user_profile_img,
        userResult.user_authentication_key
      )
    );
  } else {
    return Promise.reject("No results found");
  }
};

export const getByEmail = async (email) => {
  const [userResults] = await db.query(
    "SELECT * FROM users WHERE user_email = ?",
    [email]
  );

  if (userResults.length > 0) {
    const userResult = userResults[0];
    return Promise.resolve(
      newUser(
        userResult.user_id.toString(),
        userResult.user_first_name,
        userResult.user_last_name,
        userResult.user_email,
        userResult.user_password,
        userResult.user_phone,
        userResult.user_role,
        userResult.user_profile_img,
        userResult.user_authentication_key
      )
    );
  } else {
    return Promise.resolve(null);
  }
};

export const getByAuthenticationKey = async (authenticationKey) => {
  const [userResults] = await db.query(
    "SELECT * FROM users WHERE user_authentication_key = ?",
    authenticationKey
  );

  if (userResults.length > 0) {
    const userResult = userResults[0];

    return Promise.resolve(
      newUser(
        userResult.user_id.toString(),
        userResult.user_first_name,
        userResult.user_last_name,
        userResult.user_email,
        userResult.user_password,
        userResult.user_phone,
        userResult.user_role,
        userResult.user_profile_img,
        userResult.user_authentication_key
      )
    );
  } else {
    return Promise.reject("No results found");
  }
};

export const create = async (user) => {
  delete user.id;

  return db
    .query(
      `INSERT INTO users (user_first_name, user_last_name, user_email, user_password, user_phone, user_role, user_profile_img, user_authentication_key) VALUE (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.first_name,
        user.last_name,
        user.email,
        user.password,
        user.phone,
        user.role,
        user.profile_img,
        user.authentication_key,
      ]
    )
    .then(([result]) => {
      return { ...user, id: result.insertId };
    });
};

export const update = async (user) => {
  return db
    .query(
      `
    UPDATE users SET
      user_first_name = ?,
      user_last_name = ?,
      user_email = ?,
      user_password = ?,
      user_phone = ?,
      user_role = ?,
      user_profile_img = ?,
      user_authentication_key = ?
    WHERE user_id = ?`,
      [
        user.first_name,
        user.last_name,
        user.email,
        user.password,
        user.phone,
        user.role,
        user.profile_img,
        user.authentication_key,
        user.id,
      ]
    )
    .then(([result]) => {
      return { ...user, id: result.insertId };
    });
};

export const deleteByID = async (userID) => {
  return db.query(`DELETE FROM users WHERE user_id = ?`, [userID]);
};
