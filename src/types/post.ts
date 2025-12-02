/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Author {
  _id: string;
  name: string;
  email: string;
  image: string;
}

export interface GeoPoint {
  type: "Point";
  coordinates: number[]; // [lng, lat]
}

export interface EventItem {
  _id: string;
  author: Author;

  image: string;
  media: string[];

  title: string;
  description: string;

  startDate: string | null;
  startTime: string | null;
  endDate: string | null;

  address: string | null;
  location: GeoPoint;

  hasTag: string[];

  views: number;
  likes: number;

  price: number | null;

  category: string | null;
  subcategory: string | null;
  serviceType: string | null;

  // Missing person fields
  missingName: string | null;
  missingAge: number | null;
  clothingDescription: string | null;

  lastSeenLocation: GeoPoint;
  lastSeenDate: string | null;

  contactInfo: string | null;

  expireLimit: number | null;
  capacity: number | null;

  amenities: string[] | null;
  licenses: string[] | null;

  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";

  boost: boolean;
  boostPriority: number;

  attenders: string[];
  isSaved: boolean;
  totalSaved: number;

  schedule: any[]; // If you want strong typing, tell me the structure

  averageRating: number | null;
  reviewsCount: number;

  createdAt: string;
  updatedAt: string;
}
