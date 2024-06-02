import { Link } from "react-router-dom";
import BottomNav from "../../common/BottomNav";
import MemberNavBar from "../../common/MemberNavBar";
import * as Bookings from "../../api/bookings.js";
import { useEffect, useState } from "react";
import { useAuthentication } from "../authentication.jsx";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthentication();
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (user) {
          const response = await Bookings.getByUserIDAndDate(user.id);
          if (response && response.length > 0) {
            setBookings(response);
            setLoading(false);
          } else {
            setBookings([]);
            setLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (!user) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  const convertToDate = (classDateTime) => {
    const date = new Date(classDateTime);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "Australia/Brisbane",
    };
    const dayOfTheWeek = date
      .toLocaleDateString("en-AU", options)
      .replace(/,/g, " - ");

    return dayOfTheWeek;
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const meridiem = hours >= 12 ? "pm" : "am";
    hours %= 12;
    hours = hours || 12; // Handle midnight (0 hours)
    const formattedTime = `${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }${meridiem}`;
    return formattedTime;
  };

  const handleCloseModal = (bookingID) => {
    const modalID = `modal-delete-booking-${bookingID}`;
    const modal = document.getElementById(modalID);
    if (modal) {
      modal.close();
    }
  };

  const handleDeleteBooking = async (bookingID) => {
    try {
      const result = await Bookings.deleteByID(bookingID);
      if (result) {
        setStatusMessage(result.message);
        const updatedBookings = await Bookings.getByUserIDAndDate(user.id);
        setBookings(updatedBookings);
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="max-container">
      <MemberNavBar />
      <h1
        className="text-[33px] font-palanquin font-semibold text-center uppercase tracking-normal 
        my-3"
      >
        Your Bookings
      </h1>
      {user.role == "trainer" ? (
        <div className="flex mb-3 justify-evenly">
          <Link
            to={"/bookings"}
            className="underline underline-offset-2 font-montserrat"
          >
            Your Bookings
          </Link>
          <Link
            to={"/classes"}
            className="underline underline-offset-2 font-montserrat"
          >
            Your Classes
          </Link>
        </div>
      ) : (
        <></>
      )}
      <section className="pb-5 max-h-[75vh] overflow-auto">
        {loading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          <div>
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <article
                  className="p-4 mb-5 border-2 border-black rounded-md mx-3"
                  key={booking.booking_id}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold font-palanquin">
                      Booking Details:
                    </h4>
                    <button
                      className="btn font-montserrat btn-secondary"
                      onClick={() =>
                        document
                          .getElementById(
                            `modal-delete-booking-${booking.booking_id}`
                          )
                          .showModal()
                      }
                    >
                      Cancel
                    </button>
                    <dialog
                      id={`modal-delete-booking-${booking.booking_id}`}
                      className="modal"
                    >
                      <div className="modal-box">
                        <h3 className="text-lg font-medium text-center font-palanquin">
                          Are you sure you want to delete the booking?
                        </h3>
                        <div className="mt-5">
                          <div className="flex items-center justify-center gap-3 ">
                            <button
                              className="px-8 btn btn-secondary btn-md font-montserrat"
                              type="button"
                              onClick={() =>
                                handleCloseModal(booking.booking_id)
                              }
                            >
                              No
                            </button>
                            <button
                              className="btn btn-primary btn-md font-montserrat px-7"
                              type="submit"
                              onClick={() =>
                                handleDeleteBooking(booking.booking_id)
                              }
                            >
                              Yes
                            </button>
                          </div>
                        </div>
                      </div>
                    </dialog>
                  </div>
                  <div className="flex flex-col gap-2 text-md">
                    <p className="font-montserrat">
                      <span className="font-medium">Class: </span>
                      {booking.activity_name}
                    </p>
                    <p className="font-montserrat">
                      <span className="font-medium">Trainer: </span>
                      {booking.user_first_name}
                    </p>
                    <p className="font-montserrat">
                      <span className="font-medium">Location: </span>
                      {booking.location_name}
                    </p>
                    <p className="font-montserrat">
                      {`Duration: ${booking.activity_duration} ${
                        booking.activity_duration == 1 ? "hour" : "hours"
                      }`}
                    </p>
                    <p className="font-montserrat">
                      <span className="font-medium">Date: </span>
                      {convertToDate(booking.class_datetime)}
                    </p>
                    <p className="font-montserrat">
                      <span className="font-medium">Time: </span>
                      {formatTime(booking.class_datetime)}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center flex-grow">
                <span className="mt-5 text-lg font-montserrat">
                  No bookings found.
                </span>
                <div className="flex gap-2 mt-5">
                  <button
                    className="px-10 btn btn-secondary font-montserrat"
                    onClick={() => window.history.back()}
                  >
                    Back
                  </button>
                  <Link
                    to={"/timetable"}
                    className="btn btn-primary font-montserrat"
                  >
                    <span>Create Booking</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
      <BottomNav />
    </main>
  );
};

export default BookingsPage;
