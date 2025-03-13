"use client";

import { Dish } from "@/types/dish";
import { Rating as RatingType } from "@/types/rating";
import { useEffect, useState } from "react";
import { FaStarHalfAlt, FaStar, FaRegStar } from "react-icons/fa";
import RateModal from "./RateModal";
import CallAPI from "@/utils/CallAPI";

export default function Rating({
  dish,
  canRate = false,
  containerClassName = "flex flex-col items-center text-3xl",
}: {
  dish: Dish;
  canRate?: boolean;
  containerClassName?: string;
}) {
  console.log(dish);
  const [rating, setRating] = useState<RatingType>();

  {
    /* useEffect(() => {
    const getRatingUser = async (id: string): Promise<RatingType> => {
      const { data } = await CallAPI(
        "GET",
        `/dishes/${id}/rating-user?userId=${dish.user.id}`,
      );
      console.log("User rating", data);
      setRating(rating);
    };

    getRatingUser(dish.id);
  }, [dish]);*/
  }

  return (
    <div className={containerClassName}>
      <div className="flex gap-1 text-yellow-400">
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
      <span className="text-gray-600">
        ({dish.ratingAverage ?? 0}){` • ${dish?.ratingCount ?? 0}`}
      </span>
      {canRate && <RateModal />}
    </div>
  );
}
