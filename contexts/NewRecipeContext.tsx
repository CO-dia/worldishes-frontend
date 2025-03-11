import { createContext, useContext, useState } from "react";

// Form management
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useFieldArray,
  UseFormReturn,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";

// Navigation
import { useRouter } from "next/navigation";

const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.number().int().positive("Quantity must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  preparationTime: z
    .number()
    .int()
    .positive("Preparation time must be a positive number"),
  servings: z.number().int().positive("Servings must be a positive number"),
  recipe: z.string().min(1, "Recipe is required"),
  countryCode: z.string().min(1, "Country code is required"),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "At least one ingredient is required"),
  youtubeLink: z.string(),
  anonymous: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const NewRecipeContext = createContext<{
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  fields: FieldArrayWithId<FormValues, "ingredients">[];
  append: UseFieldArrayAppend<FormValues, "ingredients">;
  remove: UseFieldArrayRemove;
}>({
  form: {} as UseFormReturn<FormValues>,
  onSubmit: () => { },
  activeTab: "details",
  setActiveTab: () => { },
  fields: {} as FieldArrayWithId<FormValues, "ingredients">[],
  append: () => { },
  remove: () => { },
});

export default function NewRecipeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("details");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      preparationTime: 0,
      servings: 0,
      recipe: "",
      countryCode: "",
      youtubeLink: "",
      anonymous: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  function onSubmit(data: FormValues) {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
    // For now, we'll just show a success message and redirect
    alert("Recipe created successfully!");
    router.push("/recipes");
  }

  return (
    <NewRecipeContext.Provider
      value={{
        form,
        onSubmit,
        activeTab,
        setActiveTab,
        fields,
        append,
        remove,
      }}
    >
      {children}
    </NewRecipeContext.Provider>
  );
}

// Custom hook to use the CSRFContext
export const useNewRecipe = () => {
  const context = useContext(NewRecipeContext);
  if (!context) {
    throw new Error("useNewRecipe must be used within a NewRecipeProvider");
  }

  return context;
};
