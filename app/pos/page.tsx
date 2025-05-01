"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  CreditCard,
  Banknote,
} from "lucide-react";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { Category } from "@/components/ProductAddingForm/ProductAddinFormZodSchema";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTokenStore } from "@/stores/useTokenStore";

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

interface CartItem extends Product {
  quantity: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const getProduct = useProductStore((state) => state.products);
  const fetchProduct = useProductStore((state) => state.fetchProducts);
  const category = useCategoryStore((state) => state.categories);
  const [Modle, setModle] = useState<boolean>(false);
  const token = useTokenStore((state) => state.accessToken);

  const filteredProducts = getProduct.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || product.category.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const getCartProduct = cart.filter((cartItem) => {
      return cartItem.id === product.id;
    });
    if (getCartProduct.length === 0) {
      setCart((currentCart) => {
        const existingItem = currentCart.find((item) => item.id === product.id);
        if (existingItem) {
          return currentCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...currentCart, { ...product, quantity: 1 }];
      });
      return null;
    } else {
      if (product.stock > getCartProduct[0]?.quantity) {
        setCart((currentCart) => {
          const existingItem = currentCart.find(
            (item) => item.id === product.id
          );
          if (existingItem) {
            return currentCart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
          return [...currentCart, { ...product, quantity: 1 }];
        });
      } else {
        toast.error("Oops! This product is currently out of stock.");
      }
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const products = getProduct.filter((product) => {
      return product.id === productId;
    });
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    if (products[0].stock >= newQuantity) {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      toast.error("Oops! This product is currently out of stock.");
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // TO perform orader need product ID, user ID, quantity, paymentMethod transaction ID

  const createOrder = async (method: string) => {
    if (cart.length === 0) {
      toast.error("No products in the cart!");
    }

    const productDetails = cart.map((car) => {
      return { productId: car.id, quantity: car.quantity };
    });

    try {
      const createOrder = await fetch("/api/protect/order", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: "1221312sdfsdfe213123",
          items: productDetails,
          paymentMethod: method,
          transactionId: null,
        }),
      });

      const response = await createOrder.json();
      console.log(response);
      if (createOrder.ok) {
        toast.success("Order created successfully!  ");
        fetchProduct(token as string);
        setCart([]);
        printOrderResponse(response)
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.log(error);
      setCart([]);
    }
  };

  const printOrderResponse = (response: any) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow?.document.write('<html><head><title>Order Confirmation</title></head><body>');
    printWindow?.document.write('<h1>Order Confirmation</h1>');
    printWindow?.document.write(`<pre>${JSON.stringify(response, null, 2)}</pre>`);
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="flex h-screen">
      {/* Products Section */}
      <div className="flex-1 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="max-w-[600px] custom-scroll overflow-x-auto whitespace-nowrap flex gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className="min-w-max px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              All
            </button>
            {category.map((cate) => (
              <button
                key={cate.id}
                onClick={() => setActiveCategory(cate.name)}
                className="min-w-max px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
              >
                {cate.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid  max-h-[460px] overflow-y-scroll  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`${
                product.stock <= 0
                  ? " hover:shadow-lg transition-shadow"
                  : "cursor-pointer hover:shadow-lg transition-shadow"
              }`}
              onClick={() => {
                if (product.stock <= 0) {
                  return null;
                } else {
                  addToCart(product);
                }
              }}
            >
              <CardContent className="p-4">
                {product.stock > 0 ? (
                  <></>
                ) : (
                  <div className=" flex justify-end items-center">
                    <h1 className="text-xs text-end mb-2 bg-red-700 p-1 rounded-full ">
                      Out of Stock
                    </h1>
                  </div>
                )}

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  LKR.{product.price}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-[400px] border-l bg-muted/30">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Current Order</h2>
          </div>

          <ScrollArea className="flex-1 p-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center mb-4 bg-background rounded-lg p-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-3">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-auto"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>

          <div className="border-t p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>LKR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>LKR {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>LKR {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button variant="outline" className="w-full">
                <Receipt className="mr-2 h-4 w-4" />
                Print
              </Button>

              <Dialog open={Modle} onOpenChange={setModle}>
                <DialogTrigger className="flex justify-center items-center rounded-lg bg-white">
                  <CreditCard className="mr-2 h-4 w-4 text-black" />
                  <h1 className="text-black font-bold">Pay</h1>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Choose a payment method.</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-between">
                    <Card
                      onClick={() => {
                        createOrder("CARD");
                        setModle(false);
                      }}
                      className="cursor-pointer"
                    >
                      <CardContent className="p-3 flex flex-col justify-center items-center ">
                        <CreditCard />
                        <h1>Card Payment</h1>
                      </CardContent>
                    </Card>

                    <Card
                      onClick={() => {
                        createOrder("CASH");
                        setModle(false);
                      }}
                      className="cursor-pointer"
                    >
                      <CardContent className="p-3 flex flex-col justify-center items-center ">
                        <Banknote />
                        <h1>Cash Payment</h1>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
