"use client";

import { useEffect, useState } from "react";
import { Editor, EditorState, convertFromRaw } from "draft-js";
import { Dish } from "@/types/dish";

const DisplayRecipe = ({ recipe }: { recipe: Dish}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (recipe?.recipe) {
      try {
        const rawContent = JSON.parse(recipe.recipe);
        setEditorState(
          EditorState.createWithContent(convertFromRaw(rawContent))
        );
      } catch (error) {
        console.error("Error parsing recipe JSON:", error);
      }
    }
  }, [recipe]);

  return <Editor editorState={editorState} readOnly onChange={() => {}} />;
};

export default DisplayRecipe;
