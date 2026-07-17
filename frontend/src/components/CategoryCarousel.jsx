
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

import { Button } from "./ui/button";

import { setSearchedQuery } from "../redux/jobSlice";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Science",
  "Graphic Designer",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="my-16">
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {categories.map((category, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
            >
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-6 py-2 whitespace-nowrap hover:bg-primary hover:text-white transition-colors"
                onClick={() => searchJobHandler(category)}
              >
                {category}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;