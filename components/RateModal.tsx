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

export default function RateModal() {
  const [stars, setStars] = useState(1);
  const [idHover, setIdHover] = useState(1);

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
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
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
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
