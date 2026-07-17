import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setAllAppliedJobs } from "../redux/jobSlice";
import { APPLICATION_API_END_POINT } from "../utils/contact.js";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAppliedJobs = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/get`,
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );

        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.application));
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Failed to fetch applied jobs:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  return { loading };
};

export default useGetAppliedJobs;