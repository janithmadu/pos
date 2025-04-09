"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Category,
  CategoryAddinFormZodSchema,
} from "../ProductAddingForm/ProductAddinFormZodSchema";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function CategoryAddingForm() {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  //React Hook Form and zod validation start

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Category>({
    resolver: zodResolver(CategoryAddinFormZodSchema),
  });

  //React Hook Form and zod validation end

  //Submit Data to the API backend Start

  const onSubmit: SubmitHandler<Category> = (data) => {
    console.log(data);
  };

  //Submit Data to the API backend End

  return (
    <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid w-full gap-4">
            <div className="grid gap-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input defaultValue={field.name} {...field} />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoryDescription">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.description?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Category</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryAddingForm;
