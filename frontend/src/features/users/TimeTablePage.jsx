import { useNavigate } from "react-router-dom";
import BottomNav from "../../common/BottomNav";
import MemberNavBar from "../../common/MemberNavBar";
import * as Classes from "../../api/classes.js";
import { useEffect, useState } from "react";

const TimeTablePage = () => {
  const [gymClasses, setGymClasses] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFutureGymClasses = async () => {
      try {
        const response = await Classes.getAllFutureGymClassDetails();
        setGymClasses(response.gymClasses);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchFutureGymClasses();
  }, []);

  // Function to convert class_datetime to day of the week and date format
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

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toISOString().split("T")[0];
  };

  // Sort the classes by their date to get Monday to Friday ordering
  const sortedGymClasses = gymClasses.sort((a, b) => {
    return new Date(a.class_datetime) - new Date(b.class_datetime);
  });

  // Group gym classes by day of the week
  const groupedGymClasses = sortedGymClasses.reduce((acc, gymClass) => {
    const dayOfWeek = convertToDate(gymClass.class_datetime);
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = [];
    }
    acc[dayOfWeek].push(gymClass);
    return acc;
  }, {});

  const handleGymClassBooking = (activityID, classDateTime) => {
    navigate(
      `/create-booking?activityID=${activityID}&classDateTime=${formatDate(
        classDateTime
      )}`
    );
  };

  const handleClick = (newIndex) => {
    if (expandedIndex === newIndex) {
      setExpandedIndex(-1);
    } else {
      setExpandedIndex(newIndex);
    }
  };

  return (
    <main className="max-container">
      <MemberNavBar />
      <h1
        className="text-[33px] font-palanquin font-semibold text-center uppercase tracking-normal 
      my-2"
      >
        Timetable
      </h1>
      <div className="text-center p-2">
        <span className="my-2 text-center tracking-normal font-montserrat">
          We have classes available from Monday to Friday for all our members.
        </span>
      </div>
      <section className="mb-10 max-h-[600px] overflow-auto p-3">
        {gymClasses && gymClasses.length > 0 ? (
          Object.entries(groupedGymClasses).map(
            ([dayOfWeek, gymClasses], index) => (
              <div
                key={dayOfWeek}
                className={`mb-3 border-2 collapse collapse-arrow border-black ${
                  expandedIndex === index ? "collapse-open" : "collapse-close"
                }`}
                onClick={() => handleClick(index)}
              >
                <input
                  type="radio"
                  name="my-accordion-2"
                  className="cursor-pointer"
                />
                <div className="text-xl font-medium collapse-title font-palanquin">
                  {dayOfWeek}
                </div>
                <div className="collapse-content">
                  {gymClasses
                    .reduce((uniqueClasses, gymClass) => {
                      if (
                        !uniqueClasses.some(
                          (uniqueClass) =>
                            uniqueClass.activity_name === gymClass.activity_name
                        )
                      ) {
                        uniqueClasses.push(gymClass);
                      }
                      return uniqueClasses;
                    }, [])
                    .map((gymClass) => (
                      <div
                        key={gymClass.class_id}
                        className="flex items-center justify-between mb-3"
                      >
                        <p className="font-montserrat">
                          {gymClass.activity_name}
                        </p>
                        <button
                          className="btn font-montserrat btn-primary"
                          onClick={() =>
                            handleGymClassBooking(
                              gymClass.activity_id,
                              gymClass.class_datetime
                            )
                          }
                        >
                          Book
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )
          )
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow mt-5">
            <h3 className="my-2 text-lg font-semibold tracking-normal text-center uppercase font-montserrat">
              No classes are currently available.
            </h3>
            <div className="flex flex-col items-center justify-center gap-6">
              <span className="text-center text-md font-montserrat">
                Please check back again soon.
              </span>
            </div>
          </div>
        )}
      </section>
      <BottomNav />
    </main>
  );
};

export default TimeTablePage;
