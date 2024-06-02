import BottomNav from "../../common/BottomNav";
import MemberNavBar from "../../common/MemberNavBar";
import { useAuthentication } from "../../features/authentication";
import { useEffect, useState } from "react";
import * as Users from "../../api/users.js";

const UserProfilePage = () => {
  const [user, login, logout, refresh] = useAuthentication();
  const [userData, setUserData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
    authentication_key: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  // Checks for a user every time the page renders, sets the userData to those values
  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        password: user.password,
        role: user.role,
        authentication_key: user.authentication_key,
      });
    }
  }, [user]);

  // If the userData is null, return a loading state.
  if (!userData) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  const onProfileSave = async (e) => {
    e.preventDefault();

    setStatusMessage("Saving Profile...");

    // First Name Validation
    if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(userData.first_name)) {
      setStatusMessage(
        "Invalid first name. All names must start with a capital letter."
      );
      return;
    }

    // Last Name Validation
    if (!/^[A-Z]{1}[A-Za-z \-']+$/.test(userData.last_name)) {
      setStatusMessage(
        "Invalid last name. All names must start with a capital letter. "
      );
      return;
    }

    // Phone Validation
    if (
      !/(^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$)/.test(
        userData.phone
      )
    ) {
      setStatusMessage(
        "Invalid phone number. Please enter a valid Australian phone number."
      );
      return;
    }

    // Email Address Validation
    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/.test(userData.email)) {
      setStatusMessage("Invalid email address");
      return;
    }

    // TODO: Password Validation
    // if (
    //   !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(
    //     userData.password
    //   )
    // ) {
    //   setStatusMessage(
    //     "Password must be at least 6 characters long and contain a variety of characters."
    //   );
    //   return;
    // }

    try {
      const result = await Users.update(userData);
      setStatusMessage(result.message);
      console.log(result);
      if (userData.id === user.id) {
        await refresh();
      }
      return result;
    } catch (error) {
      setStatusMessage(`Profile save failed: ${error}`);
    }
  };

  return (
    <main className="max-container">
      <MemberNavBar />
      <h1 className="text-[33px] font-palanquin font-semibold text-center uppercase tracking-normal">
        My Account
      </h1>
      <section className="w-full p-4">
        <form onSubmit={onProfileSave}>
          {/* The hidden input fields pass the data through without it needing to be displayed */}
          <input type="hidden" name="id" value={userData.id} />
          <input type="hidden" name="role" value={userData.role} />
          <input
            type="hidden"
            name="authentication_key"
            value={userData.authentication_key}
          />
          <div className="form-control my-2">
            {/* First Name */}
            <label htmlFor="first-name" className="label font-montserrat">
              <span>First Name</span>
            </label>
            <input
              type="text"
              name="first_name"
              id="first-name"
              placeholder="First Name"
              className="w-full input input-bordered font-montserrat"
              value={userData.first_name}
              onChange={(e) =>
                setUserData({ ...userData, first_name: e.target.value })
              }
            />
          </div>
          <div className="form-control my-2">
            {/* Last Name */}
            <label htmlFor="last-name" className="label font-montserrat">
              <span>Last Name</span>
            </label>
            <input
              type="text"
              name="last_name"
              id="last-name"
              placeholder="Last Name"
              className="w-full input input-bordered font-montserrat"
              value={userData.last_name}
              onChange={(e) =>
                setUserData({ ...userData, last_name: e.target.value })
              }
            />
          </div>
          <div className="form-control my-2">
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
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
            />
          </div>
          <div className="form-control my-2">
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
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
          </div>
          <div className="form-control my-2">
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
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </div>
          <span className="text-xs label-text-alt font-montserrat">
            {statusMessage}
          </span>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              className="px-10 btn btn-secondary font-montserrat"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-10 btn btn-primary font-montserrat"
            >
              Save
            </button>
          </div>
        </form>
      </section>
      <BottomNav />
    </main>
  );
};

export default UserProfilePage;
