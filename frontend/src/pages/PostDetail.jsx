import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
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

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchPost = async () => {
    try {
      const response = await api.get(`/api/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      setError('Post not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const isLiked = user && post?.likes.includes(user.id);

  const handleLike = async () => {
    try {
      const response = await api.post(`/api/posts/${id}/like`);
      setPost(response.data);
    } catch (err) {
      // ignore for now, could show a toast
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/api/posts/${id}/comment`, {
        text: commentText,
      });
      setPost(response.data);
      setCommentText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading...</p>;
  }

  if (!post) {
    return <p className="text-center text-gray-500 py-10">{error}</p>;
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
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

        <p className="px-4 pb-3 text-gray-800 whitespace-pre-wrap">{post.content}</p>

        {post.image && (
          <img
            src={`${apiUrl}/uploads/${post.image}`}
            alt="post"
            className="w-full max-h-96 object-cover"
          />
        )}

        <div className="flex items-center gap-4 px-4 py-3 border-t text-gray-500 text-sm">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 hover:text-red-500 transition ${
              isLiked ? 'text-red-500' : ''
            }`}
          >
            <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
            {post.likes.length}
          </button>
          <span>{post.comments.length} comments</span>
        </div>
      </div>

      <form
        onSubmit={handleAddComment}
        className="bg-white rounded-xl shadow p-4 mb-4 flex gap-2"
      >
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={submitting || !commentText.trim()}
          className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex flex-col gap-3">
        {post.comments
          .slice()
          .reverse()
          .map((comment) => (
            <div key={comment._id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-1">
                {comment.author.profilePicture ? (
                  <img
                    src={`${apiUrl}/uploads/${comment.author.profilePicture}`}
                    alt={comment.author.username}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-purple-300 flex items-center justify-center text-white text-xs font-medium">
                    {comment.author.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="font-medium text-sm text-gray-900">
                  {comment.author.username}
                </span>
                <span className="text-xs text-gray-400">
                  {timeAgo(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700 pl-9">{comment.text}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PostDetail;