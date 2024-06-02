import { API_URL } from "./api";

export const getAll = async () => {
  const response = await fetch(API_URL + "/locations/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();
  return APIResponseObject.locations;
};
