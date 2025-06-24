import { useSelector } from "react-redux";


const Profile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-slate-100 rounded-2xl shadow-xl p-8 relative">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden  shadow-md hover:scale-105 transition-transform">
            <img
              src={user.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold mt-4">{user.username}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        <form className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              defaultValue={user.username}
              className="w-full mt-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              defaultValue={user.email}
              className="w-full mt-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold uppercase hover:opacity-75 transition">
            Update Profile
          </button>
        </form>

        <div className="flex justify-between mt-6 text-sm">
          <span className="text-red-500 hover:underline cursor-pointer">
            Delete Account
          </span>
          <span className="text-blue-500 hover:underline cursor-pointer">
            Sign Out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
