"use client";

import { Dish } from "@/types/dish";
import { Rating as RatingType } from "@/types/rating";
import { useEffect, useState } from "react";

export default function Rating({ dish }: { dish: Dish }) {
  console.log(dish);
  const [rating, setRating] = useState<RatingType>();

  useEffect(() => {
    const getRatingUser = async (id: string): Promise<RatingType> => {
      const res = await fetch(
        `${process.env.API_URL}${process.env.API_VERSION}dishes/${id}/rating-user?userId=${dish.user.id}`,
        { cache: "no-store" },
      );

      const rating = await res.json();
      setRating(rating);
    };

    getRatingUser(dish.id);
  }, []);

  return <p className="text-gray-600">{dish.ratingAverage} / 5</p>;
}
