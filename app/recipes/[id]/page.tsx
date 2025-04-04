import UserComponent from "@/components/UserComponent";
import { Dish } from "@/types/dish";
import { Image as ImageType } from "@/types/image";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import Image from "next/image";
import Rating from "@/components/Rating";
import { CookingPot, ListChecks, Youtube } from "lucide-react";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { Ingredient } from "@/types/ingredient";

const RecipeEditor = dynamic(() => import("@/components/DisplayRecipe"), {
  ssr: false,
});

// Fetch recipes on the server for SEO
const getRecipeById = async (id: string): Promise<Dish> => {
  const res = await fetch(
    `${process.env.API_URL}${process.env.API_VERSION}dishes/${id}`,
    { cache: "no-store" },
  );

  return res.json();
};

const getImages = async (id: string): Promise<Array<ImageType>> => {
  const res = await fetch(
    `${process.env.API_URL}${process.env.API_VERSION}dishes/${id}/images`,
    { cache: "no-store" },
  );

  return res.json();
};

const getIngredients = async (id: string): Promise<Array<Ingredient>> => {
  const res = await fetch(
    `${process.env.API_URL}${process.env.API_VERSION}dishes/${id}/ingredients`,
    { cache: "no-store" },
  );

  return res.json();
};

export default async function Page({ params }: { params: { id: string } }) {
  const recipe = await getRecipeById(params.id);
  const ingredients = await getIngredients(params.id);
  const images = await getImages(params.id);
  const session = await getServerSession(authOptions);
  const recipeTitle = recipe.name;
  const imageUrl = images?.[0]?.link ?? "/images/placeholder-recipe.jpg";

  console.log({ ingredients });
  const title = (countryCode: string) => {
    return (
      <>
        {countryCode && getUnicodeFlagIcon(countryCode)}
        <h1>{recipeTitle}</h1>
      </>
    );
  };

  return (
    <article className="w-full mt-5">
      <div className="relative w-full aspect-[16/9] mb-5">
        <Image
          src={imageUrl}
          alt={`Image of ${recipe.name} from ${recipe.countryCode && getUnicodeFlagIcon(recipe.countryCode)
            }`}
          layout="fill" // Forces it to fill the container
          objectFit="cover" // Keeps original aspect ratio and fits inside
          priority
          quality={75}
          className="rounded-lg shadow-lg"
        />
      </div>
      <div className="flex gap-4 text-3xl md:text-5xl lg:text-6xl font-semibold w-full">
        {title(recipe.countryCode)}
      </div>
      {/* Description Section */}
      <p className="my-2 text-2xl text-muted-foreground">
        {recipe.description}
      </p>
      <Rating
        session={session}
        dish={recipe}
        canRate
        containerClassName="flex items-center text-xl gap-4 mb-8"
      />
      <UserComponent user={recipe.user} anonymous={recipe.anonymous} />
      <div className="flex flex-wrap gap-6 py-8">
        <div className="flex flex-col items-center border p-4 rounded-lg shadow-sm">
          <p className="text-sm text-muted-foreground">Cooking Time</p>
          <p className="font-medium text-xl">{recipe.preparationTime} min</p>
        </div>
        <div className="flex flex-col items-center border p-4 rounded-lg shadow-sm">
          <p className="text-sm text-muted-foreground">Servings</p>
          <p className="font-medium text-xl">{recipe.servings}</p>
        </div>
      </div>

      {/* Ingredients Instructions Section */}
      {ingredients && (
        <section className="details-sections">
          <div className="flex items-center gap-4">
            <ListChecks className="w-8 h-8 md:w-12 md:h-12" />
            <h2 className="font-semibold text-gray-800">Ingredients</h2>
          </div>
          <ul className="m-4 px-8 py-4 border border-gray-200 rounded-lg shadow list-disc list-inside">
            {ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.quantity} {ingredient.unit} {ingredient.ingredient}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recipe Instructions Section */}
      <section className="details-sections">
        <div className="flex items-center gap-4">
          <CookingPot className="w-8 h-8 md:w-12 md:h-12" />
          <h2 className="font-semibold text-gray-800">Recipe</h2>
        </div>
        <div className="m-4 px-8 border border-gray-200 rounded-lg shadow-lg">
          <RecipeEditor recipe={recipe} />
        </div>
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
                recipe.youtubeLink, 
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
