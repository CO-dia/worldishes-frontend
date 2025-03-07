import { UUID } from "crypto";

export interface Ingredient {
  id: UUID;
  dishId: UUID;
  ingredient: string;
  quantity: number;
  unit: string;
}
