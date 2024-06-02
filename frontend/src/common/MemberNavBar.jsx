import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "../features/authentication";
import { useState, useEffect } from "react";
import { logoutIcon } from "../assets/icons";

const MemberNavBar = () => {
  const [user, login, logout] = useAuthentication();
  const navigate = useNavigate();

  // Retrieves the first letter of the user's first name.
  const formatFirstName = (userFirstName) => {
    return userFirstName.substring(0, 1).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-10 w-full">
      <nav className="flex items-center justify-between px-2 py-2">
        <div>
          {user ? (
            <Link to={"/user-profile"}>
              <div className="flex flex-col items-center justify-center text-sm cursor-pointer">
                <div className="avatar placeholder">
                  <div className="w-12 rounded-full bg-neutral text-neutral-content">
                    <span className="text-2xl">
                      {formatFirstName(user.first_name)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <span className="loading loading-spinner loading-md"></span>
          )}
        </div>
        <div className="flex items-center justify-center">
          <Link to={"/timetable"}>
            <span className="font-bebasNeue font-normal text-md text-2xl text-primary">
              High Street Gym
            </span>
          </Link>
        </div>
        <button onClick={() => logout().finally(() => navigate("/"))}>
          <span className="flex flex-col items-center justify-center">
            <img src={logoutIcon} alt="logout icon" />
            <span className="text-[10px] font-montserrat text-gray-500">
              Logout
            </span>
          </span>
        </button>
      </nav>
    </header>
  );
};

export default MemberNavBar;
