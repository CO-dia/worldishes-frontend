"use client";

import DetailsRecipe from "@/components/Forms/DetailsRecipe";
import { IngredientsRecipe } from "@/components/Forms/IngredientsRecipe";
import InstructionsRecipe from "@/components/Forms/InstructionsRecipe";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNewRecipe } from "@/contexts/NewRecipeContext";

export default function NewRecipeContainer() {
  const { form, onSubmit, activeTab, setActiveTab } = useNewRecipe();

  return (
    <>
      <h1>Create dish recipe</h1>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mt-5"
      >
        <TabsList className="flex justify-center mb-6">
          <TabsTrigger value="details" className="w-full">
            Details
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="w-full">
            Ingredients
          </TabsTrigger>
          <TabsTrigger value="instructions" className="w-full">
            Instructions
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="details" className="space-y-6">
              <DetailsRecipe />
            </TabsContent>
            <TabsContent value="ingredients" className="space-y-6">
              <IngredientsRecipe />
            </TabsContent>
            <TabsContent value="instructions" className="space-y-6">
              <InstructionsRecipe />
            </TabsContent>
          </form>
        </Form>

        {Object.keys(form.formState.errors).length > 0 && (
          <div
            id="errors-box"
            className="mt-4 p-4 space-y-4 text-red-500 border border-red-500"
          >
            {Object.values(form.formState.errors).map((error, index) => (
              <p key={index}>{error.message}</p> // Accessing `message`
            ))}
          </div>
        )}
      </Tabs>
    </>
  );
}
