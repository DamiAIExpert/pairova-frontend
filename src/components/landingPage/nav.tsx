import { Link } from "react-router";

const Nav = () => {
  return (
    <div>
      <div className="flex py-5 items-center justify-between px-10">
        <div>
          <h2>Logo</h2>
        </div>

        <div className="md:flex items-center gap-5 hidden">
          <button>Candidate</button>
          <button>Job</button>
          <button>Non profit</button>
        </div>

        <div className="flex items-center gap-4">
          <Link to='/user'>
            <button>Login</button>
          </Link>
          <Link to='/user'>
            <button className="bg-[#101010] text-white rounded-lg py-2 px-8">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Nav;
