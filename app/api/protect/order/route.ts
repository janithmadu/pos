import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  try {
    const body = await req.json();

    const { userId, items, paymentMethod, transactionId } = body;

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Get product details and calculate total
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalPrice = 0;

    const orderItemsData = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for product: ${product.name}`);
      }

      const subtotal = Number(product.price) * item.quantity;
      totalPrice += subtotal;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      };
    });

    // Create the order and order items in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
        },
      });

      // Create order items
      for (const item of orderItemsData) {
        await tx.orderItem.create({
          data: {
            ...item,
            orderId: order.id,
          },
        });

        // Deduct inventory stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        // await tx.inventory.create({
        //   data: {
        //     productId: item.productId,
        //     change: -item.quantity,
        //     reason: `Sold in order ${order.id}`,
        //   },
        // });
      }

      // Optional: create payment
      let payment = null;
      if (paymentMethod) {
        payment = await tx.payment.create({
          data: {
            orderId: order.id,
            amount: totalPrice,
            method: paymentMethod,
            transactionId,
            status: "COMPLETED",
          },
        });
      }

      return { order, payment };
    });

    return NextResponse.json(
      { message: "Order created", ...result, product_items: products },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
