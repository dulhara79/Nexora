import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { 
  User, 
  Mail, 
  Camera, 
  MessageCircle, 
  Share2, 
  Edit, 
  Instagram, 
  Twitter, 
  Linkedin 
} from "lucide-react";

function Profile() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { userId } = useParams();
  const [users, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, { withCredentials: true });
        console.log("User data:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchUser();
  }, [userId, isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Please log in to view this page.</div>;
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 1, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
          }}
          className="w-20 h-20 border-4 border-transparent rounded-full shadow-2xl border-t-blue-600 border-r-blue-500"
        />
      </div>
    );

  return (
    <div className="w-full min-h-screen py-8 overflow-x-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="max-w-full px-4 mx-auto sm:px-6 lg:px-8">
      <div className="flex justify-end mb-4">
          <button
            onClick={logout}
            className="px-4 py-2 text-white bg-red-600 rounded-full hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
        <div className={`grid grid-cols-2 gap-3 md:grid-cols-[1fr_1fr_380px]`}>
          {/* Profile Card */}
          <div className="overflow-hidden bg-white shadow-2xl md:col-span-2 rounded-2xl">
            {/* Banner with Blue Gradient */}
            <div
              className="relative w-full h-56"
              style={{
                background: users?.bannerUrl
                  ? `url(${users.bannerUrl}) center/cover no-repeat`
                  : "linear-gradient(135deg, #3b82f6, #1e40af, #2563eb, #3b82f6)",
                backgroundSize: 'cover'
              }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute flex space-x-2 top-4 right-4">
                <Link to={`/edit/${userId}`} className="p-2 transition-colors rounded-full bg-white/20 hover:bg-white/40"> 
                <button className="p-2 transition-colors rounded-full bg-white/20 hover:bg-white/40">
                  <Edit className="w-5 h-5 text-white" />
                </button>
                </Link>
                <button className="p-2 transition-colors rounded-full bg-white/20 hover:bg-white/40">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="relative px-6 pb-6">
              {/* Profile Picture */}
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={users?.profilePhotoUrl || "https://res.cloudinary.com/ddwgayqfm/image/upload/v1743163900/images/fb9d49a8-7174-4841-95d7-2fe82d1fcecc_def_img.jpg.jpg"}
                alt="Profile"
                className="absolute object-cover border-4 border-white rounded-full shadow-2xl w-36 h-36 -top-16 left-6"
              />

              {/* User Details */}
              <div className="pt-20">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{users?.name || "John Doe"}</h1>
                    <p className="font-medium text-blue-600">@{users?.username || "username"}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-full shadow-md hover:bg-blue-700">
                      Follow
                    </button>
                    <button className="p-3 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center mt-4 space-x-3 text-gray-500">
                  <a href="#" className="transition-colors hover:text-blue-600">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="#" className="transition-colors hover:text-blue-600">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="transition-colors hover:text-blue-600">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 mt-6 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-blue-600">{users?.posts?.length || 0}</span>
                    <span className="text-sm text-gray-600">Posts</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-blue-600">{users?.followers?.length || 0}</span>
                    <span className="text-sm text-gray-600">Followers</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-blue-600">{users?.following?.length || 0}</span>
                    <span className="text-sm text-gray-600">Following</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800">About</h3>
                  <p className="mt-2 text-gray-600">{users?.about || "No bio available"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden space-y-6 w-sm md:block">
            {/* Recent Activity */}
            <div className="p-6 bg-white shadow-xl rounded-2xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Recent Activity</h3>
              <div className="space-y-3">
                {['Liked a post', 'Commented on photo', 'Started following you'].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-white shadow-xl w-sm rounded-2xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-4">
                <button className="flex flex-col items-center p-3 transition-colors bg-gray-50 rounded-xl hover:bg-blue-50">
                  <Camera className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-xs text-gray-600">New Post</span>
                </button>
                <button className="flex flex-col items-center p-3 transition-colors bg-gray-50 rounded-xl hover:bg-blue-50">
                  <MessageCircle className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-xs text-gray-600">Message</span>
                </button>
                <Link to={`/edit/${userId}`}>
                <button className="flex flex-col items-center p-3 transition-colors bg-gray-50 rounded-xl hover:bg-blue-50">
                  <Edit className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-xs text-gray-600">Edit</span>
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;