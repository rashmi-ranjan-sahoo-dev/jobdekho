import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";

import { APPLICATION_API_END_POINT } from "../../utils/contact.js";
import { setAllApplicants } from "../../redux/applicationSlice";

const Applicants = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { applicants } = useSelector((store) => store.application);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${id}/applicants`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job));
        }
      } catch (error) {
        console.error(
          error.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAllApplicants();
    }
  }, [dispatch, id]);

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto my-8">
        <h1 className="text-2xl font-bold mb-6">
          Applicants (
          {applicants?.applications?.length || 0})
        </h1>

        {loading ? (
          <p className="text-center py-8">Loading applicants...</p>
        ) : (
          <ApplicantsTable />
        )}
      </div>
    </div>
  );
};

export default Applicants;