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
