import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FaStarHalfAlt, FaStar, FaRegStar } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Form } from "./ui/form";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

export default function RateModal() {
  const [stars, setStars] = useState(5);
  const [idHover, setIdHover] = useState(5);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Rate</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate this dish</DialogTitle>
            <DialogDescription>
              If you have tried this recipe, please rate it below.
            </DialogDescription>
          </DialogHeader>

          <Form>
            <div className="flex gap-2" onMouseLeave={() => setIdHover(stars)}>
              {[1, 2, 3, 4, 5].map((i) => {
                return (
                  <button
                    onClick={() => setStars(i)}
                    className="text-3xl"
                    onMouseEnter={() => setIdHover(i)}
                  >
                    {i <= idHover ? (
                      <FaStar className="text-amber-600" />
                    ) : (
                      <FaRegStar className="text-amber-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <Label>Comment</Label>

            <Textarea name="comment" />

            <Button type="submit">Rate</Button>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
