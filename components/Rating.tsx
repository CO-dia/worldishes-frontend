"use client";

import { Dish } from "@/types/dish";
import { Rating as RatingType } from "@/types/rating";
import { useEffect, useState } from "react";
import { FaStarHalfAlt, FaStar, FaRegStar } from "react-icons/fa";
import RateModal from "./RateModal";
import CallAPI from "@/utils/CallAPI";

export default function Rating({
  dish,
  canRate,
}: {
  dish: Dish;
  canRate?: boolean;
}) {
  console.log(dish);
  const [rating, setRating] = useState<RatingType>();

  useEffect(() => {
    const getRatingUser = async (id: string): Promise<RatingType> => {
      const { data } = await CallAPI(
        "GET",
        `/dishes/${id}/rating-user?userId=${dish.user.id}`,
      );
      console.log("User rating", data);
      setRating(rating);
    };

    getRatingUser(dish.id);
  }, [dish]);

  return (
    <div className="flex flex-col items-center text-3xl">
      <div className="flex gap-1 text-amber-600">
        {[1, 2, 3, 4, 5].map((i) => {
          if (dish.ratingAverage >= i) {
            return <FaStar key={i} />;
          } else if (dish.ratingAverage + 0.5 >= i) {
            return <FaStarHalfAlt key={i} />;
          } else {
            return <FaRegStar key={i} />;
          }
        })}
      </div>
      <p className="text-gray-600">
        {dish.ratingAverage} / 5 ({dish.ratingCount})
      </p>
      {canRate && <RateModal />}
    </div>
  );
}
