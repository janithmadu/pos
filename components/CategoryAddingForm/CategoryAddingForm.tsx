"use client";

import { useEffect, useState } from "react";
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
import { Edit, Plus, Trash } from "lucide-react";
import {
  Category,
  CategoryAddinFormZodSchema,
} from "../ProductAddingForm/ProductAddinFormZodSchema";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTokenStore } from "@/stores/useTokenStore";
import CategoryTable from "./CategoryTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useCategoryStore } from "@/stores/useCategoryStore";
import Swal from "sweetalert2";

function CategoryAddingForm() {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const generateToken = useTokenStore((state) => state.generateNewToken);
  const token = useTokenStore((state) => state.accessToken);
  const category = useCategoryStore((state) => state.categories);
  const [isUpdateing, setisUpdateing] = useState(false);

  //React Hook Form and zod validation start

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<Category>({
    resolver: zodResolver(CategoryAddinFormZodSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
    },
  });

  //React Hook Form and zod validation end

  //Submit Data to the API backend Start

  const onSubmit: SubmitHandler<Category> = async (data) => {
    //Create a API route for create category

    try {
      //Authenticate API

      const response = await fetch("/api/protect/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success("Category added successfully!");
        reset();
      }
      if (response.status === 409) {
        toast.error("Category already exists!");
      }
    } catch (error) {
      toast.error("Failed to add category. Please try again.");
    }
  };

  //Submit Data to the API backend End

  //Update Category Start

  const updateCategory = async () => {
    const name = getValues("name");
    const description = getValues("description");
    const id = getValues("id");

    try {
      const response = await fetch("/api/protect/category", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          description: description,
          id: id,
        }),
      });
      if (response.ok) {
        toast.success("Category updated successfully!");
        reset();
        setisUpdateing(false);
      }
    } catch (error) {
      toast.error("Failed to update category. Please try again.");
    }
  };

  // Update Category End

  //Delete Category Start
  const deleteCategory = async () => {
    setIsCategoryDialogOpen(false);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#555",
    });

    if (result.isConfirmed) {
      const id = getValues("id");
      try {
        const response = await fetch("/api/protect/category", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: id,
          }),
        });
        if (response.ok) {
          toast.success("Category deleted successfully!");
        }
      } catch (error) {
        toast.error("Failed to delete category. Please try again.");
      }
    }
  };
  // Delete Category End

  // Token Generation Start
  useEffect(() => {
    generateToken();
  }, [generateToken]);
  // Token Generation End

  return (
    <Dialog  open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <div className="grid w-full gap-4">
            <div className="grid gap-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
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
            {isUpdateing && (
              <Button
                variant="outline"
                className="border-red-600"
                type="button"
                onClick={() => {
                  setisUpdateing(false);
                  setValue("name", "");
                  setValue("description", "");
                  setValue("id", "");
                }}
              >
                Reset
              </Button>
            )}
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsCategoryDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            {isUpdateing ? (
              <Button onClick={updateCategory} type="button">
                Update Category
              </Button>
            ) : (
              <Button type="submit">Add Category</Button>
            )}
          </div>
        </form>

        {/* Category Showing Table */}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.map((cate: Category) => (
              <TableRow key={cate.id}>
                <TableCell className="font-medium">{cate.name}</TableCell>
                <TableCell>{cate.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-x-4 justify-end">
                    <Edit
                      className="cursor-pointer"
                      onClick={() => {
                        setisUpdateing(true);
                        setValue("name", cate.name);
                        setValue("description", cate.name);
                        setValue("id", cate.id);
                      }}
                      width={17}
                    />
                    <Trash
                      className="cursor-pointer"
                      onClick={() => {
                        setValue("id", cate.id);
                        deleteCategory();
                      }}
                      width={17}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Category Showing Table End */}
      </DialogContent>
    </Dialog>
  );
}

export default CategoryAddingForm;
