import { Link } from "react-router-dom";
import { FaCheckDouble } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 md:px-12">
      <Link to="/login" className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-md">
          PN
        </div>

        <div>
          <h1 className="text-lg font-bold text-gray-900">PN-Todo-List</h1>
          <p className="text-xs text-gray-500">Plan your day</p>
        </div>
      </Link>

      <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
        <FaCheckDouble className="text-blue-600" />
        Stay productive
      </div>
    </nav>
  );
}

export default Navbar;
