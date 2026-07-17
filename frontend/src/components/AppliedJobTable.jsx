// import React from "react";
import { useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { Badge } from "./ui/badge";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-500 hover:bg-green-500";
      case "rejected":
        return "bg-red-500 hover:bg-red-500";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-500";
      default:
        return "bg-gray-500 hover:bg-gray-500";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>A list of your applied jobs.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAppliedJobs?.length > 0 ? (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>
                  {appliedJob?.createdAt?.split("T")[0]}
                </TableCell>

                <TableCell>
                  {appliedJob?.job?.title}
                </TableCell>

                <TableCell>
                  {appliedJob?.job?.company?.name}
                </TableCell>

                <TableCell className="text-right">
                  <Badge
                    className={getStatusColor(
                      appliedJob?.status
                    )}
                  >
                    {appliedJob?.status?.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-8 text-gray-500"
              >
                You haven't applied for any jobs yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;