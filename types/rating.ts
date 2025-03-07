import { UUID } from "crypto";
import { User } from "./user";

export interface Rating {
  id: UUID;
  user: User;
  dishId: UUID;
  stars: number;
  comment: string;
}
