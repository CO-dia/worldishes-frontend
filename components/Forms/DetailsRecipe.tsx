import { useNewRecipe } from "@/contexts/NewRecipeContext";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

export default function DetailsRecipe() {
  const { form, setActiveTab } = useNewRecipe();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md">Recipe Title</FormLabel>
            <FormControl>
              <Input placeholder="Delicious Chocolate Cake" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md">Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="A brief description of your recipe..."
                className="min-h-24"
                {...field}
              />
            </FormControl>
            <FormDescription>
              (This is not the recipe, just a description of the dish.)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="preparationTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Cooking Time</FormLabel>
              <FormControl>
                <Input placeholder="30" {...field} />
              </FormControl>
              <FormDescription>min</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="servings"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Servings</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="4"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseInt(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={() => setActiveTab("ingredients")}>
          Next: Ingredients
        </Button>
      </div>

      {/*
      <FormField
        control={form.control}
        name="countryCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country of Origin</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                countryOptions.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />*/}
    </>
  );
}
