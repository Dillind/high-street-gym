import { createBrowserRouter } from "react-router-dom";
import { RestrictedRoute } from "./common/RestrictedRoutes";
import LoginPage from "./features/users/LoginPage";
import RegistrationPage from "./features/users/RegistrationPage";
import TimeTablePage from "./features/users/TimeTablePage";
import CreateBookingPage from "./features/bookings/CreateBookingPage";
import BlogPage from "./features/blogs/BlogPage";
import XMLUploadPage from "./features/xml/XMLUploadPage";
import BookingsPage from "./features/bookings/BookingsPage";
import UserProfilePage from "./features/users/UserProfilePage";
import ClassesPage from "./features/bookings/ClassesPage";

const router = createBrowserRouter([
  // Login Page
  {
    path: "/",
    element: <LoginPage />,
  },
  // Registration Page Page
  {
    path: "/registration",
    element: <RegistrationPage />,
  },
  // Timetable Page
  {
    path: "/timetable",
    element: <TimeTablePage />,
  },
  // Create Booking Page
  {
    path: "/create-booking",
    element: <CreateBookingPage />,
  },
  // Blog Page
  {
    path: "/blogs",
    element: <BlogPage />,
  },
  // XML Upload Page
  {
    path: "/xml-upload",
    element: (
      <RestrictedRoute allowedRoles={["admin", "trainer"]}>
        <XMLUploadPage />
      </RestrictedRoute>
    ),
  },
  // View Bookings Page
  {
    path: "/bookings",
    element: <BookingsPage />,
  },

  {
    path: "/classes",
    element: (
      <RestrictedRoute allowedRoles={["trainer"]}>
        <ClassesPage />
      </RestrictedRoute>
    ),
  },
  // User Profile Page
  {
    path: "/user-profile",
    element: <UserProfilePage />,
  },
]);

export default router;
