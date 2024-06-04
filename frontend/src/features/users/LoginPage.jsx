import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../common/NavBar";
import { useAuthentication } from "../authentication";
import { useState } from "react";
import Footer from "../../common/Footer";

const LoginPage = () => {
  const [user, login] = useAuthentication();
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const onLoginSubmit = (e) => {
    e.preventDefault();
    setStatusMessage("Logging in...");

    if (!/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(formData.email)) {
      setStatusMessage("Invalid email address.");
      return;
    }

    // TODO: Remove this, currently done on purpose for abc123 password.
    // if (!/[a-zA-Z0-9-]{6,}/.test(formData.password)) {
    //   setStatusMessage(
    //     "Password must be at least 6 characters long and contain a variety of characters."
    //   );
    //   return;
    // }

    login(formData.email, formData.password)
      .then((result) => {
        setStatusMessage("Login successful!");
        navigate("/timetable");
      })
      .catch((error) => {
        setStatusMessage(`Login failed: ${error}`);
      });
  };

  return (
    <main className="max-container centered-container">
      <NavBar />
      <section className="w-full p-5 m-auto">
        <h1
          className="text-[33px] font-palanquin font-semibold text-center uppercase 
        tracking-normal mb-5"
        >
          Login
        </h1>
        <form method="post" className="space-y-4" onSubmit={onLoginSubmit}>
          <div>
            {/* Email Address */}
            <label htmlFor="email" className="label font-montserrat">
              <span className="text-base label-text">Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email address"
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
              placeholder="Enter your password"
              className="w-full input input-bordered font-montserrat"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className="my-2">
            <button className="mb-2 uppercase btn btn-primary btn-block font-montserrat">
              Login
            </button>
            <button
              className="mt-2 uppercase btn btn-secondary btn-block font-montserrat"
              onClick={(e) => {
                e.preventDefault();
                navigate("/registration");
              }}
            >
              Create an Account
            </button>
            <span className="label-text-alt">{statusMessage}</span>
          </div>
        </form>
      </section>
      <Footer />
    </main>
  );
};

export default LoginPage;
