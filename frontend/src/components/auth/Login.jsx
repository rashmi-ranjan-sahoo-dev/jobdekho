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
import { setLoading, setUser } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.email || !input.password) {
      return toast.error("Please fill all required fields.");
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed!"
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
          className="w-full max-w-md bg-white shadow-xl rounded-xl border p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            Welcome Back
          </h1>

          {/* Email */}
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="john@gmail.com"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="********"
              required
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <Label className="block mb-2">
              Login As
            </Label>

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

          {/* Login Button */}
          {loading ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Login
            </Button>
          )}

          <p className="text-center text-sm mt-5">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;