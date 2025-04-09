import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
//Create
export const POST = async (req: Request) => {
  const { name, description } = await req.json();

  try {
    if (!name) {
      return NextResponse.json({ error: "Name Required" }, { status: 401 });
    }

    //Add Category to database

    await prisma.category.create({
      data: {
        name,
        description,
      },
    });
    return NextResponse.json(
      { messege: "Category Addin Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

//Get

export const GET = async () => {
  try {
    //Get Category From Databse
    const getCategory = await prisma.category.findMany({
      include: {
        products: true,
      },
    });
    return NextResponse.json({ getCategory }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

//Update

export const PATCH = async (req: Request) => {
  const { id, name, description } = await req.json();
  try {
    //Update Category
    await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        description: description,
      },
    });
    return NextResponse.json(
      { messege: "Category Updte Success" },
      { status: 200 }
    );
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
};

//Delete

export const DELETE = async (req: Request) => {
  const { id } = await req.json();
  //Delete Category
  try {
    await prisma.category.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      { messege: "Category Delete Success" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
