import { Link } from "react-router-dom";
import BottomNav from "../../common/BottomNav";
import MemberNavBar from "../../common/MemberNavBar";
import * as Classes from "../../api/classes.js";
import { useEffect, useState } from "react";
import { useAuthentication } from "../authentication.jsx";

const ClassesPage = () => {
  const [gymClasses, setGymClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthentication();
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchGymClasses = async () => {
      try {
        if (user) {
          const response = await Classes.getByUserIDAndDate(user.id);
          if (response && response.length > 0) {
            setGymClasses(response);
            setLoading(false);
          } else {
            setGymClasses([]);
            setLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchGymClasses();
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

  const handleCloseModal = (gymClassID) => {
    const modalID = `modal-delete-class-${gymClassID}`;
    const modal = document.getElementById(modalID);
    if (modal) {
      modal.close();
    }
  };

  const handleDeleteGymClass = async (gymClassID) => {
    try {
      const result = await Classes.deleteByID(gymClassID);
      if (result) {
        setStatusMessage(result.message);
        const updatedGymClass = await Classes.getByUserIDAndDate(user.id);
        setGymClasses(updatedGymClass);
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
        Your Classes
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
            {gymClasses && gymClasses.length > 0 ? (
              gymClasses.map((gymClass) => (
                <article
                  className="p-4 mb-5 border-2 border-black rounded-md"
                  key={gymClass.class_id}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold font-palanquin">
                        Class Details:
                      </h4>
                      <button
                        className="btn font-montserrat"
                        onClick={() =>
                          document
                            .getElementById(
                              `modal-delete-class-${gymClass.class_id}`
                            )
                            .showModal()
                        }
                      >
                        Cancel
                      </button>
                      <dialog
                        id={`modal-delete-class-${gymClass.class_id}`}
                        className="modal max-container"
                      >
                        <div className="modal-box">
                          <h3 className="text-lg font-medium text-center font-palanquin">
                            Are you sure you want to delete the gym class?
                          </h3>
                          <div className="mt-5">
                            <div className="flex items-center justify-center gap-3 ">
                              <button
                                className="px-8 btn btn-secondary btn-md font-montserrat"
                                type="button"
                                onClick={() =>
                                  handleCloseModal(gymClass.class_id)
                                }
                              >
                                No
                              </button>
                              <button
                                className="btn btn-primary btn-md font-montserrat px-7"
                                type="submit"
                                onClick={() =>
                                  handleDeleteGymClass(gymClass.class_id)
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
                        {gymClass.activity_name}
                      </p>
                      <p className="font-montserrat">
                        <span className="font-medium">Trainer: </span>
                        {gymClass.user_first_name}
                      </p>
                      <p className="font-montserrat">
                        <span className="font-medium">Location: </span>
                        {gymClass.location_name}
                      </p>
                      <p className="font-montserrat">
                        {`Duration: ${gymClass.activity_duration} ${
                          gymClass.activity_duration == 1 ? "hour" : "hours"
                        }`}
                      </p>
                      <p className="font-montserrat">
                        <span className="font-medium">Date: </span>
                        {convertToDate(gymClass.class_datetime)}
                      </p>
                      <p className="font-montserrat">
                        <span className="font-medium">Time: </span>
                        {formatTime(gymClass.class_datetime)}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-lg text-center font-montserrat">
                  No classes found.
                </span>
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
          </div>
        )}
      </section>
      <BottomNav />
    </main>
  );
};

export default ClassesPage;
