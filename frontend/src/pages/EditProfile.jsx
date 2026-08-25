import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { useAuth } from '../context/useAuth';

const editProfileSchema = Yup.object({
  username: Yup.string().min(3, 'Username must be at least 3 characters'),
  bio: Yup.string().max(300, 'Bio must be under 300 characters'),
});

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(
    user?.profilePicture ? `${apiUrl}/uploads/${user.profilePicture}` : null
  );
  const [serverError, setServerError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const formik = useFormik({
    initialValues: {
      username: user?.username || '',
      bio: user?.bio || '',
    },
    validationSchema: editProfileSchema,
    onSubmit: async (values) => {
      setServerError('');
      try {
        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('bio', values.bio);
        if (imageFile) {
          formData.append('profilePicture', imageFile);
        }

        const response = await api.put(`/api/users/${user.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        updateUser(response.data);
        navigate(`/profile/${user.id}`);
      } catch (err) {
        setServerError(
          err.response?.data?.message || 'Failed to update profile.'
        );
      }
    },
  });

  return (
    <div className="max-w-md mx-auto py-6 px-4">
      <Link
        to={`/profile/${user.id}`}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to profile
      </Link>

      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="font-bold text-lg text-gray-900 mb-6">Edit Profile</h1>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col items-center">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover mb-2"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-300 flex items-center justify-center text-white text-2xl font-medium mb-2">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <label className="text-blue-600 text-sm cursor-pointer">
              Change photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {serverError && (
            <p className="text-red-500 text-sm bg-red-50 rounded p-2">
              {serverError}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formik.values.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.bio && formik.errors.bio && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.bio}</p>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Link
              to={`/profile/${user.id}`}
              className="flex-1 text-center border rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;