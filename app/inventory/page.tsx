"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  Search,
  Plus,
  AlertCircle,
  Package,
  PackageOpen,
  ArrowUpDown,
} from "lucide-react";
import ProductAddingForm from "@/components/ProductAddingForm/ProductAddingForm";
import CategoryAddingForm from "@/components/CategoryAddingForm/CategoryAddingForm";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  image: string;
  minStock: number;
  lastUpdated: string;
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Coffee Latte",
    category: "drinks",
    price: 4.99,
    stock: 150,
    sku: "COF001",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200",
    minStock: 100,
    lastUpdated: "2024-03-21",
  },
  {
    id: "2",
    name: "Americano",
    category: "drinks",
    price: 3.99,
    stock: 80,
    sku: "COF002",
    image: "https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?w=200",
    minStock: 100,
    lastUpdated: "2024-03-21",
  },
  {
    id: "3",
    name: "Croissant",
    category: "food",
    price: 2.99,
    stock: 45,
    sku: "BKY001",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200",
    minStock: 50,
    lastUpdated: "2024-03-21",
  },
  {
    id: "4",
    name: "Blueberry Muffin",
    category: "food",
    price: 3.49,
    stock: 30,
    sku: "BKY002",
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200",
    minStock: 40,
    lastUpdated: "2024-03-21",
  },
];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const handleSort = (key: keyof Product) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const filteredProducts = sortedProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
            <div className="text-2xl font-bold">{products.length}</div>
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Product Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center justify-end">
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("stock")}
              >
                <div className="flex items-center justify-end">
                  Stock
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">
                  ${product.price.toFixed(2)}
                </TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
