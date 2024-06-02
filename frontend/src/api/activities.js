import { API_URL } from "./api";

export const getAll = async () => {
  const response = await fetch(API_URL + "/activities/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();
  return APIResponseObject.activities;
};

export const getByID = async (activityID) => {
  const response = await fetch(API_URL + "/activities/" + activityID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
};

export const create = async (activity, authenticationKey) => {
  const response = await fetch(API_URL + "/activities/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify(activity),
  });

  const postCreateActivityResponse = await response.json();

  return postCreateActivityResponse;
};

export const update = async (activity, authenticationKey) => {
  const response = await fetch(API_URL + "/activities/" + activity.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify(activity),
  });

  const patchActivityResponse = await response.json();

  return patchActivityResponse;
};

export const deleteByID = async (activityID, authenticationKey) => {
  const response = await fetch(API_URL + "/activities/" + activityID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify({}),
  });

  const deleteActivityResponse = await response.json();

  return deleteActivityResponse;
};
