import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "../utils/contact.js";
import { setSingleJob } from "../redux/jobSlice";

const JobDescription = () => {
  const { id: jobId } = useParams();

  const dispatch = useDispatch();

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);

  const isApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const applyJobHandler = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [
              ...singleJob.applications,
              { applicant: user?._id },
            ],
          })
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to apply."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch job."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [dispatch, jobId]);

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {singleJob?.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="ghost" className="text-blue-700 font-semibold">
              {singleJob?.position} Positions
            </Badge>

            <Badge variant="ghost" className="text-red-600 font-semibold">
              {singleJob?.jobType}
            </Badge>

            <Badge variant="ghost" className="text-purple-700 font-semibold">
              ₹ {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>

        <Button
          onClick={applyJobHandler}
          disabled={isApplied || loading}
          className={
            isApplied
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5d0894]"
          }
        >
          {loading
            ? "Processing..."
            : isApplied
            ? "Already Applied"
            : "Apply Now"}
        </Button>
      </div>

      <h2 className="mt-8 border-b pb-4 text-xl font-semibold">
        Job Description
      </h2>

      <div className="mt-6 space-y-3">
        <p>
          <strong>Role:</strong> {singleJob?.title}
        </p>

        <p>
          <strong>Location:</strong> {singleJob?.location}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {singleJob?.description}
        </p>

        <p>
          <strong>Experience:</strong>{" "}
          {singleJob?.experience} Years
        </p>

        <p>
          <strong>Salary:</strong> ₹ {singleJob?.salary} LPA
        </p>

        <p>
          <strong>Total Applicants:</strong>{" "}
          {singleJob?.applications?.length || 0}
        </p>

        <p>
          <strong>Posted Date:</strong>{" "}
          {singleJob?.createdAt?.split("T")[0]}
        </p>
      </div>
    </div>
  );
};

export default JobDescription;