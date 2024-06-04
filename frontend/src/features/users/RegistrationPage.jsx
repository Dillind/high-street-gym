import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../authentication";
import * as Users from "../../api/users.js";
import Footer from "../../common/Footer.jsx";
import NavBar from "../../common/NavBar.jsx";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [user, login] = useAuthentication();
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
  });

  const onRegisterSubmit = async (e) => {
    e.preventDefault();

    setStatusMessage("Registering...");

    // First Name Validation
    if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(formData.first_name)) {
      setStatusMessage(
        "Invalid first name. All names must start with a capital letter."
      );
      return;
    }

    // Last Name Validation
    if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(formData.last_name)) {
      setStatusMessage(
        "Invalid last name. All names must start with a capital letter."
      );
      return;
    }

    // Phone Validation
    if (
      !/(^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$)/.test(
        formData.phone
      )
    ) {
      setStatusMessage(
        "Invalid phone number. Please enter a valid Australian phone number."
      );
      return;
    }

    // Email Address Validation
    if (!/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(formData.email)) {
      setStatusMessage("Invalid email address.");
      return;
    }

    // Password Validation
    if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(
        formData.password
      )
    ) {
      setStatusMessage(
        `Password must be at least 6 characters long and contain at least one digit, one lowercase 
        letter (a-z), and one uppercase letter.`
      );
      return;
    }

    Users.registerUser(formData)
      .then((result) => {
        setStatusMessage(result.message);
        if (result.status == 200) {
          login(formData.email, formData.password).then((result) => {
            setStatusMessage(result.message);
            navigate("/timetable");
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setStatusMessage(`Registration failed. Please try again.`);
      });
  };

  return (
    <main className="max-container centered-container">
      <NavBar />
      <section className="w-full p-3">
        <h1 className="text-[33px] font-palanquin font-semibold text-center uppercase mb-2">
          Registration
        </h1>
        <form className="space-y-2" onSubmit={onRegisterSubmit}>
          <div>
            {/* First Name */}
            <label htmlFor="first-name" className="label font-montserrat">
              <span>First Name</span>
            </label>
            <input
              type="text"
              name="first-name"
              id="first-name"
              placeholder="First Name"
              className="w-full input input-bordered font-montserrat"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
            />
          </div>
          <div>
            {/* Last Name */}
            <label htmlFor="last_name" className="label font-montserrat">
              <span>Last Name</span>
            </label>
            <input
              type="text"
              name="last-name"
              id="last-name"
              placeholder="Last Name"
              className="w-full input input-bordered font-montserrat"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
            />
          </div>
          <div>
            {/* Phone Number */}
            <label htmlFor="phone" className="label font-montserrat">
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Phone Number"
              maxLength="10"
              className="w-full input input-bordered font-montserrat"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div>
            {/* Email Address */}
            <label htmlFor="email" className="label font-montserrat">
              <span className="text-base label-text">Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              className="w-full input input-bordered font-montserrat"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            {/* Password */}
            <label htmlFor="password" className="label font-montserrat">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="w-full input input-bordered font-montserrat"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div>
            <button className="uppercase btn btn-primary btn-block font-montserrat">
              Register
            </button>
            <span className="text-xs label-text-alt font-montserrat">
              {statusMessage}
            </span>
          </div>
          <div className="text-center">
            <span className="text-sm font-montserrat">
              Already have an account?
            </span>
            <span
              className="ml-2 text-sm cursor-pointer hover:underline font-montserrat text-primary"
              onClick={() => navigate("/")}
            >
              Sign in
            </span>
          </div>
        </form>
      </section>
      <Footer />
    </main>
  );
};

export default RegistrationPage;
