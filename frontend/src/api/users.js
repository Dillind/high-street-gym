import { API_URL } from "./api";

export const login = async (email, password) => {
  const response = await fetch(API_URL + "/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const APIResponseObject = await response.json();

  console.log(APIResponseObject);

  return APIResponseObject;
};

export const logout = async (authenticationKey) => {
  const response = await fetch(API_URL + "/users/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify({}),
  });

  const APIResponseObject = await response.json();

  console.log(APIResponseObject);

  return APIResponseObject;
};

export const getAllUsers = async (authenticationKey) => {
  // GET from the API /users
  const response = await fetch(API_URL + "/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.users;
};

export const getUserByID = async (userID, authenticationKey) => {
  const response = await fetch(API_URL + "/users/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.user;
};

export const getByAuthenticationKey = async (authenticationKey) => {
  const response = await fetch(
    API_URL + "/users/authentication/" + authenticationKey,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const APIResponseObject = await response.json();

  return APIResponseObject.user;
};

export const update = async (user, authenticationKey) => {
  const response = await fetch(API_URL + "/users/" + user.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify({ user }),
  });

  const patchUserResult = await response.json();

  return patchUserResult;
};

export const create = async (user, authenticationKey) => {
  const response = await fetch(API_URL + "/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify({ user }),
  });

  const postUserResult = await response.json();

  return postUserResult;
};

export const deleteByID = async (userID, authenticationKey) => {
  const response = await fetch(API_URL + "/users/" + userID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify({}),
  });

  const deleteResult = await response.json();

  return deleteResult;
};

export const registerUser = async (user) => {
  const response = await fetch(API_URL + "/users/registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const patchUserResult = await response.json();

  return patchUserResult;
};
