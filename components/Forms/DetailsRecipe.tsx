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
import { useEffect, useState } from "react";

export default function DetailsRecipe() {
  const { form, setActiveTab } = useNewRecipe();
  const [countries, setCountries] = useState<
    [{ label: string; value: string }] | []
  >([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
        setSelectedCountry(data.userSelectValue);
      });
  }, []);

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-md">
              Recipe Title <span>*</span>
            </FormLabel>
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
            <FormLabel className="text-md">
              Description <span>*</span>
            </FormLabel>
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

      <div className="flex flex-col md:flex-row w-full gap-4">
        <div className="flex justify-stretch w-full md:w-1/2 gap-4">
          <FormField
            control={form.control}
            name="preparationTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md">
                  Cooking Time <span>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="30"
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value))
                    }
                  />
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
                <FormLabel className="text-md">
                  Servings <span>*</span>
                </FormLabel>
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

        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem className="w-full md:w-1/2">
              <FormLabel className="text-md">From</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={selectedCountry}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country, index) => (
                    <SelectItem key={index} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
    </>
  );
}
