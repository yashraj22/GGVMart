"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProductCards from "./ProductCards";

// const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

// type SheetSide = (typeof SHEET_SIDES)[number];

export function ProductSideSheet() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {/* {SHEET_SIDES.map((side) => ( */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">{"Products"}</Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Select Product</SheetTitle>
            <SheetDescription>
              Select Product whose chat you want to see.
            </SheetDescription>
          </SheetHeader>
          {/* <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div> */}
          <div className="flex flex-col">
            <ProductCards />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              {/* <Button type="submit">Save changes</Button> */}
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {/* ))} */}
    </div>
  );
}

export default ProductSideSheet;
