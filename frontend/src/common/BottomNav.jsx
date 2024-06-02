import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  timetableOutline,
  timetableSolid,
  userOutline,
  userSolid,
  blogOutline,
  blogSolid,
  bookingOutline,
  bookingSolid,
  uploadOutline,
  uploadSolid,
} from "../assets/icons";
import { useAuthentication } from "../features/authentication";

const BottomNav = () => {
  const [activePage, setActivePage] = useState("");
  const location = useLocation();
  const [user] = useAuthentication();

  useEffect(() => {
    const pathname = location.pathname.substring(1);
    setActivePage(pathname);
  }, [location]);

  return (
    <>
      <div className="btm-nav border-t-[1px] border-black absolute bottom-0 w-full">
        {/* Timetable Page */}
        <Link to={"/timetable"}>
          <span className="flex flex-col items-center justify-center">
            <img
              src={`${
                activePage === "timetable" ? timetableSolid : timetableOutline
              }`}
              alt="timetable icon"
            />
            <span className="text-[10px] font-montserrat text-gray-500">
              Timetable
            </span>
          </span>
        </Link>
        {/* Bookings Page */}
        <Link to={"/bookings"}>
          <span className="flex flex-col items-center justify-center">
            <img
              src={`${
                activePage === "bookings" ? bookingSolid : bookingOutline
              }`}
              alt="timetable icon"
            />
            <span className="text-[10px] font-montserrat text-gray-500">
              Bookings
            </span>
          </span>
        </Link>
        {/* User Profile Page */}
        <Link to={"/user-profile"}>
          <span className="flex flex-col items-center justify-center">
            <img
              src={`${activePage === "user-profile" ? userSolid : userOutline}`}
              alt="user profile icon"
            />
            <span className="text-[10px] font-montserrat text-gray-500">
              Profile
            </span>
          </span>
        </Link>
        {/* Blogs Page */}
        <Link to={"/blogs"}>
          <span className="flex flex-col items-center justify-center">
            <img
              src={`${activePage === "blogs" ? blogSolid : blogOutline}`}
              alt="blog icon"
            />
            <span className="text-[10px] font-montserrat text-gray-500">
              Blogs
            </span>
          </span>
        </Link>
        {/* XML Upload Page */}
        {user && (user.role === "admin" || user.role === "trainer") && (
          <Link to={"/xml-upload"}>
            <span className="flex flex-col items-center justify-center">
              <img
                src={`${
                  activePage === "xml-upload" ? uploadSolid : uploadOutline
                }`}
                alt="upload icon"
              />
              <span className="text-[10px] font-montserrat text-gray-500">
                XML Upload
              </span>
            </span>
          </Link>
        )}
      </div>
    </>
  );
};

export default BottomNav;
