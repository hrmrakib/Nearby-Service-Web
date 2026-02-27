/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  Search,
  Send,
  Clock,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  MapPin,
  Star,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
import {
  useGetInboxChatsQuery,
  useGetMessagesQuery,
} from "@/redux/features/chat/chatAPI";
import { toast } from "sonner";
import { SocketProvider, useSocket } from "@/provider/SocketProvider";
import { useMyProvidedServicesQuery } from "@/redux/features/post/postAPI";
import {
  useCreateOfferMutation,
  useAcceptOfferMutation,
  useRejectOfferMutation,
} from "@/redux/features/offer/offerAPI";
import { IServiceForOfferCreation } from "./message.type";
import { useAuth } from "@/hooks/useAuth.ts";
import { useDispatch, useSelector } from "react-redux";
import { setChatId, setSelectedUser } from "@/redux/features/chat/chatSlice";

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface ConversationMember {
  _id: string;
  name: string;
  image: string;
}

interface LastMessage {
  message: string;
  read: boolean;
}

interface Conversation {
  _id: string;
  members: ConversationMember[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage: LastMessage;
  unread: number;
}

interface ServiceItem {
  id: string;
  title: string;
  quantity: string;
  unitPrice: string;
}

interface OfferData {
  service: { _id: string; title: string } | null;
  serviceDetails: string;
  date: string;
  fromTime: string;
  toTime: string;
  discount: string;
  items: ServiceItem[];
}

type ModalView = "create" | "preview" | "sent" | "accept-reject";

// ─── Constants ────────────────────────────────────────────────────────────────
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

// ─── Utilities ────────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

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

function formatDate(dateStr: string) {
  if (!dateStr) return "–";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeStr: string) {
  if (!timeStr) return "–";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function defaultOfferData(): OfferData {
  return {
    service: { _id: "", title: "" },
    serviceDetails: "",
    date: "",
    fromTime: "",
    toTime: "",
    discount: "",
    items: [{ id: generateId(), title: "", quantity: "", unitPrice: "" }],
  };
}

// Convert raw offer object → OfferData shape for modal display
function offerToOfferData(offer: any): OfferData {
  return {
    service: offer.service
      ? { _id: offer.service._id, title: offer.service.title }
      : null,
    serviceDetails: offer.description ?? "",
    date: offer.date ? offer.date.slice(0, 10) : "",
    fromTime: offer.from ?? "",
    toTime: offer.to ?? "",
    discount: String(offer.discount ?? ""),
    items: (offer.items ?? []).map((item: any) => ({
      id: item._id ?? generateId(),
      title: item.title,
      quantity: String(item.quantity),
      unitPrice: String(item.unitPrice),
    })),
  };
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
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
          ? "bg-[#15B826] text-white hover:bg-[#248042] active:scale-[0.98] shadow-md shadow-green-200"
          : "border-2 border-[#15B826] text-[#15B826] bg-white hover:bg-green-50 active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ─── Shared Offer Body ────────────────────────────────────────────────────────
// Reused in both PreviewOfferView and AcceptRejectView
function OfferBody({ offerData }: { offerData: OfferData }) {
  const [expanded, setExpanded] = useState(false);
  const serviceTotal = calcServiceTotal(offerData.items);
  const discount = parseFloat(offerData.discount) || 0;
  const total = Math.max(0, serviceTotal - discount);
  const selectedService = SERVICE_OPTIONS.find(
    (s) => s.value === offerData.service?.title,
  );

  const description =
    offerData.serviceDetails ||
    "Lorem ipsum dolor sit amet consectetur. Turpis montes euismod nunc odio ut imperdiet proin enim...";
  const shortDesc =
    description.length > 120 ? description.slice(0, 120) + "..." : description;

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-900 tracking-tight'>
          {offerData.service?.title || selectedService?.label || "Service"}
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
            className='text-[#15B826] font-semibold ml-1 hover:underline'
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      {/* Items breakdown */}
      <div>
        <h4 className='text-base font-bold text-gray-900 mb-4'>
          Service Items Breakdown
        </h4>
        <div className='space-y-4'>
          {offerData.items
            .filter((item) => item.title)
            .map((item, idx, arr) => {
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
                  {idx < arr.length - 1 && (
                    <div className='h-px bg-gray-100 mt-4' />
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Price summary */}
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
  );
}

// ─── Create Offer Modal ───────────────────────────────────────────────────────
function CreateOfferView({
  offerData,
  setOfferData,
  onPreview,
  onClose,
  isEditing,
}: {
  offerData: OfferData;
  setOfferData: React.Dispatch<React.SetStateAction<OfferData>>;
  onPreview: () => void;
  onClose: () => void;
  isEditing: boolean;
}) {
  const serviceTotal = calcServiceTotal(offerData.items);
  const discount = parseFloat(offerData.discount) || 0;
  const total = serviceTotal - discount;

  const { data: servicesList, isLoading } = useMyProvidedServicesQuery({
    page: 1,
    limit: 22,
  });
  const services = servicesList?.data;

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100 transition-all";

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

  return (
    <div className='flex flex-col max-h-[85vh]'>
      {/* Header */}
      <div className='flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100'>
        <h2 className='text-lg font-bold text-gray-900 tracking-tight'>
          {isEditing ? "Edit Offer" : "Create Offer"}
        </h2>
        <button
          onClick={onClose}
          className='rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors'
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className='flex-1 overflow-y-auto px-6 py-5 space-y-5'>
        {/* Select Service */}
        <div>
          <FieldLabel>Select Service</FieldLabel>
          <Select
            value={offerData.service?._id ?? ""}
            onValueChange={(val) => {
              const selected = services?.find(
                (s: IServiceForOfferCreation) => s._id === val,
              );
              if (selected) {
                setOfferData((prev) => ({
                  ...prev,
                  service: { _id: selected._id, title: selected.title },
                }));
              }
            }}
          >
            <SelectTrigger className='w-full rounded-xl border-gray-200 bg-gray-50 h-11 text-sm focus:ring-green-100 focus:border-green-400 data-[placeholder]:text-gray-400'>
              <SelectValue placeholder='Select service' />
            </SelectTrigger>
            {isLoading ? (
              <SelectContent>
                <SelectItem disabled value='loading' className='text-sm'>
                  Loading...
                </SelectItem>
              </SelectContent>
            ) : (
              <SelectContent className='rounded-xl'>
                {services?.map((opt: IServiceForOfferCreation) => (
                  <SelectItem key={opt._id} value={opt._id} className='text-sm'>
                    {opt.title}
                  </SelectItem>
                ))}
              </SelectContent>
            )}
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
          <div
            className='relative cursor-pointer'
            onClick={() =>
              (
                document.getElementById("date") as HTMLInputElement
              )?.showPicker()
            }
          >
            <input
              id='date'
              type='date'
              value={offerData.date}
              onChange={(e) =>
                setOfferData((prev) => ({ ...prev, date: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Time */}
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <FieldLabel>From</FieldLabel>
            <div
              className='relative cursor-pointer'
              onClick={() =>
                (
                  document.getElementById("fromTime") as HTMLInputElement
                )?.showPicker()
              }
            >
              <input
                id='fromTime'
                type='time'
                value={offerData.fromTime}
                onChange={(e) =>
                  setOfferData((prev) => ({
                    ...prev,
                    fromTime: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <FieldLabel>To</FieldLabel>
            <div
              className='relative cursor-pointer'
              onClick={() =>
                (
                  document.getElementById("toTime") as HTMLInputElement
                )?.showPicker()
              }
            >
              <input
                id='toTime'
                type='time'
                value={offerData.toTime}
                onChange={(e) =>
                  setOfferData((prev) => ({
                    ...prev,
                    toTime: e.target.value,
                  }))
                }
                className={inputClass}
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
                setOfferData((prev) => ({
                  ...prev,
                  discount: e.target.value,
                }))
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
                  <span className='text-xs font-bold text-[#15B826] uppercase tracking-wider'>
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
                    <div className='text-right text-xs font-semibold text-[#15B826]'>
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
            className='mt-3 w-full rounded-xl border-2 border-dashed border-green-200 py-2.5 text-sm font-semibold text-[#15B826] hover:border-green-400 hover:bg-green-50 flex items-center justify-center gap-2 transition-all'
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
            <span className='text-[#15B826]'>
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
  isEditing,
}: {
  offerData: OfferData;
  onEdit: () => void;
  onSend: () => void;
  onClose: () => void;
  isSent?: boolean;
  isEditing?: boolean;
}) {
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
      <div className='flex-1 overflow-y-auto px-6 py-5'>
        <OfferBody offerData={offerData} />
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
              {isEditing ? "Update Offer" : "Send Offer"}
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
  offerId,
  customerId,
  onClose,
}: {
  offerData: OfferData;
  offerId: string; // offer._id  → used in both API calls
  customerId: string; // offer.customer → used in rejectOffer body
  onClose: (result: "accepted" | "rejected" | "closed") => void;
}) {
  const [acceptOffer, { isLoading: isAccepting }] = useAcceptOfferMutation();
  const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();

  // Calculate final total to pass as `amount` to POST /offer/complete
  const serviceTotal = calcServiceTotal(offerData.items);
  const discount = parseFloat(offerData.discount) || 0;
  const total = Math.max(0, serviceTotal - discount);

  const handleAccept = async () => {
    try {
      const res = await acceptOffer({
        offerId, // "6996aa95b89791b8b772e79d"
        amount: total, // computed final price
      }).unwrap();

      if (res?.success) {
        toast.success("Offer accepted successfully.");
        onClose("accepted");
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to accept offer.");
    }
  };

  const handleReject = async () => {
    try {
      const res = await rejectOffer({
        offerId, // "6996aa95b89791b8b772e79d"
        customerId, // "694f6a700144720a04407c77"
      }).unwrap();

      if (res?.success) {
        toast.success("Offer rejected.");
        onClose("rejected");
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to reject offer.");
    }
  };

  const isLoading = isAccepting || isRejecting;

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
      <div className='flex-1 overflow-y-auto px-6 py-5'>
        <OfferBody offerData={offerData} />
      </div>

      {/* Footer */}
      <div className='px-6 pb-5 pt-3 border-t border-gray-100 flex gap-3'>
        <button
          onClick={handleReject}
          disabled={isLoading}
          className='flex-1 py-3 rounded-2xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 hover:border-red-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <XCircle size={17} />
          {isRejecting ? "Rejecting..." : "Reject"}
        </button>
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className='flex-1 py-3 rounded-2xl bg-[#15B826] text-white font-semibold text-sm hover:bg-[#248042] active:scale-[0.98] shadow-md shadow-green-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <CheckCircle2 size={17} />
          {isAccepting ? "Accepting..." : "Accept"}
        </button>
      </div>
    </div>
  );
}

// ─── Result Banner ────────────────────────────────────────────────────────────
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
        result === "accepted" ? "bg-[#15B826]" : "bg-red-500",
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

// ─── Offer Card ───────────────────────────────────────────────────────────────
function OfferCard({
  offer,
  onEdit,
  onViewOffer,
}: {
  offer: any;
  onEdit?: () => void; // sender only — opens edit modal
  onViewOffer?: () => void; // receiver only — opens accept/reject modal
}) {
  const [expanded, setExpanded] = useState(false);

  const subtotal =
    offer?.items?.reduce(
      (acc: number, item: any) => acc + item.quantity * item.unitPrice,
      0,
    ) ?? 0;
  const discountAmount = (subtotal * (offer.discount ?? 0)) / 100;
  const total = subtotal - discountAmount;

  const dateStr = new Date(offer.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Status badge
  const statusMap: Record<string, { label: string; className: string }> = {
    draft: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    accepted: { label: "Accepted", className: "bg-green-100  text-green-700" },
    rejected: { label: "Rejected", className: "bg-red-100    text-red-600" },
    complete: { label: "Completed", className: "bg-blue-100   text-blue-700" },
  };
  const statusInfo = statusMap[offer.status] ?? statusMap["draft"];

  return (
    <div className='bg-white rounded-2xl shadow-md overflow-hidden w-[260px] sm:w-[280px]'>
      {offer.service?.image && (
        <img
          src={offer.service.image}
          alt={offer.service.title}
          className='w-full h-[140px] object-cover'
        />
      )}

      <div className='p-3'>
        <h3 className='font-semibold text-gray-900 text-base'>
          {offer.service?.title ?? "Service Offer"}
        </h3>

        <div className='flex items-center gap-3 mt-1 text-xs text-gray-500'>
          <span className='flex items-center gap-0.5'>
            <MapPin className='w-3 h-3 text-[#15B826]' />
            {offer.service?.subcategory ?? "Service"}
          </span>
          <span className='flex items-center gap-0.5'>
            <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
            {offer.discount}% off
          </span>
        </div>

        <div className='flex items-center gap-1 mt-1.5 text-xs text-gray-500'>
          <Calendar className='w-3 h-3 text-[#15B826]' />
          <span>
            {dateStr}, {offer.from} – {offer.to}
          </span>
        </div>

        <p className='text-xs text-gray-500 mt-2 line-clamp-2'>
          {offer.description}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className='flex items-center gap-1 text-xs text-green-700 font-medium mt-1'
        >
          {expanded ? "Hide details" : "Read more"}
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>

        {expanded && (
          <div className='mt-2 space-y-1 border-t pt-2'>
            {offer.items?.map((item: any) => (
              <div
                key={item._id}
                className='flex justify-between text-xs text-gray-600'
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>
                  ${(item.quantity * item.unitPrice).toLocaleString()}
                </span>
              </div>
            ))}
            {offer.discount > 0 && (
              <div className='flex justify-between text-xs text-[#15B826]'>
                <span>Discount ({offer.discount}%)</span>
                <span>-${discountAmount.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Total row + status badge */}
        <div className='mt-2 pt-2 border-t flex items-center justify-between'>
          <p className='text-sm font-bold text-gray-900'>
            Total: ${total.toLocaleString()}
          </p>
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium",
              statusInfo.className,
            )}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Action buttons — only shown while pending (draft) */}
        <div className='mt-2 flex flex-col gap-1.5'>
          {/* Sender sees Edit */}
          {onEdit && offer.status === "draft" && (
            <button
              onClick={onEdit}
              className='w-full text-xs font-semibold text-[#15B826] border border-green-200 rounded-xl py-1.5 hover:bg-green-50 transition-colors'
            >
              Edit Offer
            </button>
          )}

          {/* Receiver sees View Offer (opens accept/reject modal) */}
          {onViewOffer && offer.status === "draft" && (
            <button
              onClick={onViewOffer}
              className='w-full text-xs font-semibold text-white bg-[#15B826] rounded-xl py-1.5 hover:bg-[#248042] transition-colors'
            >
              View Offer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function MessagesPageInner() {
  // const [chatId, setChatId] = useState("");
  // const [selectedUser, setSelectedUser] = useState<Conversation>();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [searchMessageQuery, setSearchMessageQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [openSearchMessage, setOpenSearchMessage] = useState(false);
  const [inboxUserLists, setInboxUserLists] = useState([]);
  const [inboxPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedSearchMessageQuery = useDebounce(searchMessageQuery, 500);

  const [createOfferMutation] = useCreateOfferMutation();
  const { socket, onlineUsers } = useSocket();
  const { user } = useAuth();

  // ── Offer modal state ──────────────────────────────────────────────────────
  const [modalView, setModalView] = useState<ModalView | null>(null);
  const [offerData, setOfferData] = useState<OfferData>(defaultOfferData());
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  // activeOffer: full raw offer object, needed for offerId + customerId in AcceptRejectView
  const [activeOffer, setActiveOffer] = useState<any | null>(null);
  const [offerResult, setOfferResult] = useState<
    "accepted" | "rejected" | null
  >(null);

  // chat slice
  const selectedUser = useSelector((state: any) => state.chat.selectedUser);
  const chatId = useSelector((state: any) => state.chat.chatId);
  const dispatch = useDispatch();

  // ── Queries ────────────────────────────────────────────────────────────────
  const {
    data: inboxChats,
    isFetching: inboxChatsFetching,
    refetch,
  } = useGetInboxChatsQuery(
    {
      page: inboxPage,
      limit: 10,
      search: debouncedSearchQuery,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    refetch();
  }, [selectedUser, refetch]);

  const { data: messagesResponse, isFetching: messagesFetching } =
    useGetMessagesQuery(
      {
        page: 1,
        limit: 300,
        search: debouncedSearchMessageQuery,
        chat_id: selectedUser?._id!,
      },
      { skip: !selectedUser?._id },
    );

  const messagesData = useMemo(
    () => messagesResponse?.data ?? [],
    [messagesResponse?.data],
  );

  useEffect(() => {
    if (!messagesData.length) return;
    setMessages((prev) => {
      const existingIds = new Set(prev.map((m: any) => m._id ?? m.id));
      const incoming = messagesData.filter(
        (msg: any) => !existingIds.has(msg._id ?? msg.id),
      );
      if (!incoming.length) return prev;
      const merged = [...prev, ...incoming];
      merged.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      return merged;
    });
  }, [messagesData]);

  useEffect(() => {
    if (inboxChats?.data) setInboxUserLists(inboxChats.data);
  }, [inboxChats?.data]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send plain text message ────────────────────────────────────────────────
  const handleSendMessage = (offerId?: string, type?: string) => {
    if (!messageText.trim()) return;
    if (!selectedUser) {
      toast.error("Please select a conversation to send a message.");
      return;
    }
    if (!socket) return;

    const newMessage = {
      _id: Date.now().toString(),
      message: messageText,
      isOwner: true,
      type: type || "text",
      offer: offerId || null,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send-message", {
      chat: chatId,
      sender: selectedUser?._id,
      message: messageText,
      isOwner: true,
      type: type || "text",
      offer: offerId || null,
    });

    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");
  };

  const handleConversationSelect = (conv: Conversation) => {
    setMessages([]);
    dispatch(setSelectedUser(conv));
    setShowChat(true);
    dispatch(setChatId(conv._id));
  };

  console.log({ selectedUser });

  // ── Open modal: CREATE ─────────────────────────────────────────────────────
  const handleOpenCreateOffer = () => {
    setOfferData(defaultOfferData());
    setEditingOfferId(null);
    setActiveOffer(null);
    setModalView("create");
  };

  // ── Open modal: EDIT (sender clicks "Edit Offer" on card) ─────────────────
  const handleOpenEditOffer = (offer: any) => {
    setOfferData(offerToOfferData(offer));
    setEditingOfferId(offer._id);
    setActiveOffer(offer);
    setModalView("create");
  };

  // ── Open modal: ACCEPT/REJECT (receiver clicks "View Offer" on card) ──────
  const handleOpenAcceptReject = (offer: any) => {
    setOfferData(offerToOfferData(offer));
    setActiveOffer(offer);
    setEditingOfferId(null);
    setModalView("accept-reject");
  };

  // ── Submit: create OR update ───────────────────────────────────────────────
  const handleOfferSend = async () => {
    const formattedItems = offerData.items.map(
      ({ title, quantity, unitPrice }) => ({
        title,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
      }),
    );

    const payload = {
      chat: chatId,
      provider: user?._id,
      customer: selectedUser?.members[0]?._id,
      service: offerData?.service?._id,
      description: offerData?.serviceDetails,
      date: offerData?.date,
      from: offerData?.fromTime,
      to: offerData?.toTime,
      items: formattedItems,
      discount: offerData?.discount,
    };

    try {
      if (editingOfferId) {
        // UPDATE — pass id so your backend can route to PATCH /offer/:id
        const res = await createOfferMutation({
          id: editingOfferId,
          ...payload,
        }).unwrap();
        if (res?.success) {
          // Patch card in-place immediately
          setMessages((prev) =>
            prev.map((m) =>
              m.offer?._id === editingOfferId ? { ...m, offer: res.data } : m,
            ),
          );
          toast.success("Offer updated successfully.");
        }
      } else {
        // CREATE
        const res = await createOfferMutation(payload).unwrap();
        if (res?.success) {
          handleSendMessage(res?.data?._id, "offer");
          toast.success("Offer sent successfully.");
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong.");
    }

    setEditingOfferId(null);
    setActiveOffer(null);
    setModalView(null);
  };

  // ── Called by AcceptRejectView after API resolves ──────────────────────────
  const handleAcceptRejectClose = (
    result: "accepted" | "rejected" | "closed",
  ) => {
    setModalView(null);

    if (result === "accepted" || result === "rejected") {
      // Optimistically update the status badge on the card
      if (activeOffer?._id) {
        const newStatus = result === "accepted" ? "accepted" : "rejected";
        setMessages((prev) =>
          prev.map((m) =>
            m.offer?._id === activeOffer._id
              ? { ...m, offer: { ...m.offer, status: newStatus } }
              : m,
          ),
        );
      }
      setOfferResult(result);
      setTimeout(() => setOfferResult(null), 4000);
    }

    setActiveOffer(null);
  };

  const isModalOpen = modalView !== null;

  // ? test console

  console.log({ chatId, selectedUser });

  return (
    <>
      <div className='flex h-[calc(100vh-90px)] overflow-hidden bg-gray-50'>
        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <div
          className={cn(
            "w-full md:w-80 bg-white border-r border-gray-200 flex-col",
            showChat ? "hidden md:flex" : "flex",
          )}
        >
          <div className='p-4 border-b'>
            <h1 className='text-lg font-semibold mb-3'>All Messages</h1>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
              <Input
                className='pl-10 bg-gray-100 border-0'
                placeholder='Search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className='flex-1 overflow-y-auto'>
            {inboxChatsFetching && (
              <div className='divide-y divide-gray-100'>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className='flex gap-3 p-4 items-center'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0' />
                    <div className='flex-1 space-y-2'>
                      <div className='h-3.5 w-28 bg-gray-200 rounded-full animate-pulse' />
                      <div className='h-3 w-44 bg-gray-100 rounded-full animate-pulse' />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!inboxChatsFetching &&
              inboxUserLists.map((c: Conversation) => (
                <div
                  key={c._id}
                  onClick={() => handleConversationSelect(c)}
                  className={cn(
                    "relative flex gap-3 p-4 cursor-pointer hover:bg-gray-50",
                    selectedUser?._id === c._id && "bg-green-50",
                  )}
                >
                  <Avatar className='w-10 h-10'>
                    <AvatarImage src={c?.members[0]?.image} />
                    <AvatarFallback>{c?.members[0]?.name}</AvatarFallback>
                  </Avatar>
                  {onlineUsers.includes(c._id) && (
                    <div className='absolute top-4 left-12 w-3 h-3 bg-green-500 border-2 border-white rounded-full' />
                  )}
                  <div className='flex-1 min-w-0'>
                    <div className='flex justify-between items-start'>
                      <p className='font-medium truncate'>
                        {c.members[0]?.name || "N/A"}
                      </p>
                      {c?.unread ? (
                        <span className='text-xs bg-[#0A5512] text-white px-2 rounded-full ml-2 flex-shrink-0'>
                          {c?.unread}
                        </span>
                      ) : null}
                    </div>
                    <p className='text-sm text-gray-600 line-clamp-1'>
                      {c?.lastMessage?.message}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ── Chat Panel ────────────────────────────────────────────────── */}
        <div
          className={cn(
            "flex-1 flex flex-col",
            !showChat ? "hidden md:flex" : "flex",
          )}
        >
          {/* Chat Header */}
          <div className='p-4 bg-white border-b flex items-center justify-between gap-3'>
            <button
              onClick={() => setShowChat(false)}
              className='md:hidden flex items-center gap-2 text-green-700 font-medium'
            >
              <ArrowLeft className='w-4 h-4' /> Back
            </button>

            <div className='flex items-center gap-3'>
              <Avatar className='w-8 h-8'>
                <AvatarImage src={selectedUser?.members[0]?.image} />
                <AvatarFallback>
                  {selectedUser?.members[0]?.name}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>
                  {selectedUser?.members[0]?.name || "N/A"}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-5 pr-0 lg:pr-6'>
              <button
                onClick={handleOpenCreateOffer}
                className='w-max bg-white flex items-center gap-2 text-green-700 font-semibold rounded-sm shadow px-2 py-1.5 hover:bg-green-50 transition-colors'
              >
                <Calendar size={18} />
                <span>Create Offer</span>
              </button>

              {openSearchMessage ? (
                <div className='relative flex items-center gap-2 pr-4 md:pr-0'>
                  <Input
                    className='w-80 hidden md:block bg-gray-100 border-0'
                    placeholder='Search'
                    value={searchMessageQuery}
                    onChange={(e) => setSearchMessageQuery(e.target.value)}
                  />
                  <button
                    className='absolute right-2'
                    onClick={() => setOpenSearchMessage(false)}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setOpenSearchMessage(true)}>
                  <Search size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 h-[90vh] overflow-y-auto p-4 space-y-4'>
            {messagesFetching && (
              <div className='space-y-4'>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className='h-10 rounded-2xl bg-gray-200 animate-pulse'
                      style={{
                        width: `${[140, 200, 160, 120, 180, 100][i % 6]}px`,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {!messagesFetching &&
              messages.map((m: any) => (
                <div
                  key={m._id ?? m.id}
                  className={cn(
                    "flex",
                    m.isOwner ? "justify-end" : "justify-start",
                  )}
                >
                  {m.type === "offer" && m.offer ? (
                    <div className='flex flex-col gap-1 max-w-[75%] sm:max-w-xs lg:max-w-md'>
                      {m.message && (
                        <div
                          className={cn(
                            "px-4 py-2 rounded-2xl",
                            m.isOwner
                              ? "bg-[#0A5512] text-white self-end"
                              : "bg-gray-100 self-start",
                          )}
                        >
                          <p className='text-sm'>{m.message}</p>
                        </div>
                      )}
                      <OfferCard
                        offer={m.offer}
                        // Sender gets Edit button
                        onEdit={
                          m.isOwner
                            ? () => handleOpenEditOffer(m.offer)
                            : undefined
                        }
                        // Receiver gets "View Offer" → accept/reject modal
                        onViewOffer={
                          !m.isOwner
                            ? () => handleOpenAcceptReject(m.offer)
                            : undefined
                        }
                      />
                      <p className='text-xs opacity-50 pl-1'>
                        {m.timestamp ??
                          new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </p>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "px-4 py-2 rounded-2xl max-w-[75%] sm:max-w-xs lg:max-w-md",
                        m.isOwner ? "bg-[#0A5512] text-white" : "bg-gray-100",
                      )}
                    >
                      <p className='text-sm'>{m.message ?? m.text}</p>
                      <p className='text-xs mt-1 opacity-70'>
                        {m.timestamp ??
                          new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </p>
                    </div>
                  )}
                </div>
              ))}

            {isTyping && (
              <div className='flex justify-start'>
                <div className='px-4 py-3 rounded-2xl bg-gray-100'>
                  <div className='flex gap-1'>
                    <span className='w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]' />
                    <span className='w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]' />
                    <span className='w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]' />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className='p-4 bg-white border-t flex gap-2'>
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              placeholder='Type your message...'
              className='h-12'
            />
            <Button
              onClick={() => handleSendMessage()}
              className='rounded-full w-10 h-10 p-0 bg-[#0A5512] hover:bg-[#0A5512]/90'
            >
              <Send className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Offer Modal ─────────────────────────────────────────────────── */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => !open && setModalView(null)}
      >
        <DialogContent
          className='p-0 overflow-hidden rounded-3xl border-0 shadow-2xl'
          style={{
            maxWidth: modalView === "accept-reject" ? 420 : 500,
            width: "95vw",
          }}
          showCloseButton={false}
        >
          {modalView === "create" && (
            <CreateOfferView
              offerData={offerData}
              setOfferData={setOfferData}
              onPreview={() => setModalView("preview")}
              onClose={() => setModalView(null)}
              isEditing={!!editingOfferId}
            />
          )}

          {(modalView === "preview" || modalView === "sent") && (
            <PreviewOfferView
              offerData={offerData}
              onEdit={() => setModalView("create")}
              onSend={handleOfferSend}
              onClose={() => setModalView(null)}
              isSent={modalView === "sent"}
              isEditing={!!editingOfferId}
            />
          )}

          {/*
            AcceptRejectView needs:
            - offerId  → activeOffer._id
            - customerId → activeOffer.customer
              (the customer field your backend stores on the offer document)
          */}
          {modalView === "accept-reject" && activeOffer && (
            <AcceptRejectView
              offerData={offerData}
              offerId={activeOffer._id}
              customerId={
                activeOffer.customer ?? // field on the offer doc
                selectedUser?.members[0]?._id ?? // fallback: other chat member
                ""
              }
              onClose={handleAcceptRejectClose}
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
    </>
  );
}

export default function MessagesPage() {
  return (
    <SocketProvider>
      <MessagesPageInner />
    </SocketProvider>
  );
}
