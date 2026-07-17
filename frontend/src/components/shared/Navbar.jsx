
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { LogOut, User2 } from "lucide-react";
import { toast } from "sonner";

import { USER_API_END_POINT } from "../../utils/contact.js";
import { setUser } from "../../redux/authSlice.js";

import { Button } from "../ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../ui/avatar.jsx";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover.jsx";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        `${USER_API_END_POINT}/logout`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Logout failed"
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link to="/">
          <h1 className="text-2xl font-bold">
            Job
            <span className="text-primary">
              Portal
            </span>
          </h1>
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-8">

          <nav>
            <ul className="flex items-center gap-6 text-sm font-medium">

              {user?.role === "recruiter" ? (
                <>
                  <li>
                    <NavLink
                      to="/admin/companies"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground transition-colors"
                      }
                    >
                      Companies
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/admin/jobs"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground transition-colors"
                      }
                    >
                      Jobs
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground transition-colors"
                      }
                    >
                      Home
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/jobs"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground transition-colors"
                      }
                    >
                      Jobs
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/browse"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground transition-colors"
                      }
                    >
                      Browse
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Right */}

          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline">
                  Login
                </Button>
              </Link>

              <Link to="/signup">
                <Button>
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-transparent transition hover:ring-primary">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                  />

                  <AvatarFallback>
                    {user?.fullname?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-72"
              >
                <div className="space-y-4">

                  <div className="flex items-center gap-3">

                    <Avatar>
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                      />

                      <AvatarFallback>
                        {user?.fullname?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h4 className="font-semibold">
                        {user?.fullname}
                      </h4>

                      <p className="text-sm text-muted-foreground">
                        {user?.profile?.bio}
                      </p>
                    </div>

                  </div>

                  <div className="border-t pt-3 space-y-2">

                    {user?.role === "student" && (
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 rounded-md p-2 text-sm hover:bg-accent transition-colors"
                      >
                        <User2 className="size-4" />
                        View Profile
                      </Link>
                    )}

                    <button
                      onClick={logoutHandler}
                      className="flex w-full items-center gap-3 rounded-md p-2 text-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>

                  </div>

                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;