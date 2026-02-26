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
  service: string;
  serviceDetails: string;
  date: string;
  fromTime: string;
  toTime: string;
  discount: string;
  items: ServiceItem[];
}

type ModalView = "create" | "preview" | "sent" | "accept-reject";

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

        {/* Service Items Breakdown */}
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

  const description =
    offerData.serviceDetails ||
    "Lorem ipsum dolor sit amet consectetur. Turpis montes euismod nunc odio ut imperdiet proin enim. Porttitor amet dolor nisi tempor amet dolor. Orci faucibus dui nunc diam....";
  const shortDesc =
    description.length > 120 ? description.slice(0, 120) + "..." : description;

  return (
    <div className='flex flex-col max-h-[85vh]'>
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

function defaultOfferData(): OfferData {
  return {
    service: "",
    serviceDetails: "",
    date: "",
    fromTime: "",
    toTime: "",
    discount: "",
    items: [{ id: generateId(), title: "", quantity: "", unitPrice: "" }],
  };
}

function OfferCard({ offer }: { offer: any }) {
  const [expanded, setExpanded] = useState(false);

  const subtotal = offer.items.reduce(
    (acc: number, item: any) => acc + item.quantity * item.unitPrice,
    0,
  );
  const discountAmount = (subtotal * offer.discount) / 100;
  const total = subtotal - discountAmount;

  const date = new Date(offer.date);
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

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
            <MapPin className='w-3 h-3 text-green-600' />
            {offer.service?.subcategory ?? "Service"}
          </span>
          <span className='flex items-center gap-0.5'>
            <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
            {offer.discount}% off
          </span>
        </div>

        <div className='flex items-center gap-1 mt-1.5 text-xs text-gray-500'>
          <Calendar className='w-3 h-3 text-green-600' />
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
            {offer.items.map((item: any) => (
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
              <div className='flex justify-between text-xs text-green-600'>
                <span>Discount ({offer.discount}%)</span>
                <span>-${discountAmount.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        <div className='mt-2 pt-2 border-t'>
          <p className='text-sm font-bold text-gray-900'>
            Total: ${total.toLocaleString()}
          </p>
        </div>

        {offer.status === "draft" && (
          <span className='inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium'>
            Pending
          </span>
        )}
      </div>
    </div>
  );
}

function MessagesPageInner() {
  const [chatId, setChatId] = useState("");
  const [selectedUser, setSelectedUser] = useState<Conversation>();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [searchMessageQuery, setSearchMessageQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [openSearchMessage, setOpenSearchMessage] = useState(false);
  const [inboxUserLists, setInboxUserLists] = useState([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedSearchMessageQuery = useDebounce(searchMessageQuery, 500);

  const { socket, onlineUsers } = useSocket();

  // Offer modal state
  const [modalView, setModalView] = useState<ModalView | null>(null);
  const [offerData, setOfferData] = useState<OfferData>(defaultOfferData());
  const [offerResult, setOfferResult] = useState<
    "accepted" | "rejected" | null
  >(null);
  const [inboxPage, setInboxPage] = useState(1);

  const { data: inboxChats, isFetching: inboxChatsFetching } =
    useGetInboxChatsQuery({
      page: inboxPage,
      limit: 10,
      search: debouncedSearchQuery,
    });

  const { data: messagesResponse, isFetching: messagesFetching } =
    useGetMessagesQuery(
      {
        page: 1,
        limit: 300,
        search: debouncedSearchMessageQuery,
        chat_id: selectedUser?._id!,
      },
      {
        skip: !selectedUser?._id,
      },
    );

  // ✅ Fix 1: Wrap in useMemo so the array reference is stable between renders
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
    if (inboxChats?.data) {
      setInboxUserLists(inboxChats?.data);
    }
  }, [inboxChats?.data]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    if (!selectedUser) {
      toast.error("Please select a conversation to send a message.");
    }
    if (!socket) return;

    const newMessage = {
      _id: Date.now().toString(),
      message: messageText,
      isOwner: true,
      type: "text",
      offer: null,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send-message", {
      chat: "6932c1bc933f5528d63c0330",
      sender: selectedUser?._id,
      message: messageText,
      isOwner: true,
    });

    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");
    // setIsTyping(true);
    // setTimeout(() => setIsTyping(false), 2000);
  };

  const handleConversationSelect = async (user: Conversation) => {
    setMessages([]);
    setSelectedUser(user);
    setShowChat(true);
  };

  // Offer modal handlers
  const handleOpenCreateOffer = () => {
    setOfferData(defaultOfferData());
    setModalView("create");
  };

  const handleOfferSend = () => {
    setModalView("sent");
  };

  const handleAcceptReject = (result: "accepted" | "rejected" | "closed") => {
    setModalView(null);
    if (result === "accepted" || result === "rejected") {
      setOfferResult(result);
      setTimeout(() => setOfferResult(null), 4000);
    }
  };

  const isModalOpen = modalView !== null;

  return (
    <>
      <div className='flex h-[calc(100vh-90px)] overflow-hidden bg-gray-50'>
        {/* Sidebar */}
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

        {/* Chat Panel */}
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
                className='w-max h-12! bg-white flex items-center gap-2 text-green-700 font-semibold rounded-sm shadow px-2 py-1.5 hover:bg-green-50 transition-colors'
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
            {/* messages placeholder in loading */}
            {messagesFetching && (
              <div className='space-y-4'>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`h-10 rounded-2xl bg-gray-200 animate-pulse ${
                        i % 2 === 0
                          ? `w-${["40", "56", "48"][i % 3]}`
                          : `w-${["32", "44", "36"][i % 3]}`
                      }`}
                      style={{
                        width: `${[140, 200, 160, 120, 180, 100][i]}px`,
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
                            m.isOwner || m.sender === "user"
                              ? "bg-[#0A5512] text-white self-end"
                              : "bg-gray-100 self-start",
                          )}
                        >
                          <p className='text-sm'>{m.message} </p>
                        </div>
                      )}
                      <OfferCard offer={m.offer} />
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
                        m.isOwner || m.sender === "user"
                          ? "bg-[#0A5512] text-white"
                          : "bg-gray-100",
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
              onClick={handleSendMessage}
              className='rounded-full w-10 h-10 p-0 bg-[#0A5512] hover:bg-[#0A5512]/90'
            >
              <Send className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
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
            />
          )}

          {(modalView === "preview" || modalView === "sent") && (
            <PreviewOfferView
              offerData={offerData}
              onEdit={() => setModalView("create")}
              onSend={handleOfferSend}
              onClose={() => setModalView(null)}
              isSent={modalView === "sent"}
            />
          )}

          {modalView === "accept-reject" && (
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
