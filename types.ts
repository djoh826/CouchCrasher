export interface User {
  uid: number;
  name: string;
  email: string;
  dob: string; // ISO date
  pictureurl?: string;
  address?: string;
  phone: string;
  emname?: string;
  emrel?: string;
  ememail?: string;
  isadmin?: boolean;
}

export interface Guest {
  uid: number;
  numguestratings?: number;
  avgguestratings?: number;
  creditcardno?: number;
  booking?: Booking[];
  guestpastbookings?: GuestPastBooking[];
  propertyreview?: PropertyReview[];
}

export interface Host {
  uid: number;
  numhostratings?: number;
  avghostratings?: number;
  avgpropertyrating?: number;
  bankaccountno?: number;
  property?: Property[];
}

export interface BankAccount {
  accountno: number;
  type?: string;
  host?: Host;
}

export interface CreditCard {
  cardno: number;
  csv: number;
  expiration: string; // ISO date
  name: string;
  address?: string;
  guest?: Guest[];
}

export interface Property {
  pid: number;
  name: string;
  hostuid: number;
  maxguests: number;
  numbedrooms: number;
  numbathrooms: number;
  description: string;
  cancelperiod: string;
  refundrate: number;
  numratings: number;
  avgratings: number;
  nightlyfee: number;
  cleaningfee: number;
  servicefee: number;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  latitude: number;
  longitude: number;
  propertyphotos?: PropertyPhoto[];
  propertycategories?: PropertyCategory[];
  propertyreview?: PropertyReview[];
  propertytimeslots?: PropertyTimeSlot[];
}

export interface PropertyPhoto {
  photoid: number;
  propertyid: number;
  photourl: string;
  thumbnailurl: string;
  isprimary: boolean;
  order: number;
}

export interface Category {
  categoryid: number;
  name: string;
}

export interface PropertyCategory {
  propertyid: number;
  categoryid: number;
  category?: Category;
}

export interface Booking {
  bid: number;
  guestuid: number;
  propertyid: number;
  checkin?: string; // ISO date
  checkout?: string; // ISO date
  numguest?: number;
  totalprice?: number;
  nightsstayed?: number;
  promotioncode?: string;
  tax?: number;
  cancellationdate?: string;
  refundedamount?: number;
}

export interface GuestPastBooking {
  guestuid: number;
  bid: number;
}

export interface Message {
  mid: number;
  guestuid: number;
  hostuid: number;
  datetime?: string; // ISO date
  receiver?: string;
  sender?: string;
  body?: string;
}

export interface PropertyReview {
  prid: number;
  guestuid: number;
  propertyid: number;
  comment?: string;
  propreviewdate?: string; // ISO date
  cleanlinessrating?: number;
  accuracyrating?: number;
  communicationrating?: number;
  checkinrating?: number;
  valuerating?: number;
  overallrating?: number;
  propertyreviewphotos?: PropertyReviewPhoto[];
}

export interface PropertyReviewPhoto {
  reviewphotoid: number;
  reviewid: number;
  photourl: string;
}

export interface PropertyTimeSlot {
  slotid: number;
  propertyid: number;
  startdate: string; // ISO date
  enddate: string; // ISO date
}
