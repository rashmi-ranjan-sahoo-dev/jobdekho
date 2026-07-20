// import React from "react";
import { useSelector } from "react-redux";

import LatestJobCards from "./LatestJobCards";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);
  console.log(allJobs);

  return (
    <section className="max-w-7xl mx-auto my-20 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
        <span className="text-[#6A38C2]">Latest & Top</span> Job Openings
      </h1>

      {allJobs?.length > 0 ? (
        <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {allJobs.slice(0, 6).map((job) => (
            <LatestJobCards key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-52">
          <h2 className="text-lg font-medium text-gray-500">
            No jobs available at the moment.
          </h2>
        </div>
      )}
    </section>
  );
};

export default LatestJobs;