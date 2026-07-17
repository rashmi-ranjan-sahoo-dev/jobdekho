/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(
    (store) => store.job
  );

  const [filteredJobs, setFilteredJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;

      const search = searchJobByText.toLowerCase();

      return (
        job?.title?.toLowerCase().includes(search) ||
        job?.company?.name?.toLowerCase().includes(search)
      );
    });

    setFilteredJobs(filtered);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>A list of your recently posted jobs.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job?.company?.name}</TableCell>

                <TableCell>{job?.title}</TableCell>

                <TableCell>
                  {job?.createdAt?.split("T")[0]}
                </TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="cursor-pointer">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-36">
                      <div
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}`)
                        }
                        className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </div>

                      <div
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`)
                        }
                        className="flex items-center gap-2 mt-3 cursor-pointer hover:text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-8 text-gray-500"
              >
                No jobs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;