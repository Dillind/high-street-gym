import { API_URL } from "./api";

export const getAll = async () => {
  const response = await fetch(API_URL + "/bookings/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();
  return APIResponseObject.bookings;
};

export const getByID = async (bookingID) => {
  const response = await fetch(API_URL + "/bookings/" + bookingID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.booking;
};

export const getByUserID = async (userID) => {
  const response = await fetch(API_URL + "/bookings/user/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const APIResponseObject = await response.json();
  return APIResponseObject.bookings;
};

export const getByUserIDAndDate = async (userID) => {
  const response = await fetch(API_URL + "/bookings/userAndDate/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const APIResponseObject = await response.json();
  return APIResponseObject.bookings;
};

export const create = async (booking, authenticationKey) => {
  const response = await fetch(API_URL + "/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify(booking),
  });

  const postCreateBookingResponse = await response.json();

  return postCreateBookingResponse;
};

export const update = async (booking, authenticationKey) => {
  const response = await fetch(API_URL + "/bookings/" + booking.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify(booking),
  });

  const patchBookingResponse = await response.json();

  return patchBookingResponse.booking;
};

export const deleteByID = async (bookingID, authenticationKey) => {
  const response = await fetch(API_URL + "/bookings/" + bookingID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify({}),
  });

  const deleteBookingResponse = await response.json();

  return deleteBookingResponse;
};
