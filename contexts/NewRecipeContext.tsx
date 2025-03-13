"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
import CallAPI, { CallAPIURL } from "@/utils/CallAPI";

const ingredientSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
});

const detailsSection = " - Details Section : ";
const ingredientsSection = "- Ingredients Section : ";
const instructionsSection = "- Instructions Section : ";

const formSchema = z.object({
  name: z.string().min(1, detailsSection + "Name is required"),
  description: z
    .string()
    .min(10, detailsSection + "Description must be at least 10 characters")
    .max(500, detailsSection + "Description must be at most 500 characters"),
  preparationTime: z
    .number()
    .int()
    .positive(detailsSection + "Preparation time must be a positive number"),
  servings: z
    .number()
    .int()
    .positive(detailsSection + "Servings must be a positive number"),
  countryCode: z.string(),
  ingredients: z
    .array(ingredientSchema)
    .min(1, ingredientsSection + "At least one ingredient is required"),
  recipe: z.string().min(1, instructionsSection + "Recipe is required"),
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
  onSubmit: () => {},
  activeTab: "details",
  setActiveTab: () => {},
  fields: {} as FieldArrayWithId<FormValues, "ingredients">[],
  append: () => {},
  remove: () => {},
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
      countryCode: "",
      recipe: "",
      youtubeLink: "",
      anonymous: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  async function onSubmit(data: FormValues) {
    console.log("Form submitted:", data);
    const res = await CallAPI(
      "POST",
      CallAPIURL.dishes.get,
      "",
      { userId: "587b666d-e995-4157-ab25-863e75e15ae1", ...data },
      true
    );
    console.log("Response:", res);
    // Here you would typically send the data to your API
    // For now, we'll just show a success message and redirect
    alert("Recipe created successfully!");
    //router.push("/recipes");
  }

  useEffect(() => {
    if (
      !form.formState.isSubmitting &&
      form.formState.isSubmitted &&
      form.formState.errors
    ) {
      const errors = form.formState.errors;
      if (
        errors.name ||
        errors.description ||
        errors.preparationTime ||
        errors.servings
      ) {
        setActiveTab("details");
      } else if (errors.ingredients) {
        setActiveTab("ingredients");
      } else if (errors.recipe) {
        setActiveTab("instructions");
      }

      const errorsBox = document.getElementById("errors-box");
      errorsBox?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [form.formState.isSubmitted, form.formState.isSubmitting]);

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
