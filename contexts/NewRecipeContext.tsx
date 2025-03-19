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
import toast from "react-hot-toast";

const ingredientSchema = z.object({
  ingredient: z.string(),
  quantity: z.number(),
  unit: z.string(),
});

const detailsSection = " - Details Section : ";
const ingredientsSection = "- Ingredients Section : ";
const instructionsSection = "- Instructions Section : ";

const formSchema = z.object({
  name: z.string().min(1, detailsSection + "Name is required"),
  coverImage: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size < 10 * 1024 * 1024, {
      message: "Cover image must be less than 10MB",
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type), // Check file type if file is present
      {
        message: "Cover image must be a JPEG, PNG, or WebP",
      },
    ),
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
  coverInfos: File | null;
  setCoverInfos: (image: File | null) => void;
  setActiveTab: (tab: string) => void;
  fields: FieldArrayWithId<FormValues, "ingredients">[];
  append: UseFieldArrayAppend<FormValues, "ingredients">;
  remove: UseFieldArrayRemove;
}>({
  form: {} as UseFormReturn<FormValues>,
  onSubmit: () => { },
  activeTab: "details",
  coverInfos: null,
  setCoverInfos: () => { },
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
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("details");
  const [coverInfos, setCoverInfos] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      preparationTime: 0,
      servings: 1,
      countryCode: "",
      ingredients: [{ ingredient: "", quantity: 1, unit: "" }],
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
    const res = await CallAPI(
      "POST",
      CallAPIURL.dishes.get,
      "",
      { userId: "f57ac297-c63e-43bb-bbcd-f176eea529d1", ...data },
      true,
    );

    const dish = res.data.response;

    // Add ingredients to dish
    await CallAPI(
      "POST",
      CallAPIURL.dishes.getIngredients(dish.id),
      "",
      data.ingredients,
      true,
    );

    if (!coverInfos) {
      toast.success("Recipe created successfully!");
      return;
    }

    if (!dish) {
      toast.error("An error occurred while creating the recipe");
      return;
    }

    const formattedName = dish.name.replace(/ /g, "_").toLowerCase();

    // Get a presigned URL from the API
    const presignedUrlData = await CallAPI(
      "GET",
      CallAPIURL.generatePresignedUrl.get +
      `?filename=covers/${formattedName}-${dish.id}.${coverInfos?.type?.split("/")[1]} `,
    );

    const presignedUrl = presignedUrlData.data.response;

    // Upload the image to S3
    fetch(presignedUrl.url, {
      method: "PUT",
      headers: {
        "Content-Type": coverInfos.type,
        "x-amz-acl": "public-read-write",
      },
      body: coverInfos,
    });

    const cleanedUrl = presignedUrl.url.split("?")[0];

    // Add the image to the dish
    await CallAPI(
      "POST",
      CallAPIURL.dishes.getById(dish.id) + `/images`,
      "",
      { link: cleanedUrl, isCover: true },
      true,
    );

    // Here you would typically send the data to your API
    // For now, we'll just show a success message and redirect
    toast.success("Recipe created successfully!");
    router.push("/recipes");
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

  useEffect(() => {
    if (coverInfos) {
      form.setValue("coverImage", coverInfos);
    }
  }, [coverInfos, form, activeTab]);

  return (
    <NewRecipeContext.Provider
      value={{
        form,
        onSubmit,
        activeTab,
        coverInfos,
        setCoverInfos,
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
