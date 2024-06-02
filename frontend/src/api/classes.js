import { API_URL } from "./api";

export const getAll = async () => {
  const response = await fetch(API_URL + "/classes/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();
  return APIResponseObject.gymClasses;
};

export const getAllGymClassDetails = async () => {
  const response = await fetch(API_URL + "/classes/details", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();
  return APIResponseObject;
};

export const getAllFutureGymClassDetails = async () => {
  const response = await fetch(API_URL + "/classes/futureDetails", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();
  return APIResponseObject;
};

export const getByID = async (gymClassID) => {
  const response = await fetch(API_URL + "/classes/" + gymClassID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.gymClasses;
};

export const getByUserID = async (userID) => {
  const response = await fetch(API_URL + "/classes/user/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const APIResponseObject = await response.json();
  return APIResponseObject.gymClasses;
};

export const getByUserIDAndDate = async (userID) => {
  const response = await fetch(API_URL + "/classes/userAndDate/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const APIResponseObject = await response.json();
  return APIResponseObject.gymClasses;
};

export const create = async (gymClass, authenticationKey) => {
  const response = await fetch(API_URL + "/classes/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify(gymClass),
  });

  const postCreateGymClassResponse = await response.json();

  return postCreateGymClassResponse.gymClass;
};

export const update = async (gymClass, authenticationKey) => {
  const response = await fetch(API_URL + "/classes/", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify(gymClass),
  });

  const patchGymClassResponse = await response.json();

  return patchGymClassResponse.gymClass;
};

export const deleteByID = async (gymClassID, authenticationKey) => {
  const response = await fetch(API_URL + "/classes/" + gymClassID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify({}),
  });

  const deleteGymClassResponse = await response.json();

  return deleteGymClassResponse;
};
