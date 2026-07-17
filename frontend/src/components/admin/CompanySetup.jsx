/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { COMPANY_API_END_POINT } from "../../utils/contact.js";
import useGetCompanyById from "../../hooks/useGetCompanyById";

const CompanySetup = () => {
  const { id } = useParams();

  useGetCompanyById(id);

  const navigate = useNavigate();

  const { singleCompany } = useSelector((store) => store.company);

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
    }
  }, [singleCompany]);

  const changeEventHandler = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const changeFileHandler = (e) => {
    setInput((prev) => ({
      ...prev,
      file: e.target.files?.[0] || null,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update company."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-3xl mx-auto my-10 px-4">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-4 mb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/companies")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <h1 className="text-2xl font-bold">
              Company Setup
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Company Name"
                value={input.name}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label htmlFor="description">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                placeholder="Company Description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                placeholder="https://example.com"
                value={input.website}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Bangalore"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="logo">Company Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-8"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Company"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;