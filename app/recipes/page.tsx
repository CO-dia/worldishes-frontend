import Link from "next/link";
import { Dish } from "@/types/dish";

// Fetch recipes on the server for SEO
const getRecipes = async (): Promise<Array<Dish>> => {
  const res = await fetch(
    `${process.env.API_URL}${process.env.API_VERSION}dishes`,
  );

  return res.json();
};

export default async function Page() {
  const recipes = await getRecipes();
  return (
    <>
      <h2>Recipes</h2>
      <ul>
        {recipes &&
          recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link href={`/recipes/${recipe.id}`}>{recipe.name}</Link>
            </li>
          ))}
      </ul>
    </>
  );
}
