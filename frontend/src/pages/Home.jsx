import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import PostCard from '../components/PostCard';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/posts');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setPosting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      const response = await api.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Prepend the new post, but backend doesn't populate author on create,
      // so just refetch the whole feed for correct author info
      await fetchPosts();

      setContent('');
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      <form
        onSubmit={handleCreatePost}
        className="bg-white rounded-xl shadow p-4 mb-6"
      >
        <div className="flex gap-3">
          {user?.profilePicture ? (
            <img
              src={`${apiUrl}/uploads/${user.profilePicture}`}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-white font-medium">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={2}
            className="flex-1 resize-none focus:outline-none text-sm"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex items-center justify-between border-t mt-3 pt-3">
          <label className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer">
            <ImageIcon className="w-4 h-4" />
            Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <button
            type="submit"
            disabled={posting || !content.trim()}
            className="bg-blue-400 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-blue-500 transition disabled:opacity-50"
          >
            Post
          </button>
        </div>

        {image && (
          <p className="text-xs text-gray-500 mt-2">Selected: {image.name}</p>
        )}
      </form>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet. Be the first!</p>
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

export default Home;