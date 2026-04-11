"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createProperty,
  updateProperty,
  uploadPropertyImage,
  type PropertyFormData,
} from "@/app/actions/admin";
import type { Property } from "@/app/types/property";

const inputClass =
  "w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sans text-sm";

const sectionHeaderClass =
  "px-8 py-6 border-b border-[#D9ECC8]/30 flex items-center gap-3 bg-linear-to-r from-[#D9ECC8]/10 to-transparent";

interface PropertyFormClientProps {
  mode: "create" | "edit";
  property?: Property;
}

export default function PropertyFormClient({
  mode,
  property,
}: PropertyFormClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(property?.title ?? "");
  const [price, setPrice] = useState<number | "">(property?.price ?? "");
  const [type, setType] = useState<"sale" | "rent" | "sold">(
    property?.type ?? "sale",
  );
  const [category, setCategory] = useState(property?.category ?? "apartment");
  const [location, setLocation] = useState(property?.location ?? "");
  const [description, setDescription] = useState(property?.description ?? "");
  const [beds, setBeds] = useState(property?.beds ?? 1);
  const [baths, setBaths] = useState(property?.baths ?? 1);
  const [parking, setParking] = useState(property?.parking ?? 0);
  const [size, setSize] = useState<number | "">(property?.size ?? "");
  const [yearBuilt, setYearBuilt] = useState<number | "">(
    property?.year_built ?? "",
  );
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>(
    property?.amenities ?? [],
  );
  const [images, setImages] = useState<string[]>(property?.images ?? []);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function counter(value: number, setter: (v: number) => void, min = 0) {
    return (
      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setter(Math.max(min, value - 1))}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100"
        >
          -
        </button>
        <span className="w-10 text-center text-sm font-medium text-[#19322F] font-sans">
          {value}
        </span>
        <button
          type="button"
          onClick={() => setter(value + 1)}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100"
        >
          +
        </button>
      </div>
    );
  }

  async function handleImageFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const { url, error: upError } = await uploadPropertyImage(fd);
      if (url) uploaded.push(url);
      else if (upError) console.error("Upload error:", upError);
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploadingImages(false);
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  function addAmenity() {
    const trimmed = amenityInput.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
    }
    setAmenityInput("");
  }

  function removeAmenity(a: string) {
    setAmenities((prev) => prev.filter((x) => x !== a));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title || price === "") {
      setError("Title and price are required.");
      return;
    }

    const formData: PropertyFormData = {
      title,
      price: Number(price),
      type,
      category: category || null,
      location,
      description: description || null,
      beds,
      baths,
      parking,
      size: Number(size) || 0,
      year_built: yearBuilt !== "" ? Number(yearBuilt) : null,
      amenities,
      images,
    };

    setSubmitting(true);

    if (mode === "create") {
      const { error: err } = await createProperty(formData);
      if (err) {
        setError(err);
        setSubmitting(false);
        return;
      }
    } else if (property) {
      const { error: err } = await updateProperty(property.id, formData);
      if (err) {
        setError(err);
        setSubmitting(false);
        return;
      }
    }

    router.push("/admin/properties");
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
              <li>
                <Link
                  href="/admin/properties"
                  className="hover:text-[#006655] transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <span className="material-icons text-xs text-gray-400">
                  chevron_right
                </span>
              </li>
              <li aria-current="page" className="text-[#19322F]">
                {mode === "create" ? "Add New" : "Edit"}
              </li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#19322F] tracking-tight mb-2">
              {mode === "create" ? "Add New Property" : "Edit Property"}
            </h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal">
              Fill in the details below to{" "}
              {mode === "create"
                ? "create a new listing"
                : "update the listing"}
              . Fields marked with * are mandatory.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/properties"
            className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-[#19322F] hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="property-form"
            disabled={submitting || uploadingImages}
            className="px-5 py-2.5 rounded-lg bg-[#006655] hover:bg-[#19322F] text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-60"
          >
            <span className="material-icons text-sm">save</span>
            {submitting ? "Saving…" : "Save Property"}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form
        id="property-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
      >
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="xl:col-span-8 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={sectionHeaderClass}>
              <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
                <span className="material-icons text-lg">info</span>
              </div>
              <h2 className="text-xl font-bold text-[#19322F]">
                Basic Information
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-[#19322F] mb-1.5"
                >
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="e.g. Modern Penthouse with Ocean View"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-[#19322F] mb-1.5"
                  >
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      $
                    </span>
                    <input
                      id="price"
                      type="number"
                      required
                      min={0}
                      placeholder="0"
                      value={price}
                      onChange={(e) =>
                        setPrice(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      className={`${inputClass} pl-7`}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-[#19322F] mb-1.5"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as "sale" | "rent" | "sold")
                    }
                    className={inputClass}
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-[#19322F] mb-1.5"
                  >
                    Property Type
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={sectionHeaderClass}>
              <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
                <span className="material-icons text-lg">description</span>
              </div>
              <h2 className="text-xl font-bold text-[#19322F]">Description</h2>
            </div>
            <div className="p-8">
              <textarea
                id="description"
                rows={8}
                placeholder="Describe the property features, neighborhood, and unique selling points…"
                value={description}
                maxLength={2000}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-sm leading-relaxed resize-y min-h-50"
              />
              <div className="mt-2 text-right text-xs text-gray-400">
                {description.length} / 2000 characters
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={sectionHeaderClass}>
              <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
                <span className="material-icons text-lg">checklist</span>
              </div>
              <h2 className="text-xl font-bold text-[#19322F]">Amenities</h2>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder='e.g. "Swimming Pool"'
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAmenity();
                    }
                  }}
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2.5 rounded-md bg-[#006655] text-white text-sm font-medium hover:bg-[#19322F] transition-colors"
                >
                  Add
                </button>
              </div>
              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <span
                      key={a}
                      className="flex items-center gap-1.5 bg-[#D9ECC8] text-[#19322F] text-xs font-medium px-3 py-1.5 rounded-full"
                    >
                      {a}
                      <button
                        type="button"
                        onClick={() => removeAmenity(a)}
                        className="text-[#006655] hover:text-red-500 transition-colors"
                      >
                        <span className="material-icons text-xs">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-[#D9ECC8]/30 flex justify-between items-center bg-linear-to-r from-[#D9ECC8]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
                  <span className="material-icons text-lg">image</span>
                </div>
                <h2 className="text-xl font-bold text-[#19322F]">Gallery</h2>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                JPG, PNG, WEBP · max 5 MB
              </span>
            </div>
            <div className="p-8 space-y-6">
              <div
                className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-[#D9ECC8]/10 hover:border-[#006655]/40 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageFiles(e.target.files)}
                />
                <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#006655] group-hover:scale-110 transition-transform duration-300">
                    <span className="material-icons text-2xl">
                      {uploadingImages ? "hourglass_top" : "cloud_upload"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-[#19322F]">
                      {uploadingImages
                        ? "Uploading…"
                        : "Click or drag images here"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Max file size 5 MB per image
                    </p>
                  </div>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((url, idx) => (
                    <div
                      key={url}
                      className="aspect-square rounded-lg overflow-hidden relative group shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Property image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-[#006655] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                          Main
                        </span>
                      )}
                      <div className="absolute inset-0 bg-[#19322F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <div className="xl:col-span-4 space-y-8">
          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#D9ECC8]/30 flex items-center gap-3 bg-linear-to-r from-[#D9ECC8]/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
                <span className="material-icons text-lg">place</span>
              </div>
              <h2 className="text-lg font-bold text-[#19322F]">Location</h2>
            </div>
            <div className="p-6">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-[#19322F] mb-1.5"
              >
                Address
              </label>
              <input
                id="location"
                type="text"
                placeholder="Street Address, City, Zip"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-[#D9ECC8]/30 flex items-center gap-3 bg-linear-to-r from-[#D9ECC8]/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#19322F]">
                <span className="material-icons text-lg">straighten</span>
              </div>
              <h2 className="text-lg font-bold text-[#19322F]">Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="size"
                    className="block text-xs text-gray-500 font-medium mb-1"
                  >
                    Area (m²)
                  </label>
                  <input
                    id="size"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={size}
                    onChange={(e) =>
                      setSize(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 text-[#19322F] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="yearBuilt"
                    className="block text-xs text-gray-500 font-medium mb-1"
                  >
                    Year Built
                  </label>
                  <input
                    id="yearBuilt"
                    type="number"
                    min={1800}
                    max={new Date().getFullYear() + 5}
                    placeholder="YYYY"
                    value={yearBuilt}
                    onChange={(e) =>
                      setYearBuilt(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 text-[#19322F] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-sm"
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#19322F] flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">
                      bed
                    </span>
                    Bedrooms
                  </label>
                  {counter(beds, setBeds, 0)}
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#19322F] flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">
                      shower
                    </span>
                    Bathrooms
                  </label>
                  {counter(baths, setBaths, 0)}
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#19322F] flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">
                      directions_car
                    </span>
                    Parking
                  </label>
                  {counter(parking, setParking, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
