"use client";

import { useState } from "react";
import { X, Calendar, Clock, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  useGetCompletedBookingsQuery,
  useGetInCompletingBookingsQuery,
} from "@/redux/features/clientBooking/clientBookingAPI";

interface ServiceItem {
  title: string;
  quantity: number;
  unitPrice: number;
  _id: string;
}

interface Provider {
  _id: string;
  name: string;
  email: string;
  address: string;
  image: string;
}

interface Service {
  _id: string;
  title: string;
  category: string;
}

interface Booking {
  _id: string;
  chat: string;
  provider: Provider;
  customer: string;
  service: Service;
  description: string;
  date: string;
  from: string;
  to: string;
  items: ServiceItem[];
  discount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(t: string) {
  // "10:00" → "10:00 AM"
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
}

function calcServiceCost(items: ServiceItem[]) {
  return items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"completed" | "incomplete">(
    "completed",
  );

  const { data: completedRes, isLoading: loadingCompleted } =
    useGetCompletedBookingsQuery({});
  const { data: incompleteRes, isLoading: loadingIncomplete } =
    useGetInCompletingBookingsQuery({});

  const completedBookings: Booking[] = completedRes?.data || [];
  const incompleteBookings: Booking[] = incompleteRes?.data || [];

  const displayedBookings =
    activeTab === "completed" ? completedBookings : incompleteBookings;
  const isLoading =
    activeTab === "completed" ? loadingCompleted : loadingIncomplete;

  const handleCardClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBooking(null), 300);
  };

  // Derived values for the selected booking modal
  const serviceCost = selectedBooking
    ? calcServiceCost(selectedBooking.items)
    : 0;
  const total = selectedBooking ? serviceCost - selectedBooking.discount : 0;

  return (
    <div className='min-h-screen bg-[#F3F4F6]'>
      {/* Header */}
      <header className='bg-[#F3F4F6] border-b border-gray-200'>
        <div className='container mx-auto py-4 sm:py-6'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => router.back()}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            >
              <ArrowLeft className='w-6 h-6 text-gray-700' />
            </button>
            <h1 className='text-xl sm:text-2xl font-bold text-[#1F2937]'>
              Client Bookings
            </h1>
          </div>
        </div>
      </header>

      <div className='container mx-auto mt-6'>
        {/* Tabs */}
        <div className='max-w-80 flex bg-white rounded-xl border border-gray-200 p-1 mb-6 shadow-sm'>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "completed"
                ? "bg-[#15B826] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("incomplete")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "incomplete"
                ? "bg-[#15B826] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Incomplete
          </button>
        </div>

        {/* Main Content */}
        <main className='py-4 sm:py-6'>
          {isLoading ? (
            <p className='text-gray-500 text-sm'>Loading bookings…</p>
          ) : displayedBookings.length === 0 ? (
            <p className='text-gray-500 text-sm'>No bookings found.</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
              {displayedBookings.map((booking) => (
                <Card
                  key={booking._id}
                  className='overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
                  onClick={() => handleCardClick(booking)}
                >
                  <div className='px-4 sm:px-5 py-4'>
                    <div className='flex gap-4'>
                      {/* Provider image */}
                      <div className='flex-shrink-0'>
                        <img
                          src={booking.provider.image}
                          alt={booking.provider.name}
                          className='w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover'
                        />
                      </div>

                      {/* Content */}
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-lg sm:text-xl font-semibold text-gray-900 truncate'>
                          {booking.service.title}
                        </h3>
                        <div className='flex items-center gap-2 mt-2 text-sm text-gray-600'>
                          <Calendar className='w-4 h-4 flex-shrink-0 text-[#108F1E]' />
                          <span className='truncate'>
                            {formatDate(booking.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto p-0'>
          {selectedBooking && (
            <>
              {/* Modal Header */}
              <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  Order Details
                </h2>
                <button
                  onClick={handleCloseModal}
                  className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                >
                  <X className='w-5 h-5 text-gray-600' />
                </button>
              </div>

              {/* Modal Body */}
              <div className='px-6 py-6 space-y-6'>
                {/* Service title & category */}
                <div>
                  <h3 className='text-2xl font-bold text-gray-900'>
                    {selectedBooking.service.title}
                  </h3>
                  <p className='text-gray-600 mt-1 capitalize'>
                    {selectedBooking.service.category}
                  </p>
                </div>

                {/* Order meta */}
                <div className='space-y-3 bg-gray-50 p-4 rounded-lg'>
                  <div>
                    <p className='text-sm text-gray-600'>Order</p>
                    <p className='font-semibold text-gray-900'>
                      #{selectedBooking._id}
                    </p>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <div className='flex items-center gap-2 text-gray-600 text-sm'>
                      <Calendar className='w-4 h-4' />
                      <span>{formatDate(selectedBooking.date)}</span>
                    </div>
                    <div className='flex items-center gap-2 text-gray-600 text-sm'>
                      <Clock className='w-4 h-4' />
                      <span>
                        {formatTime(selectedBooking.from)} -{" "}
                        {formatTime(selectedBooking.to)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className='text-gray-700 text-sm leading-relaxed'>
                    {selectedBooking.description}
                  </p>
                </div>

                {/* Service Items Breakdown */}
                <div>
                  <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                    Service Items Breakdown
                  </h4>
                  <div className='space-y-4'>
                    {selectedBooking.items.map((item) => (
                      <div
                        key={item._id}
                        className='border-b border-gray-200 pb-4 last:border-0'
                      >
                        <h5 className='font-semibold text-gray-900 mb-2'>
                          {item.title}
                        </h5>
                        <div className='space-y-1 text-sm text-gray-700'>
                          <div className='flex justify-between'>
                            <span>Quantity</span>
                            <span className='font-medium'>
                              : {item.quantity}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span>Unit Price</span>
                            <span className='font-medium'>
                              : ${item.unitPrice}
                            </span>
                          </div>
                          <div className='flex justify-between font-semibold text-gray-900'>
                            <span>Line Total</span>
                            <span>: ${item.quantity * item.unitPrice}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className='border-t border-gray-200 pt-6'>
                  <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                    Price Summary
                  </h4>
                  <div className='space-y-3'>
                    <div className='flex justify-between text-gray-700'>
                      <span>Service:</span>
                      <span>${serviceCost}</span>
                    </div>
                    <div className='flex justify-between text-gray-700'>
                      <span>Discount:</span>
                      <span>${selectedBooking.discount}</span>
                    </div>
                    <div className='flex justify-between items-center pt-3 border-t border-gray-200'>
                      <span className='font-bold text-gray-900'>Total:</span>
                      <span className='text-2xl font-bold text-gray-900'>
                        ${total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import {
//   ChevronLeft,
//   X,
//   Calendar,
//   Clock,
//   MoveLeft,
//   ArrowLeft,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Card } from "@/components/ui/card";
// import { useRouter } from "next/navigation";
// import {
//   useGetCompletedBookingsQuery,
//   useGetInCompletingBookingsQuery,
// } from "@/redux/features/clientBooking/clientBookingAPI";

// interface ServiceItem {
//   name: string;
//   quantity: number;
//   unitPrice: number;
//   lineTotal: number;
// }

// interface Order {
//   id: string;
//   title: string;
//   category: string;
//   date: string;
//   image: string;
//   orderNumber: string;
//   dateScheduled: string;
//   timeSlot: string;
//   description: string;
//   services: ServiceItem[];
//   serviceCost: number;
//   discount: number;
//   total: number;
// }

// const ORDERS_DATA: Order[] = [
//   {
//     id: "1",
//     title: "Plumbing Services",
//     category: "Personal/Home Services",
//     date: "January 19, 2026",
//     image:
//       "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop",
//     orderNumber: "#64145XXXXXXXXXX",
//     dateScheduled: "July 30, 2025",
//     timeSlot: "09:30 AM - 11:00 PM",
//     description:
//       "Lorem ipsum dolor sit amet consectetur. Turpis montes euismod nunc odio ut imperdiet proin enim. Porttitor amet dolor nisl tempor amet dolor. Orci faucibus dui nunc diam....",
//     services: [
//       {
//         name: "Pipe Replacement",
//         quantity: 2,
//         unitPrice: 100,
//         lineTotal: 200,
//       },
//       {
//         name: "Drain Cleaning",
//         quantity: 1,
//         unitPrice: 150,
//         lineTotal: 150,
//       },
//     ],
//     serviceCost: 350,
//     discount: 50,
//     total: 300,
//   },
//   {
//     id: "2",
//     title: "Cozy Coffee Spot",
//     category: "Food & Beverage",
//     date: "January 19, 2026",
//     image:
//       "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=200&h=200&fit=crop",
//     orderNumber: "#64145XXXXXXXXXX",
//     dateScheduled: "July 28, 2025",
//     timeSlot: "10:00 AM - 11:30 AM",
//     description:
//       "Enjoy a delightful coffee experience with premium beans sourced from around the world. Fresh pastries and desserts available daily...",
//     services: [
//       {
//         name: "Cappuccino",
//         quantity: 2,
//         unitPrice: 5,
//         lineTotal: 10,
//       },
//       {
//         name: "Croissant",
//         quantity: 2,
//         unitPrice: 4,
//         lineTotal: 8,
//       },
//     ],
//     serviceCost: 18,
//     discount: 2,
//     total: 16,
//   },
//   {
//     id: "3",
//     title: "DJ Performance",
//     category: "Entertainment",
//     date: "January 19, 2026",
//     image:
//       "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=200&h=200&fit=crop",
//     orderNumber: "#64145XXXXXXXXXX",
//     dateScheduled: "August 5, 2025",
//     timeSlot: "08:00 PM - 2:00 AM",
//     description:
//       "Professional DJ services for your event. High-quality sound system and extensive music library guaranteed to keep your guests entertained...",
//     services: [
//       {
//         name: "DJ Services (4 hours)",
//         quantity: 1,
//         unitPrice: 400,
//         lineTotal: 400,
//       },
//       {
//         name: "Sound System Rental",
//         quantity: 1,
//         unitPrice: 200,
//         lineTotal: 200,
//       },
//     ],
//     serviceCost: 600,
//     discount: 100,
//     total: 500,
//   },
// ];

// export default function OrdersPage() {
//   const router = useRouter();
//   const [selectedBooking, setSelectedBooking] = useState<Order | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<"completed" | "incomplete">(
//     "completed",
//   );

//   const { data: completed } = useGetCompletedBookingsQuery({});
//   const { data: incomplete } = useGetInCompletingBookingsQuery({});

//   const completedBookings = completed?.data || [];
//   const incompleteBookings = incomplete?.data || [];

//   const handleCardClick = (order: Order) => {
//     setSelectedBooking(order);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setTimeout(() => setSelectedBooking(null), 300);
//   };

//   return (
//     <div className='min-h-screen bg-[#F3F4F6]'>
//       {/* Header */}
//       <header className='bg-[#F3F4F6] border-b border-gray-200'>
//         <div className='container mx-auto py-4 sm:py-6'>
//           <div className='flex items-center gap-3'>
//             <button
//               onClick={() => router.back()}
//               className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
//             >
//               <ArrowLeft className='w-6 h-6 text-gray-700' />
//             </button>
//             <h1 className='text-xl sm:text-2xl font-bold text-[#1F2937]'>
//               Client Bookings
//             </h1>
//           </div>
//         </div>
//       </header>

//       <div className='container mx-auto mt-6'>
//         {/* Tabs */}
//         <div className='max-w-80 flex bg-white rounded-xl border border-gray-200 p-1 mb-6 shadow-sm'>
//           <button
//             onClick={() => setActiveTab("completed")}
//             className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
//               activeTab === "completed"
//                 ? "bg-[#15B826] text-white shadow-sm"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Completed
//           </button>
//           <button
//             onClick={() => setActiveTab("incomplete")}
//             className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
//               activeTab === "incomplete"
//                 ? "bg-[#15B826] text-white shadow-sm"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Incomplete
//           </button>
//         </div>

//         {/* Main Content */}
//         <main className='py-4 sm:py-6'>
//           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
//             {ORDERS_DATA.map((order) => (
//               <Card
//                 key={order.id}
//                 className='overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
//                 onClick={() => handleCardClick(order)}
//               >
//                 <div className='px-4 sm:px-5'>
//                   <div className='flex gap-4'>
//                     {/* Image */}
//                     <div className='flex-shrink-0'>
//                       <img
//                         src={order.image}
//                         alt={order.title}
//                         className='w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover'
//                       />
//                     </div>

//                     {/* Content */}
//                     <div className='flex-1 min-w-0'>
//                       <h3 className='text-lg sm:text-xl font-semibold text-gray-900 truncate'>
//                         {order.title}
//                       </h3>
//                       <div className='flex items-center gap-2 mt-2 text-sm text-gray-600'>
//                         <Calendar className='w-4 h-4 flex-shrink-0 text-[#108F1E]' />
//                         <span className='truncate'>{order.date}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </main>
//       </div>

//       {/* Detail Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto p-0'>
//           {selectedBooking && (
//             <>
//               {/* Modal Header */}
//               <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
//                 <h2 className='text-xl font-semibold text-gray-900'>
//                   Order Details
//                 </h2>
//                 <button
//                   onClick={handleCloseModal}
//                   className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
//                 >
//                   <X className='w-5 h-5 text-gray-600' />
//                 </button>
//               </div>

//               {/* Modal Body */}
//               <div className='px-6 py-6 space-y-6'>
//                 {/* Order Title and Category */}
//                 <div>
//                   <h3 className='text-2xl font-bold text-gray-900'>
//                     {selectedBooking.title}
//                   </h3>
//                   <p className='text-gray-600 mt-1'>
//                     {selectedBooking.category}
//                   </p>
//                 </div>

//                 {/* Order Number and Date/Time */}
//                 <div className='space-y-3 bg-gray-50 p-4 rounded-lg'>
//                   <div>
//                     <p className='text-sm text-gray-600'>Order</p>
//                     <p className='font-semibold text-gray-900'>
//                       {selectedBooking.orderNumber}
//                     </p>
//                   </div>
//                   <div className='flex flex-col sm:flex-row gap-4'>
//                     <div>
//                       <div className='flex items-center gap-2 text-gray-600 text-sm'>
//                         <Calendar className='w-4 h-4' />
//                         <span>{selectedBooking.dateScheduled}</span>
//                       </div>
//                     </div>
//                     <div>
//                       <div className='flex items-center gap-2 text-gray-600 text-sm'>
//                         <Clock className='w-4 h-4' />
//                         <span>{selectedBooking.timeSlot}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <p className='text-gray-700 text-sm leading-relaxed'>
//                     {selectedBooking.description}
//                     <button className='text-green-600 hover:text-green-700 font-medium ml-1'>
//                       Read more
//                     </button>
//                   </p>
//                 </div>

//                 {/* Service Items Breakdown */}
//                 <div>
//                   <h4 className='text-lg font-semibold text-gray-900 mb-4'>
//                     Service Items Breakdown
//                   </h4>
//                   <div className='space-y-4'>
//                     {selectedBooking.services.map((service, index) => (
//                       <div
//                         key={index}
//                         className='border-b border-gray-200 pb-4 last:border-0'
//                       >
//                         <h5 className='font-semibold text-gray-900 mb-2'>
//                           {service.name}
//                         </h5>
//                         <div className='space-y-1 text-sm text-gray-700'>
//                           <div className='flex justify-between'>
//                             <span>Quantity</span>
//                             <span className='font-medium'>
//                               : {service.quantity}
//                             </span>
//                           </div>
//                           <div className='flex justify-between'>
//                             <span>Unit Price</span>
//                             <span className='font-medium'>
//                               : ${service.unitPrice}
//                             </span>
//                           </div>
//                           <div className='flex justify-between font-semibold text-gray-900'>
//                             <span>Line Total</span>
//                             <span>: ${service.lineTotal}</span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Price Summary */}
//                 <div className='border-t border-gray-200 pt-6'>
//                   <h4 className='text-lg font-semibold text-gray-900 mb-4'>
//                     Price Summary
//                   </h4>
//                   <div className='space-y-3'>
//                     <div className='flex justify-between text-gray-700'>
//                       <span>Service:</span>
//                       <span>${selectedBooking.serviceCost}</span>
//                     </div>
//                     <div className='flex justify-between text-gray-700'>
//                       <span>Discount:</span>
//                       <span>${selectedBooking.discount}</span>
//                     </div>
//                     <div className='flex justify-between items-center pt-3 border-t border-gray-200'>
//                       <span className='font-bold text-gray-900'>Total:</span>
//                       <span className='text-2xl font-bold text-gray-900'>
//                         ${selectedBooking.total}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className='flex gap-3 pt-4'>
//                   <Button variant='outline' className='flex-1'>
//                     Contact Support
//                   </Button>
//                   <Button className='flex-1 bg-green-600 hover:bg-green-700'>
//                     Download Invoice
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
