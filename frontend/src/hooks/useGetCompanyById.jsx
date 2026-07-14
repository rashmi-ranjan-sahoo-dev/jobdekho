import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setSingleCompany } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!companyId) return;

    const controller = new AbortController();

    const fetchSingleCompany = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get/${companyId}`,
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );

        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Failed to fetch company:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSingleCompany();

    return () => {
      controller.abort();
    };
  }, [companyId, dispatch]);

  return { loading };
};

export default useGetCompanyById;