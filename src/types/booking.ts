export interface Service {
  _id: string;
  title: string;
  category: string;
}

export interface Provider {
  _id: string;
  name: string;
  email: string;
  address: string;
}

export type BookingStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "CONFIRMED";

export interface Booking {
  _id: string;
  orderId: string;
  service: Service;
  provider: Provider;
  customer: string;
  scheduleId: string;
  slotId: string;
  slotStart: string;
  slotEnd: string;
  serviceDate: string;
  status: BookingStatus;
  amount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
