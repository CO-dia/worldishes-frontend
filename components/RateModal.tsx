import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FaStar, FaRegStar } from "react-icons/fa";

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
            <DialogTitle className="text-2xl text-center">
              Rate this dish
            </DialogTitle>
            <DialogDescription className="text-center">
              If you have tried this recipe, please rate it below.
            </DialogDescription>
          </DialogHeader>

          {/*<Form> */}
          <div className="flex gap-2" onMouseLeave={() => setIdHover(stars)}>
            {[1, 2, 3, 4, 5].map((i) => {
              return (
                <button
                  key={i}
                  onClick={() => setStars(i)}
                  className="text-3xl"
                  onMouseEnter={() => setIdHover(i)}
                >
                  {i <= idHover ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <FaRegStar className="text-yellow-500" />
                  )}
                </button>
              );
            })}
          </div>

          <Label htmlFor="comment">Comment</Label>

          <Textarea
            name="comment"
            className="resize-none h-32"
            maxLength={500}
          />

          <small className="text-end text-xs">0 / 500</small>

          <Button type="submit">Rate</Button>
          {/*</Form>*/}
        </DialogContent>
      </Dialog>
    </>
  );
}
