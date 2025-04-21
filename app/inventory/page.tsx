"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  AlertCircle,
  Package,
  PackageOpen,
  ArrowUpDown,
  Package2,
  Trash,
  Edit,
} from "lucide-react";
import ProductAddingForm from "@/components/ProductAddingForm/ProductAddingForm";
import CategoryAddingForm from "@/components/CategoryAddingForm/CategoryAddingForm";
import { Category } from "@/components/ProductAddingForm/ProductAddinFormZodSchema";
import { useProductStore } from "@/stores/useProductStore";
import { useTokenStore } from "@/stores/useTokenStore";
import { useDialogStore } from "@/stores/useDialogBoxStore";
import FullScreenLoader from "@/components/FullScreenLoader";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { toast } from "react-toastify";

interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  sku: string;
  image: string;
  minStock: number;
  lastUpdated: string;
}

export default function InventoryPage() {
  const generateToken = useTokenStore((state) => state.generateNewToken);
  const [loading, setloading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  // Token Generation Start
  useEffect(() => {
    generateToken();
  }, [generateToken]);
  // Token Generation End

  const token = useTokenStore((state) => state.accessToken);

  //Fetch Product
  useEffect(() => {
    setloading(true);
    if (!token) {
      return;
    }
    useProductStore.getState().fetchProducts(token);
    setloading(false);
  }, [token, setloading]);
  //End Fetch Product
  const getProduct = useProductStore((state) => state.products);

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const lowStockCount = products?.filter((p) => p.stock <= p.minStock).length;
  const totalItems = products?.reduce((sum, p) => sum + p.stock, 0);
  const setIsDialogOpen = useDialogStore((state) => state.setIsDialogOpen);
  const setProductID = useProductStore((state) => state.setSelectedProductId);

  const filteredProducts = getProduct?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  useEffect(() => {
    setProducts(getProduct);
  }, [getProduct]);

  //Delete Product Start

  async function deleteProduct(id: string) {
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
      setloading(true);
      try {
        const response = await fetch("/api/protect/product", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id }),
        });
        if (response.ok) {
          useProductStore.getState().fetchProducts(token as string);
          setloading(false);
          toast.success("Product Delete successfully");
        } else {
          toast.error("Failed to delete the product. Please try again.");
        }
      } catch (error) {
        toast.error(
          "An error occurred while trying to delete the product. Please try again later."
        );
      }
    }
  }
  //End Delete Product

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Inventory Management
        </h2>
        <div className="gap-x-3 flex flex-row ">
          <ProductAddingForm />
          <CategoryAddingForm />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Items in Stock
            </CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alerts
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {lowStockCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center">
                  Product Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center">
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer">
                <div className="flex items-center justify-end">
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer">
                <div className="flex items-center justify-end">
                  Stock
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {!product.image ? (
                    <Package2 />
                  ) : (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>

                <TableCell>{product.category.name}</TableCell>
                <TableCell className="text-right">Rs. {product.price}</TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      product.stock <= product.minStock
                        ? "destructive"
                        : "default"
                    }
                  >
                    {product.stock <= product.minStock
                      ? "Low Stock"
                      : "In Stock"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex gap-x-3 items-center justify-end">
                  <button onClick={() => deleteProduct(product.id)}>
                    <Trash />
                  </button>
                  <button
                    onClick={() => {
                      setProductID(product.id);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
