import UserComponent from "@/components/UserComponent";
import { Dish } from "@/types/dish";
import { Image as ImageType } from "@/types/image";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import Image from "next/image";
import Rating from "@/components/Rating";
import { CookingPot, Youtube } from "lucide-react";
import dynamic from "next/dynamic";

const RecipeEditor = dynamic(() => import("@/components/DisplayRecipe"), {
  ssr: false,
});

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
  const recipeTitle = recipe.name;
  const imageUrl = images?.[0]?.link ?? "/images/test-ratio-2.jpg";

  const title = (
    <>
      {getUnicodeFlagIcon(recipe.countryCode)}
      <h1>{recipeTitle}</h1>
    </>
  );

  return (
    <article className="w-full mt-5">
      <div className="relative w-full aspect-[16/9] mb-5">
        <Image
          src={imageUrl}
          alt={`Image of ${recipe.name} from ${getUnicodeFlagIcon(
            recipe.countryCode
          )}`}
          layout="fill" // Forces it to fill the container
          objectFit="cover" // Keeps original aspect ratio and fits inside
          priority
          quality={75}
          className="rounded-lg shadow-lg"
        />
      </div>
      <div className="flex gap-4 text-3xl md:text-5xl lg:text-6xl font-semibold w-full">
        {title}
      </div>
      {/* Description Section */}
      <p className="my-2 text-2xl text-muted-foreground">
        {recipe.description}
      </p>
      <Rating
        dish={recipe}
        canRate
        containerClassName="flex items-center text-xl gap-4 mb-8"
      />
      <UserComponent user={recipe.user} anonymous={recipe.anonymous} />
      <div className="flex flex-wrap gap-6 py-8">
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">Cooking Time</p>
          <p className="font-medium text-xl">{recipe.preparationTime} min</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">Servings</p>
          <p className="font-medium text-xl">{recipe.servings}</p>
        </div>
      </div>

      {/* Recipe Instructions Section */}
      <section className="details-sections">
        <div className="flex items-center gap-4">
          <CookingPot className="w-8 h-8 md:w-12 md:h-12" />
          <h2 className="font-semibold text-gray-800">Recipe</h2>
        </div>
        <RecipeEditor recipe={recipe} />
      </section>

      {/* YouTube Link Section */}
      {recipe.youtubeLink && (
        <section className="details-sections">
          <div className="flex items-center gap-4">
            <Youtube className="w-8 h-8 md:w-12 md:h-12" />
            <h2 className="font-semibold text-gray-800">Watch the Recipe</h2>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-64 rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${new URL(
                recipe.youtubeLink
              ).searchParams.get("v")}`}
              title="Recipe Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      )}
    </article>
  );
}
