
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const Job = ({ job }) => {
  const navigate = useNavigate();

  const getDaysAgo = (date) => {
    if (!date) return "";

    const createdAt = new Date(date);
    const today = new Date();

    const difference = today - createdAt;

    return Math.floor(difference / (1000 * 60 * 60 * 24));
  };

  const daysAgo = getDaysAgo(job?.createdAt);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgo === ""
            ? ""
            : daysAgo === 0
            ? "Today"
            : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`}
        </p>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Bookmark Job"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      {/* Company */}
      <div className="my-4 flex items-center gap-3">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={job?.company?.logo} />
        </Avatar>

        <div>
          <h2 className="font-semibold text-lg">
            {job?.company?.name}
          </h2>

          <p className="text-sm text-gray-500">
            {job?.location || "India"}
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div>
        <h1 className="mb-2 text-xl font-bold">
          {job?.title}
        </h1>

        <p className="line-clamp-3 text-sm text-gray-600">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Badge variant="ghost" className="font-semibold text-blue-700">
          {job?.position} Positions
        </Badge>

        <Badge variant="ghost" className="font-semibold text-red-600">
          {job?.jobType}
        </Badge>

        <Badge variant="ghost" className="font-semibold text-purple-700">
          ₹ {job?.salary} LPA
        </Badge>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(`/description/${job?._id}`)}
        >
          Details
        </Button>

        {/* <Button className="bg-[#7209B7] hover:bg-[#5d0791]">
          Save for Later
        </Button> */}
      </div>
    </div>
  );
};

export default Job;