"use client";
import { useUserAuth } from "@/app/context/AuthContext";
import React, { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Upload, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";

const ProductForm = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { user, supabase }: any = useUserAuth();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [fixingDesc, setFixingDesc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(event.target.files || []);
    setImageFiles(fileList);
    setImagePreviews(fileList.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index: number) => {
    setImageFiles((p) => p.filter((_, i) => i !== index));
    setImagePreviews((p) => p.filter((_, i) => i !== index));
  };

  const handleUpload = async (id: string, pid: string, files: File[]) => {
    try {
      const uploads = files.map(async (file) => {
        const { error } = await supabase.storage
          .from("images")
          .upload(`${id}/${pid}/${file.name}`, file, {
            cacheControl: "3600",
            upsert: false,
          });
        if (error) throw error;
        return `${process.env.STORAGE_PREFIX_URL}/${id}/${pid}/${file.name}`;
      });
      return await Promise.all(uploads);
    } catch (error: any) {
      console.error("Upload error:", error.message);
      return [];
    }
  };

  const fixDescription = async () => {
    if (!description) return;
    setFixingDesc(true);
    try {
      const res = await fetch("/api/fixText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: description }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setDescription(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("AI error:", error);
    } finally {
      setFixingDesc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) return;
    if (isNaN(Number(price))) {
      toast({
        title: "Invalid price",
        description: "Enter a valid number.",
        className: "bg-red-600 text-white",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          price,
          description,
          ownerId: user?.id,
        }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const message = await res.json();
      const productId = message.product.id;
      const uploadedImageUrls = await handleUpload(
        user.id,
        productId,
        imageFiles,
      );
      if (uploadedImageUrls.length > 0) {
        await fetch("/api/product/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: productId, images: uploadedImageUrls }),
        });
      }
      toast({
        title: "Item listed!",
        description: "Your listing is now live.",
        className: "bg-green-700 text-white",
      });
      router.push("/");
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const CATEGORIES = [
    "Smartphones",
    "Households",
    "Electronics",
    "Stationary",
    "Others",
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--ds-background-200)" }}
    >
      {/* Page header */}
      <div
        className="border-b relative overflow-hidden"
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 dot-grid"
          style={{ opacity: 0.4 }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,255,255,0.02) 0%, transparent 70%)"
              : "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(0,0,0,0.03) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="animate-fade-up">
            <span className="section-label block mb-3">New listing</span>
            <h1
              className="text-[28px] font-semibold tracking-tight"
              style={{ color: "var(--ds-gray-900)", letterSpacing: "-0.03em" }}
            >
              List an item
            </h1>
            <p
              className="text-[13.5px] mt-2"
              style={{ color: "var(--ds-gray-700)" }}
            >
              Fill in the details below. Your item will be live in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-lg px-4 py-10 animate-fade-up animation-delay-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Card wrapper */}
          <div
            className="rounded-[14px] p-6 space-y-5"
            style={{
              background: "var(--ds-background-100)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
              boxShadow: `0 0 0 1px ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}, 0 2px 12px rgba(0,0,0,0.04)`,
            }}
          >
            {/* Title */}
            <Field label="Title">
              <input
                id="title"
                type="text"
                className="geist-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Samsung Galaxy S21, Calculus textbook..."
                required
              />
            </Field>

            {/* Description */}
            <Field label="Description">
              <div className="relative">
                <input
                  id="description"
                  type="text"
                  className="geist-input"
                  style={{ paddingRight: 36 }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe condition, usage, and any flaws..."
                  required
                />
                <button
                  type="button"
                  onClick={fixDescription}
                  disabled={fixingDesc || !description}
                  title="Enhance with AI"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[5px] p-1 transition-colors duration-150 disabled:opacity-30"
                  style={{ color: "var(--ds-gray-600)" }}
                  onMouseEnter={(e) => {
                    if (!fixingDesc && description)
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--ds-blue-700)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--ds-gray-600)";
                  }}
                >
                  <Sparkles
                    size={13}
                    className={fixingDesc ? "animate-pulse" : ""}
                  />
                </button>
              </div>
              <p
                className="text-[11px] mt-1.5"
                style={{ color: "var(--ds-gray-600)" }}
              >
                Tap ✦ to improve your description with AI
              </p>
            </Field>

            {/* Category */}
            <Field label="Category">
              <select
                id="category"
                className="geist-input cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === "Households" ? "Household" : c}
                  </option>
                ))}
              </select>
            </Field>

            {/* Price */}
            <Field label="Price (₹)">
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] select-none"
                  style={{ color: "var(--ds-gray-600)" }}
                >
                  ₹
                </span>
                <input
                  id="price"
                  type="text"
                  inputMode="numeric"
                  className="geist-input"
                  style={{ paddingLeft: 22 }}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </Field>
          </div>

          {/* Image upload card */}
          <div
            className="rounded-[14px] p-6 space-y-4"
            style={{
              background: "var(--ds-background-100)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
              boxShadow: `0 0 0 1px ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}, 0 2px 12px rgba(0,0,0,0.04)`,
            }}
          >
            <p className="section-label">Images</p>

            {/* Drop zone */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-[10px] flex flex-col items-center justify-center py-8 gap-3 transition-all duration-150 cursor-pointer group"
              style={{
                border: `1.5px dashed ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
                background: isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.015)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = isDark
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(0,0,0,0.2)";
                (e.currentTarget as HTMLElement).style.background = isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.025)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = isDark
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(0,0,0,0.12)";
                (e.currentTarget as HTMLElement).style.background = isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.015)";
              }}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center transition-colors duration-150"
                style={{
                  background: "var(--ds-gray-200)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                }}
              >
                <Upload
                  size={16}
                  strokeWidth={1.5}
                  style={{ color: "var(--ds-gray-800)" }}
                />
              </div>
              <div className="text-center">
                <p
                  className="text-[13px] font-medium"
                  style={{ color: "var(--ds-gray-900)" }}
                >
                  Click to upload images
                </p>
                <p
                  className="text-[11.5px] mt-0.5"
                  style={{ color: "var(--ds-gray-600)" }}
                >
                  PNG, JPG, WEBP · up to 10 MB each
                </p>
              </div>
              <input
                type="file"
                id="images"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                multiple
                required={imageFiles.length === 0}
              />
            </button>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {imagePreviews.map((preview, i) => (
                  <div
                    key={i}
                    className="relative group rounded-[8px] overflow-hidden"
                    style={{
                      aspectRatio: "1",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                    }}
                  >
                    <Image
                      src={preview}
                      alt={`Preview ${i + 1}`}
                      fill
                      sizes="(min-width: 1024px) 120px, (min-width: 640px) 96px, 22vw"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      style={{ background: "rgba(0,0,0,0.5)" }}
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50"
            style={{ height: 40, fontSize: 13.5, borderRadius: 10, gap: 8 }}
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Listing your item...
              </>
            ) : (
              "List item →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="section-label block mb-2" style={{ marginBottom: 6 }}>
      {label}
    </label>
    {children}
  </div>
);

export default ProductForm;
