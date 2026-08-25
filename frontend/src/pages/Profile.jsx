import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { id } = useParams();
  const { user: loggedInUser } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError('');
      try {
        const userRes = await api.get(`/api/users/${id}`);
        setProfileUser(userRes.data);

        const postsRes = await api.get('/api/posts');
        const userPosts = postsRes.data.filter(
          (post) => post.author._id === id
        );
        setPosts(userPosts);
      } catch (err) {
        setError('User not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading...</p>;
  }

  if (!profileUser) {
    return <p className="text-center text-gray-500 py-10">{error}</p>;
  }

  const isOwnProfile = loggedInUser && loggedInUser.id === id;

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      <Link
        to="/"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {profileUser.profilePicture ? (
              <img
                src={`${apiUrl}/uploads/${profileUser.profilePicture}`}
                alt={profileUser.username}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-purple-300 flex items-center justify-center text-white text-xl font-medium">
                {profileUser.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg text-gray-900">
                {profileUser.username}
              </h1>
              <p className="text-sm text-gray-500">@{profileUser.email}</p>
            </div>
          </div>

          {isOwnProfile && (
            <Link
              to="/profile/edit"
              className="border rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-gray-50"
            >
              Edit Profile
            </Link>
          )}
        </div>

        {profileUser.bio && (
          <p className="text-sm text-gray-700 mt-4">{profileUser.bio}</p>
        )}

        <p className="text-sm text-gray-500 mt-4">
          <span className="font-semibold text-gray-900">{posts.length}</span>{' '}
          posts
        </p>
      </div>

      <h2 className="font-semibold text-gray-900 mb-3">Posts</h2>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No posts yet.
        </div>
      ) : (
        posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onDeleted={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
        />
      ))
      )}
    </div>
  );
};

export default Profile;