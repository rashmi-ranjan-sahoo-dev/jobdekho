import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./shared/Navbar";
import Job from "./Job";

import useGetAllJobs from "../hooks/useAllJobs.jsx";
import { setSearchedQuery } from "../redux/jobSlice";

const Browse = () => {
  useGetAllJobs();

  const dispatch = useDispatch();

  const { allJobs } = useSelector((store) => store.job);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto my-10 px-4">
        <h1 className="text-2xl font-bold mb-8">
          Search Results ({allJobs?.length || 0})
        </h1>

        {allJobs?.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allJobs.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-60">
            <p className="text-lg text-gray-500">
              No jobs found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;