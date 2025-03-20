import { Dish } from "@/types/dish";
import { CardRecipe } from "@/components/CardRecipe";

// Fetch recipes on the server for SEO
const getRecipes = async (): Promise<Array<Dish>> => {
  const res = await fetch(
    `${process.env.API_URL}${process.env.API_VERSION}dishes`,
    { next: { revalidate: 60 } }
  );

  return res.json();
};

export default async function Page() {
  const recipes = await getRecipes();

  return (
    <>
      <h1>Recipes</h1>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {recipes &&
          recipes.length > 0 &&
          recipes.map((recipe) => (
            <CardRecipe recipe={recipe} key={recipe.id} />
          ))}
      </div>
    </>
  );
}
