"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  Trash2,
  Plus,
  ArrowLeft,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceItem {
  id: string;
  title: string;
  quantity: string;
  unitPrice: string;
}

interface OfferData {
  service: string;
  serviceDetails: string;
  date: string;
  fromTime: string;
  toTime: string;
  discount: string;
  items: ServiceItem[];
}

type ModalView = "create" | "preview" | "sent" | "accept-reject";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function calcServiceTotal(items: ServiceItem[]) {
  return items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);
}

const SERVICE_OPTIONS = [
  {
    value: "plumbing",
    label: "Plumbing Services",
    category: "Personal/Home Services",
  },
  {
    value: "electrical",
    label: "Electrical Services",
    category: "Personal/Home Services",
  },
  {
    value: "cleaning",
    label: "Cleaning Services",
    category: "Personal/Home Services",
  },
  { value: "design", label: "UI/UX Design", category: "Digital Services" },
  { value: "dev", label: "Web Development", category: "Digital Services" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className='text-[13px] font-semibold text-gray-700 tracking-wide uppercase mb-1.5 block'>
      {children}
    </Label>
  );
}

function GreenButton({
  children,
  onClick,
  variant = "solid",
  className,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "outline";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50",
        variant === "solid"
          ? "bg-[#2d9b4f] text-white hover:bg-[#248042] active:scale-[0.98] shadow-md shadow-green-200"
          : "border-2 border-[#2d9b4f] text-[#2d9b4f] bg-white hover:bg-green-50 active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ─── Create Offer Modal ───────────────────────────────────────────────────────

function CreateOfferView({
  offerData,
  setOfferData,
  onPreview,
  onClose,
}: {
  offerData: OfferData;
  setOfferData: React.Dispatch<React.SetStateAction<OfferData>>;
  onPreview: () => void;
  onClose: () => void;
}) {
  const serviceTotal = calcServiceTotal(offerData.items);
  const discount = parseFloat(offerData.discount) || 0;
  const total = serviceTotal - discount;

  function updateItem(id: string, field: keyof ServiceItem, value: string) {
    setOfferData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addItem() {
    setOfferData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: generateId(), title: "", quantity: "", unitPrice: "" },
      ],
    }));
  }

  function removeItem(id: string) {
    setOfferData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition-all";

  return (
    <div className='flex flex-col max-h-[85vh]'>
      {/* Header */}
      <div className='flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100'>
        <h2 className='text-lg font-bold text-gray-900 tracking-tight'>
          Create Offer
        </h2>
        <button
          onClick={onClose}
          className='rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors'
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className='flex-1 overflow-y-auto px-6 py-5 space-y-5'>
        {/* Select Service */}
        <div>
          <FieldLabel>Select Service</FieldLabel>
          <Select
            value={offerData.service}
            onValueChange={(val) =>
              setOfferData((prev) => ({ ...prev, service: val }))
            }
          >
            <SelectTrigger className='w-full rounded-xl border-gray-200 bg-gray-50 h-11 text-sm focus:ring-green-100 focus:border-green-400 data-[placeholder]:text-gray-400'>
              <SelectValue placeholder='Select service' />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
              {SERVICE_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className='text-sm'
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Details */}
        <div>
          <FieldLabel>Service Details</FieldLabel>
          <Textarea
            value={offerData.serviceDetails}
            onChange={(e) =>
              setOfferData((prev) => ({
                ...prev,
                serviceDetails: e.target.value,
              }))
            }
            placeholder='Enter details about the service...'
            className='rounded-xl border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:border-green-400 focus:ring-green-100 resize-none min-h-[90px]'
          />
        </div>

        {/* Date */}
        <div>
          <FieldLabel>Date</FieldLabel>
          <div className='relative'>
            <input
              type='date'
              value={offerData.date}
              onChange={(e) =>
                setOfferData((prev) => ({ ...prev, date: e.target.value }))
              }
              className={cn(inputClass, "pr-10")}
            />
            <Calendar
              size={16}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none'
            />
          </div>
        </div>

        {/* Time */}
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <FieldLabel>From</FieldLabel>
            <div className='relative'>
              <input
                type='time'
                value={offerData.fromTime}
                onChange={(e) =>
                  setOfferData((prev) => ({
                    ...prev,
                    fromTime: e.target.value,
                  }))
                }
                className={cn(inputClass, "pr-10")}
              />
              <Clock
                size={16}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none'
              />
            </div>
          </div>
          <div>
            <FieldLabel>To</FieldLabel>
            <div className='relative'>
              <input
                type='time'
                value={offerData.toTime}
                onChange={(e) =>
                  setOfferData((prev) => ({ ...prev, toTime: e.target.value }))
                }
                className={cn(inputClass, "pr-10")}
              />
              <Clock
                size={16}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none'
              />
            </div>
          </div>
        </div>

        {/* Discount */}
        <div>
          <FieldLabel>Discount (optional)</FieldLabel>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium'>
              $
            </span>
            <input
              type='number'
              value={offerData.discount}
              onChange={(e) =>
                setOfferData((prev) => ({ ...prev, discount: e.target.value }))
              }
              placeholder='0.00'
              className={cn(inputClass, "pl-7")}
            />
          </div>
        </div>

        {/* Service Items */}
        <div>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-bold text-gray-900'>Service Items</h3>
            <span className='text-xs text-gray-400 font-medium'>
              {offerData.items.length} item
              {offerData.items.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className='space-y-4'>
            {offerData.items.map((item, idx) => (
              <div
                key={item.id}
                className='rounded-2xl border border-gray-100 bg-gray-50/60 p-4 relative'
              >
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-xs font-bold text-green-600 uppercase tracking-wider'>
                    Item {idx + 1}
                  </span>
                  {offerData.items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className='text-gray-300 hover:text-red-400 transition-colors'
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <div className='space-y-2.5'>
                  <div>
                    <label className='text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block'>
                      Title
                    </label>
                    <input
                      type='text'
                      value={item.title}
                      onChange={(e) =>
                        updateItem(item.id, "title", e.target.value)
                      }
                      placeholder='e.g. Pipe Replacement'
                      className={inputClass}
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-2.5'>
                    <div>
                      <label className='text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block'>
                        Quantity
                      </label>
                      <input
                        type='number'
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, "quantity", e.target.value)
                        }
                        placeholder='0'
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className='text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block'>
                        Unit Price ($)
                      </label>
                      <input
                        type='number'
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(item.id, "unitPrice", e.target.value)
                        }
                        placeholder='0.00'
                        className={inputClass}
                      />
                    </div>
                  </div>
                  {item.quantity && item.unitPrice && (
                    <div className='text-right text-xs font-semibold text-green-600'>
                      Line Total: $
                      {(
                        (parseFloat(item.quantity) || 0) *
                        (parseFloat(item.unitPrice) || 0)
                      ).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            className='mt-3 w-full rounded-xl border-2 border-dashed border-green-200 py-2.5 text-sm font-semibold text-green-600 hover:border-green-400 hover:bg-green-50 flex items-center justify-center gap-2 transition-all'
          >
            <Plus size={16} />
            Add New Item
          </button>
        </div>

        {/* Price Summary */}
        <div className='rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-2'>
          <div className='flex justify-between text-sm text-gray-500'>
            <span>Service</span>
            <span className='font-medium text-gray-700'>
              ${serviceTotal.toFixed(2)}
            </span>
          </div>
          <div className='flex justify-between text-sm text-gray-500'>
            <span>Discount</span>
            <span className='font-medium text-red-400'>
              -${discount.toFixed(2)}
            </span>
          </div>
          <div className='h-px bg-gray-200 my-1' />
          <div className='flex justify-between text-base font-bold text-gray-900'>
            <span>Total</span>
            <span className='text-green-600'>
              ${Math.max(0, total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='px-6 pb-5 pt-3 border-t border-gray-100'>
        <GreenButton
          onClick={onPreview}
          className='w-full py-3 text-base rounded-2xl'
        >
          Preview Offer
        </GreenButton>
      </div>
    </div>
  );
}

// ─── Preview Offer Modal ──────────────────────────────────────────────────────

function PreviewOfferView({
  offerData,
  onEdit,
  onSend,
  onClose,
  isSent,
}: {
  offerData: OfferData;
  onEdit: () => void;
  onSend: () => void;
  onClose: () => void;
  isSent?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const serviceTotal = calcServiceTotal(offerData.items);
  const discount = parseFloat(offerData.discount) || 0;
  const total = Math.max(0, serviceTotal - discount);

  const selectedService = SERVICE_OPTIONS.find(
    (s) => s.value === offerData.service,
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "–";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "–";
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const description =
    offerData.serviceDetails ||
    "Lorem ipsum dolor sit amet consectetur. Turpis montes euismod nunc odio ut imperdiet proin enim. Porttitor amet dolor nisi tempor amet dolor. Orci faucibus dui nunc diam....";

  const shortDesc =
    description.length > 120 ? description.slice(0, 120) + "..." : description;

  return (
    <div className='flex flex-col max-h-[85vh]'>
      {/* Header */}
      <div className='flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100'>
        {!isSent ? (
          <button
            onClick={onEdit}
            className='rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors'
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <div className='w-8' />
        )}
        <h2 className='text-lg font-bold text-gray-900 tracking-tight'>
          {isSent ? "Offer Details" : "Preview Offer"}
        </h2>
        <button
          onClick={onClose}
          className='rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors'
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className='flex-1 overflow-y-auto px-6 py-5 space-y-6'>
        {/* Title block */}
        <div>
          <h3 className='text-2xl font-bold text-gray-900 tracking-tight'>
            {selectedService?.label || "Service"}
          </h3>
          <p className='text-sm text-gray-400 mt-0.5'>
            {selectedService?.category || "Services"}
          </p>
        </div>

        {/* Meta */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Calendar size={15} className='text-green-500 flex-shrink-0' />
            <span>{formatDate(offerData.date)}</span>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Clock size={15} className='text-green-500 flex-shrink-0' />
            <span>
              {formatTime(offerData.fromTime)} – {formatTime(offerData.toTime)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className='text-sm text-gray-600 leading-relaxed'>
          {expanded ? description : shortDesc}
          {description.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className='text-green-600 font-semibold ml-1 hover:underline'
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        {/* Service Items Breakdown */}
        <div>
          <h4 className='text-base font-bold text-gray-900 mb-4'>
            Service Items Breakdown
          </h4>
          <div className='space-y-4'>
            {offerData.items
              .filter((item) => item.title)
              .map((item, idx) => {
                const lineTotal =
                  (parseFloat(item.quantity) || 0) *
                  (parseFloat(item.unitPrice) || 0);
                return (
                  <div key={item.id}>
                    <p className='font-semibold text-gray-800 mb-1.5'>
                      {item.title}
                    </p>
                    <div className='text-sm text-gray-500 space-y-0.5'>
                      <p>
                        Quantity :{" "}
                        <span className='text-gray-700'>
                          {item.quantity || "–"}
                        </span>
                      </p>
                      <p>
                        Unit Price :{" "}
                        <span className='text-gray-700'>
                          ${parseFloat(item.unitPrice || "0").toFixed(0)}
                        </span>
                      </p>
                      <p>
                        Line Total :{" "}
                        <span className='text-gray-700'>
                          ${lineTotal.toFixed(0)}
                        </span>
                      </p>
                    </div>
                    {idx <
                      offerData.items.filter((i) => i.title).length - 1 && (
                      <div className='h-px bg-gray-100 mt-4' />
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Price Summary */}
        <div>
          <h4 className='text-base font-bold text-gray-900 mb-3'>
            Price Summary
          </h4>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-gray-500'>
              <span>Service:</span>
              <span className='font-medium text-gray-700'>
                ${serviceTotal.toFixed(0)}
              </span>
            </div>
            <div className='flex justify-between text-sm text-gray-500'>
              <span>Discount:</span>
              <span className='font-medium text-gray-700'>
                ${discount.toFixed(0)}
              </span>
            </div>
            <div className='h-px bg-gray-100' />
            <div className='flex justify-between text-base font-bold text-gray-900 pt-1'>
              <span>Total:</span>
              <span>${total.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='px-6 pb-5 pt-3 border-t border-gray-100'>
        {isSent ? (
          <GreenButton
            variant='outline'
            onClick={onEdit}
            className='w-full py-3 text-base rounded-2xl'
          >
            Edit Offer
          </GreenButton>
        ) : (
          <div className='flex gap-3'>
            <GreenButton
              variant='outline'
              onClick={onEdit}
              className='flex-1 py-3 text-base rounded-2xl'
            >
              Edit Offer
            </GreenButton>
            <GreenButton
              onClick={onSend}
              className='flex-1 py-3 text-base rounded-2xl'
            >
              Send Offer
            </GreenButton>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Accept / Reject Modal ────────────────────────────────────────────────────

function AcceptRejectView({
  offerData,
  onClose,
}: {
  offerData: OfferData;
  onClose: (result: "accepted" | "rejected" | "closed") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const serviceTotal = calcServiceTotal(offerData.items);
  const discount = parseFloat(offerData.discount) || 0;
  const total = Math.max(0, serviceTotal - discount);
  const selectedService = SERVICE_OPTIONS.find(
    (s) => s.value === offerData.service,
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "–";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "–";
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const description =
    offerData.serviceDetails ||
    "Lorem ipsum dolor sit amet consectetur. Turpis montes euismod nunc odio ut imperdiet proin enim. Porttitor amet dolor nisi tempor amet dolor. Orci faucibus dui nunc diam....";

  const shortDesc =
    description.length > 120 ? description.slice(0, 120) + "..." : description;

  return (
    <div className='flex flex-col max-h-[85vh]'>
      {/* Header */}
      <div className='flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100'>
        <h2 className='text-lg font-bold text-gray-900 tracking-tight'>
          Offer Details
        </h2>
        <button
          onClick={() => onClose("closed")}
          className='rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors'
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className='flex-1 overflow-y-auto px-6 py-5 space-y-6'>
        <div>
          <h3 className='text-2xl font-bold text-gray-900 tracking-tight'>
            {selectedService?.label || "Service"}
          </h3>
          <p className='text-sm text-gray-400 mt-0.5'>
            {selectedService?.category || "Services"}
          </p>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Calendar size={15} className='text-green-500 flex-shrink-0' />
            <span>{formatDate(offerData.date)}</span>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Clock size={15} className='text-green-500 flex-shrink-0' />
            <span>
              {formatTime(offerData.fromTime)} – {formatTime(offerData.toTime)}
            </span>
          </div>
        </div>

        <p className='text-sm text-gray-600 leading-relaxed'>
          {expanded ? description : shortDesc}
          {description.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className='text-green-600 font-semibold ml-1 hover:underline'
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        <div>
          <h4 className='text-base font-bold text-gray-900 mb-4'>
            Service Items Breakdown
          </h4>
          <div className='space-y-4'>
            {offerData.items
              .filter((item) => item.title)
              .map((item, idx) => {
                const lineTotal =
                  (parseFloat(item.quantity) || 0) *
                  (parseFloat(item.unitPrice) || 0);
                return (
                  <div key={item.id}>
                    <p className='font-semibold text-gray-800 mb-1.5'>
                      {item.title}
                    </p>
                    <div className='text-sm text-gray-500 space-y-0.5'>
                      <p>
                        Quantity :{" "}
                        <span className='text-gray-700'>
                          {item.quantity || "–"}
                        </span>
                      </p>
                      <p>
                        Unit Price :{" "}
                        <span className='text-gray-700'>
                          ${parseFloat(item.unitPrice || "0").toFixed(0)}
                        </span>
                      </p>
                      <p>
                        Line Total :{" "}
                        <span className='text-gray-700'>
                          ${lineTotal.toFixed(0)}
                        </span>
                      </p>
                    </div>
                    {idx <
                      offerData.items.filter((i) => i.title).length - 1 && (
                      <div className='h-px bg-gray-100 mt-4' />
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        <div>
          <h4 className='text-base font-bold text-gray-900 mb-3'>
            Price Summary
          </h4>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-gray-500'>
              <span>Service:</span>
              <span className='font-medium text-gray-700'>
                ${serviceTotal.toFixed(0)}
              </span>
            </div>
            <div className='flex justify-between text-sm text-gray-500'>
              <span>Discount:</span>
              <span className='font-medium text-gray-700'>
                ${discount.toFixed(0)}
              </span>
            </div>
            <div className='h-px bg-gray-100' />
            <div className='flex justify-between text-base font-bold text-gray-900 pt-1'>
              <span>Total:</span>
              <span>${total.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Accept/Reject */}
      <div className='px-6 pb-5 pt-3 border-t border-gray-100 flex gap-3'>
        <button
          onClick={() => onClose("rejected")}
          className='flex-1 py-3 rounded-2xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 hover:border-red-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2'
        >
          <XCircle size={17} />
          Reject
        </button>
        <button
          onClick={() => onClose("accepted")}
          className='flex-1 py-3 rounded-2xl bg-[#2d9b4f] text-white font-semibold text-sm hover:bg-[#248042] active:scale-[0.98] shadow-md shadow-green-200 transition-all flex items-center justify-center gap-2'
        >
          <CheckCircle2 size={17} />
          Accept
        </button>
      </div>
    </div>
  );
}

// ─── Result Toast ─────────────────────────────────────────────────────────────

function ResultBanner({
  result,
  onDismiss,
}: {
  result: "accepted" | "rejected";
  onDismiss: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl text-white text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300",
        result === "accepted" ? "bg-[#2d9b4f]" : "bg-red-500",
      )}
    >
      {result === "accepted" ? (
        <CheckCircle2 size={18} />
      ) : (
        <XCircle size={18} />
      )}
      Offer {result === "accepted" ? "Accepted!" : "Rejected"}
      <button onClick={onDismiss} className='ml-2 opacity-70 hover:opacity-100'>
        <X size={15} />
      </button>
    </div>
  );
}

// ─── Main Demo ────────────────────────────────────────────────────────────────

export default function CreateOfferDemo() {
  const [view, setView] = useState<ModalView | null>(null);
  const [offerResult, setOfferResult] = useState<
    "accepted" | "rejected" | null
  >(null);

  const defaultItems: ServiceItem[] = [
    {
      id: generateId(),
      title: "Pipe Replacement",
      quantity: "2",
      unitPrice: "100",
    },
    {
      id: generateId(),
      title: "Drain Cleaning",
      quantity: "1",
      unitPrice: "150",
    },
  ];

  const [offerData, setOfferData] = useState<OfferData>({
    service: "plumbing",
    serviceDetails: "",
    date: "2025-07-30",
    fromTime: "09:30",
    toTime: "23:00",
    discount: "50",
    items: defaultItems,
  });

  const isOpen = view !== null;

  function handleSend() {
    setView("sent");
  }

  function handleAcceptReject(result: "accepted" | "rejected" | "closed") {
    setView(null);
    if (result === "accepted" || result === "rejected") {
      setOfferResult(result);
      setTimeout(() => setOfferResult(null), 4000);
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 flex items-center justify-center p-8 font-sans'>
      {/* Demo Buttons */}
      <div className='text-center space-y-4'>
        <h1 className='text-2xl font-bold text-gray-800 mb-8'>
          Offer Modal System
        </h1>
        <div className='flex flex-wrap justify-center gap-3'>
          <GreenButton onClick={() => setView("create")}>
            + Create Offer
          </GreenButton>
          <GreenButton variant='outline' onClick={() => setView("preview")}>
            Preview Offer
          </GreenButton>
          <GreenButton variant='outline' onClick={() => setView("sent")}>
            Offer Details (Sent)
          </GreenButton>
          <GreenButton
            variant='outline'
            onClick={() => setView("accept-reject")}
          >
            Accept / Reject Offer
          </GreenButton>
        </div>
        <p className='text-sm text-gray-400 mt-4'>
          Click any button to open the corresponding modal
        </p>
      </div>

      {/* Modals */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && setView(null)}>
        <DialogContent
          className='p-0 overflow-hidden rounded-3xl border-0 shadow-2xl'
          style={{
            maxWidth: view === "accept-reject" ? 420 : 500,
            width: "95vw",
          }}
          hideClose
        >
          {view === "create" && (
            <CreateOfferView
              offerData={offerData}
              setOfferData={setOfferData}
              onPreview={() => setView("preview")}
              onClose={() => setView(null)}
            />
          )}

          {(view === "preview" || view === "sent") && (
            <PreviewOfferView
              offerData={offerData}
              onEdit={() => setView("create")}
              onSend={handleSend}
              onClose={() => setView(null)}
              isSent={view === "sent"}
            />
          )}

          {view === "accept-reject" && (
            <AcceptRejectView
              offerData={offerData}
              onClose={handleAcceptReject}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Result Banner */}
      {offerResult && (
        <ResultBanner
          result={offerResult}
          onDismiss={() => setOfferResult(null)}
        />
      )}
    </div>
  );
}
