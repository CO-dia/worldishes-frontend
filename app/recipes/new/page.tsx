"use client";

import NewRecipeContainer from "@/containers/NewRecipeContainer";
import NewRecipeProvider from "@/contexts/NewRecipeContext";

export default function Page() {
  return (
    <NewRecipeProvider>
      <NewRecipeContainer />
    </NewRecipeProvider>
  );
}
