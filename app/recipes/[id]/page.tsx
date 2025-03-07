import UserComponent from "@/components/UserComponent";
import { Dish } from "@/types/dish";
import { Image as ImageType } from "@/types/image";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import Image from "next/image";

// Fetch recipes on the server for SEO
const getRecipeById = async (id: string): Promise<Dish> => {
  const res = await fetch(
    `${process.env.API_URL}${process.env.API_VERSION}dishes/${id}`,
    { cache: "no-store" }
  );

  return res.json();
};

const getImages = async (id: string): Promise<Array<ImageType>> => {
  const res = await fetch(
    `${process.env.API_URL}${process.env.API_VERSION}dishes/${id}/images`,
    { cache: "no-store" }
  );

  return res.json();
};

export default async function Page({ params }: { params: { id: string } }) {
  const recipe = await getRecipeById(params.id);
  const images = await getImages(params.id);

  return (
    <>
      <h2>Recipes</h2>
      <div>{recipe.name}</div>
      <div className="text-9xl">{getUnicodeFlagIcon(recipe.countryCode)}</div>
      <div>{recipe.description}</div>
      <div>{recipe.preparationTime}</div>
      <div>{recipe.recipe}</div>
      <div>{recipe.youtubeLink}</div>
      <div>{recipe.ratingAverage}</div>
      <UserComponent user={null} />
      <UserComponent user={recipe.user} />
      {images && images.length > 0 && (
        <Image
          src={images[0].link}
          width={800}
          height={200}
          alt={`Image of ${recipe.name} from ${getUnicodeFlagIcon(
            recipe.countryCode
          )}`}
        />
      )}
    </>
  );
}
