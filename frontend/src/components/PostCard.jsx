import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';

const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: 'y', secs: 31536000 },
    { label: 'mo', secs: 2592000 },
    { label: 'd', secs: 86400 },
    { label: 'h', secs: 3600 },
    { label: 'm', secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return 'just now';
};

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [likes, setLikes] = useState(post.likes);
  const isLiked = user && likes.includes(user.id);

  const handleLike = async (e) => {
    e.preventDefault(); // stop the parent <Link> from navigating
    const wasLiked = isLiked;

    // optimistic update
    setLikes((prev) =>
      wasLiked ? prev.filter((id) => id !== user.id) : [...prev, user.id]
    );

    try {
      await api.post(`/api/posts/${post._id}/like`);
    } catch (err) {
      // revert on failure
      setLikes(post.likes);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow mb-4">
      <div className="flex items-center gap-3 p-4">
        <Link to={`/profile/${post.author._id}`}>
          {post.author.profilePicture ? (
            <img
              src={`${apiUrl}/uploads/${post.author.profilePicture}`}
              alt={post.author.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-white font-medium">
              {post.author.username?.[0]?.toUpperCase()}
            </div>
          )}
        </Link>
        <div>
          <Link
            to={`/profile/${post.author._id}`}
            className="font-semibold text-gray-900 hover:underline"
          >
            {post.author.username}
          </Link>
          <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      <Link to={`/posts/${post._id}`}>
        <p className="px-4 pb-3 text-gray-800 whitespace-pre-wrap">{post.content}</p>

        {post.image && (
          <img
            src={`${apiUrl}/uploads/${post.image}`}
            alt="post"
            className="w-full max-h-96 object-cover"
          />
        )}
      </Link>

      <div className="flex items-center gap-4 px-4 py-3 border-t text-gray-500 text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 hover:text-red-500 transition ${
            isLiked ? 'text-red-500' : ''
          }`}
        >
          <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
          {likes.length}
        </button>
        <Link
          to={`/posts/${post._id}`}
          className="flex items-center gap-1 hover:text-blue-600"
        >
          <MessageSquare className="w-4 h-4" /> {post.comments.length}
        </Link>
      </div>
    </div>
  );
};

export default PostCard;