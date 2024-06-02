import { useEffect, useState } from "react";
import BottomNav from "../../common/BottomNav";
import MemberNavBar from "../../common/MemberNavBar";
import { useAuthentication } from "../authentication";
import * as Classes from "../../api/classes.js";
import * as Bookings from "../../api/bookings.js";
import { useLocation } from "react-router-dom";

const CreateBookingPage = () => {
  const [gymClasses, setGymClasses] = useState([]);
  const [user] = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activityID = searchParams.get("activityID");
  const classDateTime = searchParams.get("classDateTime");

  // Load classes
  useEffect(() => {
    Classes.getAllFutureGymClassDetails().then((classes) => {
      const filteredGymClasses = classes.gymClasses.filter(
        (gymClass) =>
          gymClass.activity_id == activityID &&
          formatDate(gymClass.class_datetime) == classDateTime
      );
      setGymClasses(filteredGymClasses);
      setLoading(false);
    });
  }, [activityID]);

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toISOString().split("T")[0];
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

  const convertToDate = (classDateTime) => {
    const date = new Date(classDateTime);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "Australia/Brisbane",
    };
    const dayAndDate = date
      .toLocaleDateString("en-AU", options)
      .replace(/,/g, " - ");
    return dayAndDate;
  };

  const handleCreateBooking = async (classID) => {
    setStatusMessage("Creating booking...");

    if (user) {
      try {
        // Retrieve all the user's bookings by their ID
        const userBookings = await Bookings.getByUserID(user.id);
        // Check if they already have booked the class by matching up the class IDs
        const isAlreadyBooked = userBookings.some(
          (booking) => booking.class_id == classID
        );
        // If the same booking is found, alert the user that they have already booked that class
        if (isAlreadyBooked) {
          setStatusMessage("You have already booked this class.");
        } else {
          const userID = user.id;
          const bookingData = {
            user_id: userID,
            class_id: classID,
          };
          const result = await Bookings.create(bookingData);
          setStatusMessage(result.message);
        }
      } catch (error) {
        console.log(error);
        setStatusMessage(`Failed to create booking: ${error}`);
      }
    }
  };

  return (
    <main className="max-container">
      <MemberNavBar />
      <h1
        className="text-[33px] font-palanquin font-semibold text-center uppercase tracking-normal 
      my-2"
      >
        Create Booking
      </h1>
      {gymClasses && gymClasses.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-2xl font-bold font-montserrat">
            {gymClasses[0].activity_name}
          </span>
          <span className="font-montserrat">
            {convertToDate(gymClasses[0].class_datetime)}
          </span>
        </div>
      )}

      {loading ? (
        <span className="loading loading-spinner loading-md"></span>
      ) : (
        <>
          <div className="text-center my-2">
            <span className="my-3 tracking-normal font-montserrat">
              Please create a booking from the available classes below.
            </span>
          </div>
          <section className="flex flex-col overflow-auto max-h-[70vh] pb-5 mx-3">
            {gymClasses && gymClasses.length > 0 ? (
              gymClasses.map((gymClass) => (
                <article
                  key={gymClass.class_id}
                  className="p-2 mb-4 border border-black rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold font-palanquin">
                      {gymClass.activity_name}
                    </h2>
                    <button
                      type="button"
                      className="btn font-montserrat btn-primary"
                      onClick={() => handleCreateBooking(gymClass.class_id)}
                    >
                      Book
                    </button>
                  </div>
                  <p className="font-montserrat">
                    Trainer: {gymClass.user_first_name}
                  </p>
                  <p className="font-montserrat">
                    Location: {gymClass.location_name}
                  </p>
                  <p className="font-montserrat">
                    {`Duration: ${gymClass.activity_duration} ${
                      gymClass.activity_duration == 1 ? "hour" : "hours"
                    }`}
                  </p>
                  <p className="font-montserrat">
                    Time: {formatTime(gymClass.class_datetime)}
                  </p>
                </article>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="font-montserrat">No classes found.</span>
                <div className="flex gap-2 mt-5">
                  <button
                    className="px-10 btn btn-secondary font-montserrat"
                    onClick={() => window.history.back()}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
            <span className="text-xs label-text-alt font-montserrat">
              {statusMessage}
            </span>
            <div className="flex justify-center gap-2 mt-5">
              <button
                className="px-10 btn btn-secondary font-montserrat"
                onClick={() => window.history.back()}
              >
                Back
              </button>
            </div>
          </section>
        </>
      )}
      <BottomNav />
    </main>
  );
};

export default CreateBookingPage;
