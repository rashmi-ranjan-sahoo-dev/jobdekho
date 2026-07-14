import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setAllAdminJobs } from "../redux/jobSlice";
import { JOB_API_END_POINT } from "../utils/contact.js"

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllAdminJobs = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/getadminjobs`,
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );

        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Failed to fetch admin jobs:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllAdminJobs();

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  return { loading };
};

export default useGetAllAdminJobs;