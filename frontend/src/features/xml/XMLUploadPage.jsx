import { useRef, useState } from "react";
import BottomNav from "../../common/BottomNav";
import MemberNavBar from "../../common/MemberNavBar";
import { API_URL } from "../../api/api";
import { useAuthentication } from "../authentication";
import { fileUpload } from "../../assets/icons";
import CheckDetails from "../../common/CheckDetails";

const XMLUploadPage = ({ onUploadSuccess, disabled = false }) => {
  const [user] = useAuthentication();
  const [statusMessage, setStatusMessage] = useState("");
  const [importType, setImportType] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");

  // useRef in this context is the react way of getting an element reference, kind of like:
  // document.getElementById
  const uploadInputRef = useRef(null);

  if (!user) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  const handleImportType = (e) => {
    setImportType(e.target.value);

    if (user.role === "admin") {
      // Admin can access everything
      if (e.target.value === "member-upload") {
        setUploadUrl("/users/xml-upload");
      } else if (e.target.value === "timetable-upload") {
        setUploadUrl("/classes/xml-upload");
      } else {
        // Invalid import type for admin
        setImportType("");
        setUploadUrl("");
        setStatusMessage(
          "You do not have the appropriate permissions to access this resource."
        );
      }
    } else if (user.role === "trainer") {
      // Trainers can only access timetable-upload
      if (e.target.value === "timetable-upload") {
        setUploadUrl("/classes/xml-upload");
      } else {
        // Invalid import type for trainers
        setImportType("");
        setUploadUrl("");
        setStatusMessage(
          "You do not have the appropriate permissions to access this resource."
        );
      }
    } else {
      // Members have no access
      setImportType("");
      setUploadUrl("");
      setStatusMessage(
        "You do not have the appropriate permissions to access this resource."
      );
    }
  };

  const uploadFile = (e) => {
    e.preventDefault();

    // The files is an array because the user could select multiple files.
    // We choose to upload only the first selected file in this case.
    const file = uploadInputRef.current.files[0];

    // Fetch expects multi-part form data to be provided inside the formData object
    const formData = new FormData();
    formData.append("xml-file", file);

    fetch(API_URL + uploadUrl, {
      method: "POST",
      headers: {
        "X-AUTH-KEY": user.authentication_key,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((APIResponse) => {
        setStatusMessage(APIResponse.message);
        // clear the selected file
        uploadInputRef.current.value = null;
        if (typeof onUploadSuccess === "function") {
          onUploadSuccess();
        }
      })
      .catch((error) => {
        console.log(error);
        setStatusMessage(`Upload failed. Please try again.`);
      });
  };

  return (
    <main className="max-container">
      <MemberNavBar />
      <h1
        className="text-[33px] font-palanquin font-semibold text-center uppercase tracking-normal 
      my-2"
      >
        XML Upload
      </h1>
      <section className="flex flex-col">
        <img src={fileUpload} alt="file upload" className="mb-10" />
        <form className="flex-grow m-4" onSubmit={uploadFile}>
          <div className="form-control">
            <div className="flex flex-col gap-3">
              <select
                name="import-type"
                value={importType}
                onChange={handleImportType}
                className="w-full select select-bordered select-ghost border-black border-2 
                font-montserrat"
              >
                <option value="" disabled>
                  Select Import Type
                </option>
                <option value="member-upload">Member Upload</option>
                <option value="timetable-upload">Timetable Upload</option>
              </select>
              <input
                type="file"
                id="file-input"
                ref={uploadInputRef}
                disabled={disabled}
                className="file-input border-black border-2 font-montserrat"
              />
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  className="px-10 btn btn-secondary font-montserrat"
                  onClick={() => window.history.back()}
                  type="button"
                >
                  Back
                </button>
                <button
                  disabled={disabled}
                  type="submit"
                  className="px-10 btn btn-primary font-montserrat"
                >
                  Upload
                </button>
              </div>
            </div>
            <span className="mt-5 text-sm font-medium text-center font-montserrat">
              {statusMessage}
            </span>
          </div>
        </form>
      </section>
      <section>
        <h2 className="mb-3 font-bold text-center font-montserrat">
          Check Details
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <CheckDetails name={"Activities"} endpoint={"/activities"} />
          <CheckDetails name={"Locations"} endpoint={"/locations"} />
          <CheckDetails name={"Users"} endpoint={"/users"} />
        </div>
      </section>
      <BottomNav />
    </main>
  );
};

export default XMLUploadPage;
