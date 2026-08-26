import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useAuth } from '../context/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Register = () => {
  const [serverError, setServerError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setServerError('');
      try {
        await register(values.username, values.email, values.password);
        toast.success('Account created successfully!');
        navigate('/login');
      } catch (err) {
        const message =
          err.response?.data?.message || 'Something went wrong. Please try again.';
        setServerError(message);
        toast.error(message);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Join SocialConnect today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-6">
              {serverError && (
                <p className="text-red-500 text-sm bg-red-50 rounded p-2">
                  {serverError}
                </p>
              )}

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="yourhandle"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-red-500 text-xs">{formik.errors.username}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs">{formik.errors.email}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs">{formik.errors.password}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <div className="text-sm">
            Already have an account?{' '}
            <Link to="/login" className="underline underline-offset-4">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;