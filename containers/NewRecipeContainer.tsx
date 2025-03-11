import { Form } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNewRecipe } from "@/contexts/NewRecipeContext";

export default function NewRecipeContainer() {
  const { form, onSubmit, activeTab, setActiveTab, fields, append, remove } =
    useNewRecipe();

  return (
    <>
      <h1>Create dish</h1>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mt-5"
      >
        <TabsList className="flex justify-center">
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
      </Tabs>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}></form>
      </Form>
    </>
  );
}
