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
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useTokenStore } from "@/stores/useTokenStore";
import { toast } from "react-toastify";
import { useDialogStore } from "@/stores/useDialogBoxStore";
import { useProductStore } from "@/stores/useProductStore";

function ProductAddingForm() {
  //const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDialogOpen = useDialogStore((state) => state.isDialogOpen);
  const setIsDialogOpen = useDialogStore((state) => state.setIsDialogOpen);
  const categories = useCategoryStore((state) => state.categories);
  const loading = useCategoryStore((state) => state.loading);
  const error = useCategoryStore((state) => state.error);
  const hasFetched = useCategoryStore((state) => state.hasFetched);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const token = useTokenStore((state) => state.accessToken);
  const getSelectedProductId = useProductStore(
    (state) => state.selectedProductId
  );
  const setSelectedProductId = useProductStore(
    (state) => state.setSelectedProductId
  );
  const getProducts = useProductStore((state) => state.products);
  const [productName, setproductName] = useState<String>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Product>({
    resolver: zodResolver(ProductAddinFormZodSchema),
    defaultValues: {
      category: "",
      image: "",
      minStock: 0,
      name: "",
      price: 0,
      sku: "",
      stock: 0,
    },
  });

  //Get Category for adding product

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(token as string);
    return () => {
      controller.abort;
    };
  }, [token]);

  //End Get Category for adding product

  //Product Adding Function

  const onSubmit: SubmitHandler<Product> = async (data) => {
    const controller = new AbortController();
    setIsDialogOpen(false);

    try {
      //Create Product Using API

      const product = await fetch("/api/protect/product", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (product.ok) {
        toast.success("Product Added Successfully!");
        reset();
      } else {
        toast.error("Failed to add product");
      }

      //End Create Product Using API
      return () => controller.abort();
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
    }

    reset();
  };
  // End Product Adding Function

  //Set Product For Update
  useEffect(() => {
    //Filter Updateing Product
    const getUpdatingProduct = getProducts.filter((product) => {
      return product.id === getSelectedProductId;
    });
    setValue("id", getSelectedProductId as string);
    setValue("name", getUpdatingProduct[0]?.name);
    setValue("price", Number(getUpdatingProduct[0]?.price));
    setValue("stock", getUpdatingProduct[0]?.stock);
    setValue("minStock", getUpdatingProduct[0]?.minStock);
    setValue("sku", getUpdatingProduct[0]?.sku);
    setValue("image", getUpdatingProduct[0]?.image);
    setValue("category", getUpdatingProduct[0]?.category.id as string);
    setproductName(getUpdatingProduct[0]?.category.name);
  }, [getSelectedProductId]);
  //End Set Product For Update

  //Empty select product ID and open Dialog Box
  async function openDialog() {
    setIsDialogOpen(!isDialogOpen);
    setSelectedProductId("");
  }
  // End Empty select product ID and open Dialog Box

  // Start Update Product Using API

  const updateProduct: SubmitHandler<Product> = async (data) => {
    try {
      const response = await fetch("/api/protect/product", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        toast.success("Product updated successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // End Update Product Using API

  return (
    <Dialog open={isDialogOpen} onOpenChange={openDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {getSelectedProductId ? "Update Product" : "Add New Product"}{" "}
          </DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(
            getSelectedProductId ? updateProduct : onSubmit
          )}
        >
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
                      <SelectValue
                        placeholder={
                          productName ? productName : "Select Category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id as string}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
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
                    min="0"
                    onChange={(e) => {
                      // Handle empty input and invalid numbers
                      const value = e.target.value;
                      const num: any = value === "" ? null : parseFloat(value);
                      field.onChange(isNaN(num) ? null : num);
                    }}
                    value={field.value ?? ""} // Show empty string instead of null/undefined
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
                    onChange={(e) => {
                      // Handle empty input and invalid numbers
                      const value = e.target.value;
                      const num: any = value === "" ? null : parseFloat(value);
                      field.onChange(isNaN(num) ? null : num);
                    }}
                    value={field.value ?? ""} // Show empty string instead of null/undefined
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
                    onChange={(e) => {
                      // Handle empty input and invalid numbers
                      const value = e.target.value;
                      const num: any = value === "" ? null : parseFloat(value);
                      field.onChange(isNaN(num) ? null : num);
                    }}
                    value={field.value ?? ""} // Show empty string instead of null/undefined
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
            {getSelectedProductId === "" ? (
              <Button type="submit">Add Product</Button>
            ) : (
              <Button type="submit">Update Product</Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductAddingForm;
