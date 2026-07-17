import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/contact.js";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    file: null,
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const changeFileHandler = (e) => {
    setInput({
      ...input,
      file: e.target.files[0],
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !input.fullName ||
      !input.email ||
      !input.phoneNumber ||
      !input.password
    ) {
      return toast.error("Please fill all required fields.");
    }

    const formData = new FormData();

    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);

    if (input.file) {
      formData.append("profilePhoto", input.file);
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {

  console.log(error);
  console.log(error.response);
  console.log(error.response?.data);

      toast.error(
        error.response?.data?.message || "Something went wrong!"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />

      <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-lg bg-white rounded-xl shadow-lg border p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            Create Account
          </h1>

          {/* Full Name */}
          <div className="mb-4">
            <Label>Full Name</Label>
            <Input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={input.fullName}
              onChange={changeEventHandler}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="john@gmail.com"
              value={input.email}
              onChange={changeEventHandler}
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <Label>Phone Number</Label>
            <Input
              type="tel"
              name="phoneNumber"
              placeholder="9876543210"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="********"
              value={input.password}
              onChange={changeEventHandler}
              required
            />
          </div>

          {/* Role */}
          <div className="mb-5">
            <Label className="mb-2 block">Select Role</Label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                />
                Student
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                />
                Recruiter
              </label>
            </div>
          </div>

          {/* Profile Image */}
          <div className="mb-6">
            <Label>Profile Image</Label>

            <Input
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
            />

            {input.file && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {input.file.name}
              </p>
            )}
          </div>

          {loading ? (
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Account...
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          )}

          <p className="text-center mt-5 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;