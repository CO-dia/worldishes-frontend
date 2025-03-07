import { UUID } from "crypto";
import { User } from "./user";

export interface Dish {
    id: UUID;
    name: string;
    description: string;
    preparationTime: number;
    recipe: string;
    countryCode: string;
    youtubeLink: string;
    ratingAverage: number;
    user?: User;
}