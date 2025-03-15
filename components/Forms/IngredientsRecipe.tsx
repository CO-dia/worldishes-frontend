import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useNewRecipe } from "@/contexts/NewRecipeContext";
import { Label } from "../ui/label";

export function IngredientsRecipe() {
  const { form, fields, append, remove, setActiveTab } = useNewRecipe();
  const unitOptions = [
    "g",
    "kg",
    "ml",
    "l",
    "tsp",
    "tbsp",
    "cup",
    "oz",
    "lb",
    "pinch",
    "piece",
    "slice",
    "clove",
    "bunch",
    "to taste",
  ];

  return (
    <>
      <div className="flex items-center justify-between my-6">
        <Label className="text-md font-medium">
          Ingredients <span>*</span>
        </Label>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex items-end gap-3 border p-4 rounded-md"
        >
          <FormField
            control={form.control}
            name={`ingredients.${index}.name`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Ingredient</FormLabel>
                <FormControl>
                  <Input placeholder="Flour" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`ingredients.${index}.quantity`}
            render={({ field }) => (
              <FormItem className="w-24">
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    placeholder="200"
                    type="number"
                    min={0}
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

          <FormField
            control={form.control}
            name={`ingredients.${index}.unit`}
            render={({ field }) => (
              <FormItem className="w-28">
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unitOptions.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fields.length > 1 && remove(index)}
            className="mb-2"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="sm"
        onClick={() => append({ name: "", quantity: 0, unit: "" })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Ingredient
      </Button>

      <div className="flex justify-between pt-10">
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveTab("details")}
        >
          Back: Details
        </Button>
        <Button type="button" onClick={() => setActiveTab("instructions")}>
          Next: Instructions
        </Button>
      </div>
    </>
  );
}
