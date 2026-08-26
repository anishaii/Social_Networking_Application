import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, MoreHorizontal } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

const PostCard = ({ post, onDeleted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [likes, setLikes] = useState(post.likes);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [content, setContent] = useState(post.content);
  const [saving, setSaving] = useState(false);

  const isLiked = user && likes.includes(user.id);
  const isOwner = user && post.author._id === user.id;

  const handleLike = async (e) => {
    e.preventDefault();
    const wasLiked = isLiked;

    setLikes((prev) =>
      wasLiked ? prev.filter((id) => id !== user.id) : [...prev, user.id]
    );

    try {
      await api.post(`/api/posts/${post._id}/like`);
    } catch (err) {
      setLikes(post.likes);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/posts/${post._id}`);
      if (onDeleted) onDeleted(post._id);
    } catch (err) {
      alert('Failed to delete post.');
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      await api.put(`/api/posts/${post._id}`, { content: editContent });
      setContent(editContent);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow mb-4">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
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

        {isOwner && (
          <div className="relative">
            <button onClick={() => setShowMenu((prev) => !prev)}>
              <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteDialog(true);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            )}

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently
                    delete your post and remove it from the feed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="px-4 pb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="w-full border rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditContent(content);
                setIsEditing(false);
              }}
              className="border text-sm px-3 py-1 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <Link to={`/posts/${post._id}`}>
          <p className="px-4 pb-3 text-gray-800 whitespace-pre-wrap">{content}</p>

          {post.image && (
            <img
              src={`${apiUrl}/uploads/${post.image}`}
              alt="post"
              className="w-full max-h-96 object-cover"
            />
          )}
        </Link>
      )}

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