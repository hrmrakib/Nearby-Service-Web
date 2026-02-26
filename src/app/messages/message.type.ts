export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IService {
  location: ILocation;
  _id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
}

export interface IOfferItem {
  title: string;
  quantity: number;
  unitPrice: number;
  _id: string;
}

export interface IOffer {
  _id: string;
  chat: string;
  provider: string;
  customer: string;
  service: IService;
  description: string;
  date: string;
  from: string;
  to: string;
  items: IOfferItem[];
  discount: number;
  status: "draft" | "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ISender {
  _id: string;
  name: string;
  image: string;
}

export interface IMessage {
  isOwner: boolean;
  _id: string;
  chat: string;
  sender: ISender;
  message: string;
  offer?: IOffer | null;
  type: "text" | "offer";
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMessageMeta {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
}

export interface IMessageResponse {
  success: boolean;
  message: string;
  meta: IMessageMeta;
  data: IMessage[];
}
