import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";

import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { setSearchCompanyByText } from "../../redux/companySlice";

const Companies = () => {
  // Fetch all companies
  useGetAllCompanies();

  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setSearchCompanyByText(searchText));
  }, [searchText, dispatch]);

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto my-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <Input
            type="text"
            className="w-full sm:w-80"
            placeholder="Search company..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Button onClick={() => navigate("/admin/companies/create")}>
            + New Company
          </Button>
        </div>

        <CompaniesTable />
      </div>
    </div>
  );
};

export default Companies;