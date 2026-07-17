import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setCompanies } from "../redux/companySlice";
import { COMPANY_API_END_POINT } from "../utils/contact.js";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCompanies = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get`,
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );

        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Failed to fetch companies:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  return { loading };
};

export default useGetAllCompanies;