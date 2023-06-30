import { Link } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

let translation = 0;
let carrouselState = 0;

interface food {
  id: number;
  title: string;
  img: string;
  description: string;
  recipe: string;
}

interface fetchResponse {
  results: food[];
  cursor: number;
}

const HomePage = () => {
  let current: number[] = [];
  const fetchFood = async ({ pageParam = 0 }) => {
    data?.pages.forEach((page) => {
      page.results.forEach((food) => {
        current.push(food.id);
      });
    });

    // const current = data?.pages[0].results[0].id;
    const response = await axios.get<fetchResponse>(
      "http://3.12.120.59:3000/food",
      {
        params: { page: pageParam, current: current },
      }
    );
    return response.data;
  };

  const {
    data,
    error,
    status,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<fetchResponse, Error>({
    queryKey: ["foodCards"],
    queryFn: fetchFood,
    staleTime: 3600000,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  // const { data: foodObject } = useQuery({
  //   queryKey: ["firstBatch"],
  //   queryFn: () =>
  //     axios.get<food[]>("http://localhost:3000/food").then((res) => res.data),
  //   staleTime: 3600000,
  // });

  //const matches = useMediaQuery("(min-width:600px)");

  const [x, setX] = useState(0);

  const transUnit = window.innerWidth / 16;

  return status === "loading" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p> Error: {error.message}</p>
  ) : (
    <>
      <Button
        variant="contained"
        onClick={() => {
          if (carrouselState < 0) {
            translation = translation + transUnit * 5;
            setX(translation);
            carrouselState++;
          }
        }}
      >
        Last
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          if (carrouselState <= 0) {
            translation = translation - transUnit * 5;
            setX(translation);

            carrouselState--;
          }
        }}
      >
        Next
      </Button>

      <motion.div
        animate={{ x }}
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.results.map((food) => (
              <FoodCard key={food.id} {...food} />
            ))}
          </React.Fragment>
        ))}

        {/* {foodObject?.map((food) => (
          <FoodCard key={food.id} {...food} />
        ))} */}

        <Button
          sx={{ height: "15%" }}
          variant="contained"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </Button>
      </motion.div>

      <Link to={"/4"}>Details</Link>
    </>
  );
};

export default HomePage;
