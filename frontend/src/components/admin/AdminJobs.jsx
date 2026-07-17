import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AdminJobsTable from "./AdminJobsTable";

import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "../../redux/jobSlice";

const AdminJobs = () => {
  // Fetch all admin jobs
  useGetAllAdminJobs();

  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(searchText));
  }, [searchText, dispatch]);

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto my-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <Input
            className="w-full sm:w-80"
            type="text"
            placeholder="Search by company or job title..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Button onClick={() => navigate("/admin/jobs/create")}>
            + New Job
          </Button>
        </div>

        <AdminJobsTable />
      </div>
    </div>
  );
};

export default AdminJobs;