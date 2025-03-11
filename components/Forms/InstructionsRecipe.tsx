import { useNewRecipe } from "@/contexts/NewRecipeContext";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Youtube } from "lucide-react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import CustomEditor from "../CustomEditor";

export default function InstructionsRecipe() {
  const { form, setActiveTab } = useNewRecipe();
  return (
    <>
      <FormField
        control={form.control}
        name="recipe"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md">Recipe Instructions</FormLabel>
            <FormControl>
              <CustomEditor />
            </FormControl>
            <FormDescription>
              Provide detailed step-by-step instructions for preparing your
              recipe.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="youtubeLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md">
              YouTube Video Link (Optional)
            </FormLabel>
            <FormControl>
              <div className="flex">
                <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0">
                  <Youtube className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  className="rounded-l-none"
                  placeholder="https://youtube.com/watch?v=..."
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              Add a link to a video demonstration of your recipe.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="anonymous"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Publish Anonymously</FormLabel>
              <FormDescription>
                Toggle this if you want to publish this recipe without showing
                your name.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveTab("ingredients")}
        >
          Back: Ingredients
        </Button>
        <Button type="submit">Create Recipe</Button>
      </div>
    </>
  );
}
