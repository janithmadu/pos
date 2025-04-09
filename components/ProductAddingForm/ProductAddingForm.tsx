import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Product,
  ProductAddinFormZodSchema,
} from "./ProductAddinFormZodSchema";
// import { useCategoryStore } from "@/stores/useCategoryStore";


function ProductAddingForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Product>({
    resolver: zodResolver(ProductAddinFormZodSchema),
  });

  const onSubmit: SubmitHandler<Product> = (data) => {
    console.log(data);
    setIsDialogOpen(false);
    reset();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[700px] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
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
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* {categories.map((category) => (
                        <SelectItem id={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="minStock">Minimum Stock Level</Label>
              <Controller
                name="minStock"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
              {errors.minStock && (
                <p className="text-red-500 text-sm">
                  {errors.minStock.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Controller
                name="sku"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.sku && (
                <p className="text-red-500 text-sm">{errors.sku.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => <Input {...field} type="url" />}
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductAddingForm;
