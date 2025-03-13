import { Dish } from "@/types/dish";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { Button } from "./ui/button";
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import Image from "next/image";
import Rating from "./Rating";

export function CardRecipe({ recipe }: { recipe: Dish }) {
  return (
    <Card className="p-0">
      <div className="aspect-video relative">
        <Image
          src={recipe.coverImageUrl || "/images/placeholder-recipe.jpg"}
          alt={recipe.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 space-y-4">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl truncate">{recipe.name}</CardTitle>
          <Rating
            dish={recipe}
            canRate={false}
            containerClassName="flex items-center gap-2 text-xl"
          />
        </CardHeader>

        <CardContent className="p-0 space-y-4 text-gray-500">
          <p className="text-md">{recipe.description}</p>
          <div className="flex items-center justify-stretch gap-8 sm:gap-12 md:gap-4 xl:gap-8 text-sm font-light">
            <span>
              <Clock />
              {recipe.preparationTime ?? "?"} mins
            </span>
            <span>
              <Users />
              {recipe.servings ?? "?"} servings
            </span>
            <span className="text-6xl">
              {getUnicodeFlagIcon(recipe.countryCode)}
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Link
            href={`/recipes/${recipe.id}`}
            className="text-sm w-full"
            passHref
          >
            <Button className="w-full" asChild>
              <span>View Recipe</span>
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
