import React, { useEffect, useState } from "react";
import * as Activities from "../api/activities.js";
import * as Users from "../api/users.js";
import * as Locations from "../api/locations.js";

const CheckDetails = ({ name, endpoint }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const modalId = `modal-${endpoint}`;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;
        if (endpoint === "/activities") {
          response = await Activities.getAll();
        } else if (endpoint === "/users") {
          response = await Users.getAllUsers();
        } else if (endpoint === "/locations") {
          response = await Locations.getAll();
        }
        setData(response);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  const handleCloseModal = () => {
    document.getElementById(modalId).close();
  };

  return (
    <div>
      <button
        className="mb-2 btn btn-secondary font-montserrat"
        onClick={() => document.getElementById(modalId).showModal()}
      >
        {name}
      </button>
      <dialog id={modalId} className="modal max-modal">
        <div className="modal-box">
          <h2 className="mb-2 text-2xl font-bold text-center font-palanquin">
            {name}
          </h2>
          <div>
            <button
              className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
              onClick={handleCloseModal}
            >
              ✕
            </button>
          </div>
          {isLoading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            <table className="mx-auto table-auto">
              <thead>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Name</th>
                  {endpoint === "/users" && <th>Role</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="px-4 py-2 border">{item.id}</td>
                    <td className="px-4 py-2 border">
                      {endpoint === "/users"
                        ? `${item.first_name} ${item.last_name}`
                        : item.name}
                    </td>
                    {endpoint === "/users" && (
                      <td className="px-4 py-2 border">{item.role}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default CheckDetails;
