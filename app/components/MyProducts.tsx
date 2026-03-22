"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  Tag,
  Trash2,
  Pencil,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import ChatWithSeller from "./ChatWithSeller";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useUserAuth } from "../context/AuthContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Product = {
  id: string;
  title: string;
  category: string;
  price: string;
  description: string;
  images: string[];
  ownerId: string;
};

const CATEGORIES = [
  "Smartphones",
  "Households",
  "Electronics",
  "Stationary",
  "Others",
];

const MyProducts = ({
  onAdsLoaded,
}: {
  onAdsLoaded: (count: number) => void;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { user, loading, supabase }: any = useUserAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      setProducts([]);
      onAdsLoaded(0);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/product/myproduct/${user.identities[0].user_id}`,
        );
        const data = await response.json();
        const nextProducts = (data.products || []).map(normalizeProduct);
        setProducts(nextProducts);
        onAdsLoaded(nextProducts.length);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
        onAdsLoaded(0);
      }
    };

    fetchProducts();
  }, [loading, user, onAdsLoaded]);

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch("/api/product/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId }),
      });
      if (response.ok) {
        toast({
          title: "Listing removed",
          className: "bg-green-700 text-white",
        });
        setProducts((current) => {
          const nextProducts = current.filter(
            (product) => product.id !== productId,
          );
          onAdsLoaded(nextProducts.length);
          return nextProducts;
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSave = (updatedProduct: Product) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  };

  if (products.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            user={user}
            onDelete={handleDelete}
            onEdit={setEditingProduct}
          />
        ))}
      </div>

      <EditProductSheet
        product={editingProduct}
        user={user}
        supabase={supabase}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProduct(null);
          }
        }}
        onSave={handleSave}
      />
    </>
  );
};

const ProductCard = ({
  product,
  user,
  onDelete,
  onEdit,
}: {
  product: Product;
  user: any;
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="rounded-[12px] overflow-hidden flex flex-col"
      style={{
        background: "var(--ds-background-100)",
        border: "1px solid rgba(128,128,128,0.1)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(128,128,128,0.14), 0 4px 12px rgba(0,0,0,0.12), 0 16px 32px rgba(0,0,0,0.08)"
          : "0 0 0 1px rgba(128,128,128,0.06)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition:
          "border-color 150ms ease, box-shadow 200ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden"
        style={{ background: "var(--ds-gray-100)" }}
      >
        <Carousel className="w-full">
          <CarouselContent>
            {product.images.map((image: string, i: number) => (
              <CarouselItem key={i}>
                <div className="relative w-full h-[180px]">
                  <Image
                    src={image}
                    alt={`${product.title} - ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    style={{
                      transform: hovered ? "scale(1.04)" : "scale(1)",
                      transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {product.images.length > 1 && (
            <>
              <CarouselPrevious
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full transition-opacity duration-150"
                style={{
                  background: "rgba(128,128,128,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(128,128,128,0.15)",
                  color: "var(--ds-gray-900)",
                  opacity: hovered ? 1 : 0,
                }}
              />
              <CarouselNext
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full transition-opacity duration-150"
                style={{
                  background: "rgba(128,128,128,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(128,128,128,0.15)",
                  color: "var(--ds-gray-900)",
                  opacity: hovered ? 1 : 0,
                }}
              />
            </>
          )}
        </Carousel>
      </div>

      <div className="flex flex-col flex-grow p-4 gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <h2
            className="text-[13.5px] font-semibold leading-snug line-clamp-2 flex-1"
            style={{ color: "var(--ds-gray-900)", letterSpacing: "-0.01em" }}
          >
            {product.title}
          </h2>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1 rounded-[6px] flex-shrink-0 transition-all duration-150"
                  style={{
                    color: "#a8a8a8",
                    opacity: hovered ? 1 : 0,
                    background: "transparent",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#171717";
                    (e.currentTarget as HTMLElement).style.background =
                      "#f2f2f2";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#a8a8a8";
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  <MoreHorizontal size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-32 p-1 rounded-[10px]"
                style={{
                  border: "1px solid rgba(128,128,128,0.12)",
                  boxShadow:
                    "0 4px 16px rgba(0,0,0,0.15), 0 16px 40px rgba(0,0,0,0.1)",
                  background: "var(--ds-background-100)",
                  backdropFilter: "blur(20px)",
                }}
                align="end"
              >
                <DropdownMenuItem
                  onClick={() => onEdit(product)}
                  className="flex items-center gap-2 text-[12.5px] px-2 py-1.5 rounded-[6px] cursor-pointer"
                  style={{ color: "var(--ds-gray-900)" }}
                >
                  <Pencil size={11} />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(product.id)}
                  className="flex items-center gap-2 text-[12.5px] px-2 py-1.5 rounded-[6px] cursor-pointer"
                  style={{ color: "#c00" }}
                >
                  <Trash2 size={11} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <span
          className="badge badge-gray self-start"
          style={{ fontSize: 10.5 }}
        >
          <Tag size={9} />
          {product.category}
        </span>

        <p
          className="text-[12px] leading-relaxed line-clamp-2 flex-grow"
          style={{ color: "var(--ds-gray-700)" }}
        >
          {product.description}
        </p>

        <div
          className="flex items-center justify-between pt-2.5"
          style={{ borderTop: "1px solid rgba(128,128,128,0.08)" }}
        >
          <span
            className="text-[16px] font-semibold"
            style={{ color: "var(--ds-gray-900)", letterSpacing: "-0.02em" }}
          >
            Rs{Number(product.price).toLocaleString("en-IN")}
          </span>
          <ChatWithSeller productId={product.id} receiverId={product.ownerId} />
        </div>
      </div>
    </article>
  );
};

const EditProductSheet = ({
  product,
  user,
  supabase,
  onOpenChange,
  onSave,
}: {
  product: Product | null;
  user: any;
  supabase: any;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Product) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef<string[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!product) {
      previewUrlsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
      previewUrlsRef.current = [];
      setTitle("");
      setCategory("");
      setPrice("");
      setDescription("");
      setExistingImages([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      return;
    }

    setTitle(product.title);
    setCategory(product.category);
    setPrice(product.price);
    setDescription(product.description);
    setExistingImages(product.images || []);
    setNewImageFiles([]);
    setNewImagePreviews([]);
  }, [product]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));
    previewUrlsRef.current.push(...previews);
    setNewImageFiles((current) => [...current, ...files]);
    setNewImagePreviews((current) => [...current, ...previews]);
    event.target.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
    setNewImagePreviews((current) => {
      const previewToRemove = current[index];
      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove);
        previewUrlsRef.current = previewUrlsRef.current.filter(
          (preview) => preview !== previewToRemove,
        );
      }
      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const uploadImages = async (productId: string, files: File[]) => {
    const uploads = files.map(async (file, index) => {
      const safeName = file.name.replace(/\s+/g, "-");
      const filePath = `${user.id}/${productId}/${Date.now()}-${index}-${safeName}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      return `${process.env.STORAGE_PREFIX_URL}/${filePath}`;
    });

    return Promise.all(uploads);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!product) {
      return;
    }

    if (existingImages.length + newImageFiles.length === 0) {
      toast({
        title: "Add at least one image",
        description: "A listing needs one image to stay visible.",
        className: "bg-red-600 text-white",
      });
      return;
    }

    if (isNaN(Number(price))) {
      toast({
        title: "Invalid price",
        description: "Enter a valid number.",
        className: "bg-red-600 text-white",
      });
      return;
    }

    setSaving(true);
    try {
      const uploadedImages =
        newImageFiles.length > 0
          ? await uploadImages(product.id, newImageFiles)
          : [];
      const nextImages = [...existingImages, ...uploadedImages];

      const response = await fetch("/api/product/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          title,
          category,
          price,
          description,
          images: nextImages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const data = await response.json();
      const updatedProduct = normalizeProduct(data.product);
      onSave(updatedProduct);
      toast({
        title: "Listing updated",
        className: "bg-green-700 text-white",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Update failed",
        description: "Please try again.",
        className: "bg-red-600 text-white",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={Boolean(product)} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto"
        style={{
          background: "var(--ds-background-100)",
          borderLeft: "1px solid rgba(128,128,128,0.1)",
        }}
      >
        <SheetHeader className="pr-8">
          <SheetTitle style={{ color: "var(--ds-gray-900)" }}>
            Edit listing
          </SheetTitle>
          <SheetDescription style={{ color: "var(--ds-gray-700)" }}>
            Update your product details and images.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <EditField label="Title">
            <input
              type="text"
              className="geist-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </EditField>

          <EditField label="Description">
            <textarea
              className="geist-input min-h-28 resize-y"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </EditField>

          <EditField label="Category">
            <select
              className="geist-input cursor-pointer"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            >
              <option value="">Select a category...</option>
              {CATEGORIES.map((currentCategory) => (
                <option key={currentCategory} value={currentCategory}>
                  {currentCategory === "Households"
                    ? "Household"
                    : currentCategory}
                </option>
              ))}
            </select>
          </EditField>

          <EditField label="Price (Rs)">
            <input
              type="text"
              inputMode="numeric"
              className="geist-input"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </EditField>

          <div className="space-y-3">
            <label className="section-label block" style={{ marginBottom: 6 }}>
              Images
            </label>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-[10px] flex items-center justify-center gap-2 py-3 transition-all duration-150"
              style={{
                border: "1.5px dashed rgba(128,128,128,0.2)",
                background: "rgba(128,128,128,0.04)",
                color: "var(--ds-gray-800)",
              }}
            >
              <Upload size={14} />
              Add more images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {(existingImages.length > 0 || newImagePreviews.length > 0) && (
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((image, index) => (
                  <EditableImagePreview
                    key={`${image}-${index}`}
                    src={image}
                    label={`Current image ${index + 1}`}
                    onRemove={() => removeExistingImage(index)}
                  />
                ))}
                {newImagePreviews.map((image, index) => (
                  <EditableImagePreview
                    key={`${image}-${index}`}
                    src={image}
                    label={`New image ${index + 1}`}
                    onRemove={() => removeNewImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="btn-secondary flex-1"
              style={{ height: 38, fontSize: 13 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 disabled:opacity-60"
              style={{ height: 38, fontSize: 13, gap: 8 }}
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

const EditField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="section-label block" style={{ marginBottom: 6 }}>
      {label}
    </label>
    {children}
  </div>
);

const EditableImagePreview = ({
  src,
  label,
  onRemove,
}: {
  src: string;
  label: string;
  onRemove: () => void;
}) => (
  <div
    className="relative rounded-[10px] overflow-hidden"
    style={{
      aspectRatio: "1",
      border: "1px solid rgba(128,128,128,0.1)",
      background: "var(--ds-gray-100)",
    }}
  >
    <Image src={src} alt={label} fill className="object-cover" />
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
      }}
    >
      <X size={13} />
    </button>
  </div>
);

const normalizeProduct = (product: any): Product => ({
  ...product,
  images: Array.isArray(product?.images) ? product.images : [],
});

export default MyProducts;
