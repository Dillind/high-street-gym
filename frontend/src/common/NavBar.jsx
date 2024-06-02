import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header>
      <nav>
        <div className="flex justify-center mt-[80px]">
          <Link to={"/"}>
            <span className="text-4xl font-bebasNeue text-primary">
              High Street Gym
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
