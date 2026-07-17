import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { COMPANY_API_END_POINT } from "../../utils/contact.js";
import { setSingleCompany } from "../../redux/companySlice";

const CompanyCreate = () => {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      return toast.error("Company name is required.");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company));

        toast.success(res.data.message);

        navigate(`/admin/companies/${res.data.company._id}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create company."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto my-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Your Company</h1>

          <p className="text-gray-500 mt-2">
            Enter your company name below. You can update it later from the
            company settings.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>

          <Input
            id="companyName"
            type="text"
            placeholder="Google, Microsoft, Amazon..."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="flex gap-3 mt-10">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/companies")}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={registerNewCompany}
            disabled={loading}
          >
            {loading ? "Creating..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;