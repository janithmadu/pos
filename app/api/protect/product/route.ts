import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
//Create
export const POST = async (req: Request) => {
  const { name, category, price, stock, sku, image, minStock } =
    await req.json();

  try {
    if (!name) {
      return NextResponse.json({ error: "Name Required" }, { status: 401 });
    }

    //Add product to database

    await prisma.product.create({
      data: {
        name,
        image,
        minStock,
        price,
        sku,
        stock,
        category: {
          connect: {
            id: category,
          },
        },
      },
    });
    return NextResponse.json(
      { messege: "Product Addin Success!" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target;

        const fields = Array.isArray(target) ? target.join(", ") : "field";
        const message = `A record with this ${fields} already exists.`;

        return NextResponse.json({ error: message }, { status: 400 });
      } else {
        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 500 }
        );
      }
    }
  } finally {
    await prisma.$disconnect();
  }
};

//Get

export const GET = async () => {
  try {
    //Get Product From Databse
    const getproduct = await prisma.product.findMany({
      include: {
        category: true,
        Inventory: true,
        orderItems: true,
      },
    });
    return NextResponse.json({ getproduct }, { status: 200 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

//Update

export const PATCH = async (req: Request) => {
  const { id, name, category, price, stock, sku, image, minStock } =
    await req.json();
  try {
    //Update Product
    await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name,
        category: {
          connect: {
            id: category,
          },
        },
        price,
        stock,
        sku,
        image,
        minStock,
      },
    });
    return NextResponse.json(
      { messege: "Product Updte Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

//Delete

export const DELETE = async (req: Request) => {
  const { id } = await req.json();
  //Delete Product
  try {
    await prisma.product.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      { messege: "Product Delete Success" },
      { status: 200 }
    );
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
};
