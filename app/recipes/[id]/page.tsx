import UserComponent from "@/components/UserComponent";
import { Dish } from "@/types/dish";
import { Image as ImageType } from "@/types/image";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import Image from "next/image";
import Rating from "@/components/Rating";
import { Clock, CookingPot, FileText, Star, Youtube } from "lucide-react";

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
      <div className="relative w-full mb-5">
        <div className="w-full aspect-[16/9] relative">
          <Image
            src={imageUrl}
            alt={`Image of ${recipe.name} from ${getUnicodeFlagIcon(recipe.countryCode)}`}
            layout="fill" // Forces it to fill the container
            objectFit="cover" // Keeps original aspect ratio and fits inside
            priority
            quality={75}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Title Section Positioned Over the Image */}
        <div className="absolute flex bottom-0 left-0 py-3 px-8 gap-3 text-white text-3xl md:text-5xl lg:text-6xl font-semibold bg-gray-800/60 w-full">
          {title}
        </div>
      </div>

      <UserComponent user={recipe.user} anonymous={recipe.anonymous} />

      {/* Description Section */}
      <section className="details-sections mt-5">
        <div className="flex items-center gap-4">
          <FileText className="w-8 h-8 md:w-12 md:h-12" />
          <h2 className="font-semibold text-gray-800">Description</h2>
        </div>
        <p className="text-gray-600">{recipe.description}</p>
      </section>

      {/* Preparation Time Section */}
      <section className="details-sections">
        <div className="flex items-center gap-4">
          <Clock className="w-8 h-8 md:w-12 md:h-12" />
          <h2 className="font-semibold text-gray-800">Preparation Time</h2>
        </div>
        <p className="text-gray-600">{recipe.preparationTime} min</p>
      </section>

      {/* Recipe Instructions Section */}
      <section className="details-sections">
        <div className="flex items-center gap-4">
          <CookingPot className="w-8 h-8 md:w-12 md:h-12" />
          <h2 className="font-semibold text-gray-800">Recipe</h2>
        </div>
        <p className="text-gray-600">{recipe.recipe}</p>
      </section>

      {/* YouTube Link Section */}
      {!recipe.youtubeLink && (
        <section className="details-sections">
          <div className="flex items-center gap-4">
            <Youtube className="w-8 h-8 md:w-12 md:h-12" />
            <h2 className="font-semibold text-gray-800">Watch the Recipe</h2>
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-64 rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${new URL(recipe.youtubeLink).searchParams.get("v")}`}
              title="Recipe Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      )}

      {/* Rating Section */}
      <section className="details-sections">
        <div className="flex items-center gap-4">
          <Star className="w-8 h-8 md:w-12 md:h-12" />
          <h2 className="font-semibold text-gray-800">Rating</h2>
        </div>
        <Rating dish={recipe} canRate />
      </section>
    </article>
  );
}
