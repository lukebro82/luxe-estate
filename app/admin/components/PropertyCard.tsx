"use client";

import type { Property } from "@/app/types/property";

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: string) => void;
  onToggleFeatured?: (propertyId: string, featured: boolean) => void;
  dict?: any;
}

export default function PropertyCard({
  property,
  onEdit,
  onDelete,
  onToggleFeatured,
  dict,
}: PropertyCardProps) {
  const t = dict?.admin?.common || {
    beds: "Beds",
    baths: "Baths",
    sqft: "sqft",
    monthly: "Monthly",
  };
  const tp = dict?.admin?.properties || { monthly: "Monthly" };

  const getStatusBadge = (type: string) => {
    switch (type) {
      case "sale":
      case "active":
        return {
          bg: "bg-[#d9ecc8]",
          text: "text-[#006655]",
          label: "Active",
          border: "border border-[#b9d9a0]",
          dot: "bg-[#006655]",
        };
      case "rent":
      case "pending":
        return {
          bg: "bg-[#ffe8d6]",
          text: "text-[#ed6c02]",
          label: "Pending",
          border: "border border-[#fcd0a1]",
          dot: "bg-[#ed6c02]",
        };
      case "sold":
        return {
          bg: "bg-[#f3f4f6]",
          text: "text-[#5c706d]",
          label: "Sold",
          border: "border border-[#e5e7eb]",
          dot: "bg-[#5c706d]",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Inactive",
          border: "border border-gray-200",
          dot: "bg-gray-500",
        };
    }
  };

  const status = getStatusBadge(property.type);
  const priceFormat = property.price.toLocaleString("en-US");
  const monthlyRent =
    property.type === "rent"
      ? `Monthly: $${(property.price * 0.8).toLocaleString("en-US")}`
      : "";

  return (
    <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 bg-white border border-gray-100 rounded-xl hover:bg-background-light transition-colors items-center">
      {/* Property Image & Details */}
      <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
        <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-gray-200">
          {property.images?.[0] ? (
            <img
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={property.images[0]}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="material-icons text-gray-400 text-2xl">
                image
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-nordic-dark group-hover:text-primary transition-colors cursor-pointer">
            {property.title}
          </h3>
          <p className="text-sm text-nordic-muted">{property.location}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="material-icons text-sm">bed</span>{" "}
              {property.beds} {t.beds}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-1">
              <span className="material-icons text-sm">bathtub</span>{" "}
              {property.baths} {t.baths}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>
              {property.size.toLocaleString("en-US")} {t.sqft}
            </span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-6 md:col-span-2">
        <div className="text-base font-semibold text-nordic-dark">
          ${priceFormat}
        </div>
        {monthlyRent && (
          <div className="text-xs text-gray-400">
            {tp.monthly}: ${(property.price * 0.8).toLocaleString("en-US")}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="col-span-6 md:col-span-2">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[13px] font-medium ${status.border} ${status.bg} ${status.text}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-1.5`}
          ></span>
          {status.label}
        </span>
      </div>

      {/* Actions */}
      <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit?.(property)}
          className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-hint-green/30 transition-all"
          title="Edit Property"
        >
          <span className="material-icons text-xl">edit</span>
        </button>
        <button
          onClick={() => onDelete?.(property.id)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
          title="Delete Property"
        >
          <span className="material-icons text-xl">delete_outline</span>
        </button>
      </div>
    </div>
  );
}
