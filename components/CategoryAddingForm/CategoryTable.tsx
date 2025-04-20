import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { Category } from "../ProductAddingForm/ProductAddinFormZodSchema";
import { Button } from "../ui/button";
import { Edit, Trash } from "lucide-react";

function CategoryTable() {
  
  return (
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
                  onClick={() => alert(cate.id)}
                  width={17}
                />
                <Trash
                  className="cursor-pointer"
                  onClick={() => alert(cate.id)}
                  width={17}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default CategoryTable;
