import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../features/authentication";
import MemberNavBar from "./MemberNavBar";
import BottomNav from "./BottomNav";

export function RestrictedRoute({ allowedRoles = [], children }) {
  const [user, login, logout] = useAuthentication();
  const navigate = useNavigate();

  const userIsAuthorised = user && allowedRoles.includes(user.role);

  return userIsAuthorised ? (
    children
  ) : (
    <main className="relative flex flex-col h-screen p-3 max-container">
      <MemberNavBar />
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-[33px] font-palanquin font-semibold text-center uppercase tracking-normal my-2">
          Not Authorised
        </h1>
        <div className="flex flex-col items-center justify-center gap-6">
          <span className="text-xl text-center font-montserrat">
            You are not permitted to view this page.
          </span>
          <button className="btn btn-md" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
