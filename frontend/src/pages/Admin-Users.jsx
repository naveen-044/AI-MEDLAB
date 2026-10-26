import { BASE_URL } from "../config.js";
import useFetchData from "../hooks/useFetchData.jsx";
import defaultImg from "../assets/images/default.avif";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { MdOutlinePersonPin } from "react-icons/md";
import { PiGenderFemaleBold } from "react-icons/pi";
import { FaUser } from "react-icons/fa6";
import { MdMarkEmailUnread } from "react-icons/md";
import { Link } from "react-router-dom";
import Loading from "../components/Loader/Loading.jsx";
import Error from "../components/Error/Error.jsx";

const AdminUsers = () => {
  const {
    data: users,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/admin/users`);

  const userList = Array.isArray(users) ? users : [];

  return (
    <>
      {loading && <Loading />}
      {error && <Error />}
      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {userList.map((user, index) => (
            <div
              key={user._id || index}
              className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl"
            >
              <div className="flex justify-between mb-3">
                <BiEditAlt className="text-blue-500 cursor-pointer" />
                <button>
                  <Link to={`/delete/user/${user._id}`}>
                    <MdDelete className="cursor-pointer text-red-500" />
                  </Link>
                </button>
              </div>
              <div className="top-1 w-full">
                <img
                  className="w-full h-[250px] object-fill rounded-lg"
                  src={user.photo || `${defaultImg}`}
                  alt={user._id}
                />
              </div>
              <div className="flex justify-start items-center gap-x-2">
                <FaUser className="text-2xl" />
                <h2 className="my-1">{user.name}</h2>
              </div>
              <div className="flex justify-start items-center gap-x-2">
                <MdMarkEmailUnread className="text-2xl" />
                <h2 className="my-1">{user.email}</h2>
              </div>
              <div className="flex justify-start items-center gap-x-2">
                <MdOutlinePersonPin className="text-2xl" />
                <h2 className="my-1">Role: {user.role || "Unknown Author"}</h2>
              </div>
              <div className="flex justify-start items-center gap-x-2">
                <PiGenderFemaleBold className="text-2xl" />
                <h2 className="my-1">{user.gender}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminUsers;
