import { UUID } from "crypto";
import { User } from "./user";

export interface Dish {
  id: UUID;
  name: string;
  description: string;
  preparationTime: number;
  servings: number;
  recipe: string;
  countryCode: string;
  coverImageUrl: string;
  youtubeLink: string;
  ratingAverage: number;
  ratingCount: number;
  anonymous: boolean;
  user?: User;
}
