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
import { Textarea } from "./ui/textarea";

// Form management
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";

import { useState } from "react";
import { Label } from "./ui/label";
import CallAPI, { CallAPIURL } from "@/utils/CallAPI";

export default function RateModal({
  open,
  setOpen,
  dishId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  dishId: string;
}) {
  const [stars, setStars] = useState(5);
  const [idHover, setIdHover] = useState(5);

  const formSchema = z.object({
    stars: z.number().int().min(1).max(5),
    comment: z.string().max(500),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stars: 5,
      comment: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    const res = await CallAPI("POST", CallAPIURL.ratings.get, "", {
      userId: "f57ac297-c63e-43bb-bbcd-f176eea529d1",
      dishId: dishId,
      ...data,
    });
    if (res) {
      setOpen(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Rate this dish
            </DialogTitle>
            <DialogDescription className="text-center">
              If you have tried this recipe, please rate it below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="stars"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel className="text-md">Rating</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((i) => {
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                field.onChange(i); // Update the form value
                                setStars(i); // Update the local state for stars
                              }}
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel className="text-md">Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        name="comment"
                        className="resize-none h-32"
                        maxLength={500}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2 mt-4">
                <small className="text-end text-xs">0 / 500</small>

                <Button type="submit">Rate</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
