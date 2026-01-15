import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "lucide-react";

import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { getUsers, setSelectedUser } from "../store/slices/chatSlice";

const Sidebar = () => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const { users = [], selectedUser, isUserLoading } = useSelector(
    (state) => state.chat
  );

  const { onlineUsers = [] } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);


const cleanOnlineUsers = useMemo(() => {
  return onlineUsers
    .map((u) => {
      if (typeof u === "object" && u !== null) {
        return u._id || u.userId || null;
      }
      if (typeof u === "string") {
        if (u === "[object Object]") return null;
        return u;
      }
      return null;
    })
    .filter(Boolean);
}, [onlineUsers]);

const isUserOnline = (userId) =>
  cleanOnlineUsers.includes(String(userId));

const filteredUsers = showOnlineOnly
  ? users.filter((user) => isUserOnline(user._id))
  : users;


  if (isUserLoading) return <SidebarSkeleton />;

  /** testting */
  // console.log("users:", users);
  // console.log("onlineUsers (raw):", onlineUsers);
  // console.log("onlineUsers (clean):", cleanOnlineUsers);

  return (
    <aside className="h-full w-64 border-r border-gray-200 flex flex-col bg-white">

      {/* ================= HEADER ================= */}
      <div className="border-b border-gray-200 w-full p-5">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-gray-700" />
          <span className="font-medium text-gray-800">
            Contacts
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="w-4 h-4 border-gray-700 text-blue-600 focus:ring-blue-500"
            />
            Show Only Online
          </label>
          <span className="text-xs text-gray-500">
            ({cleanOnlineUsers.length} online)
          </span>
        </div>
      </div>

      {/* ================= USER LIST ================= */}
    {/* {  console.log("ALL USERS:", users)}
{console.log("ONLINE USERS:", onlineUsers)} */}
      <div className="flex-1 overflow-y-auto w-full py-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => dispatch(setSelectedUser(user))}
              className={`w-full p-3 flex items-center gap-3 rounded-md transition-colors ${
                selectedUser?._id === user._id
                  ? "bg-gray-200"
                  : "hover:bg-gray-200"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user?.avatar?.url || "/avatar-holder.avif"}
                  alt="avatar"
                  className="w-12 h-12 object-cover rounded-full"
                />

                {isUserOnline(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </div>

              {/* User Info */}
              <div className="text-left min-w-0">
                <div className="font-medium text-gray-800 truncate">
                  {user.fullName}
                </div>
                <div className="text-sm text-gray-500">
                  {isUserOnline(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No Online Users
          </div>
        )}
      </div>
    </aside>
    
  );
};

export default Sidebar;
