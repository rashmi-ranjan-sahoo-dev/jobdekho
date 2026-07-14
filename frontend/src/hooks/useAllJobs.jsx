import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllJobs = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get?keyword=${searchedQuery || ""}`,
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Failed to fetch jobs:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();

    return () => {
      controller.abort();
    };
  }, [dispatch, searchedQuery]);

  return { loading };
};

export default useGetAllJobs;