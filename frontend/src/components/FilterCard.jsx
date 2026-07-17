import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

import { setSearchedQuery } from "../redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    options: [
      "Delhi NCR",
      "Bangalore",
      "Hyderabad",
      "Pune",
      "Mumbai",
    ],
  },
  {
    filterType: "Industry",
    options: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
    ],
  },
  {
    filterType: "Salary",
    options: [
      "0 - 40k",
      "40k - 1 Lakh",
      "1 Lakh - 5 Lakh",
    ],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full rounded-lg border bg-white p-5 shadow-sm">
      <h1 className="text-xl font-bold">Filter Jobs</h1>

      <hr className="my-4" />

      <RadioGroup
        value={selectedValue}
        onValueChange={setSelectedValue}
      >
        {filterData.map((section) => (
          <div key={section.filterType} className="mb-6">
            <h2 className="mb-3 font-semibold text-lg">
              {section.filterType}
            </h2>

            {section.options.map((option, index) => {
              const id = `${section.filterType}-${index}`;

              return (
                <div
                  key={id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <RadioGroupItem
                    value={option}
                    id={id}
                  />

                  <Label
                    htmlFor={id}
                    className="cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;