import { Record } from "airtable"

export interface DeliveryArea {
  id: string
  addressCount?: number
}

export interface PostcodesResult {
  status: number;
  result?: PostcodeResultElement[];
  error?: string
}

export interface PostcodeResultElement {
  query: string;
  result: PostcodeData;
}

export interface PostcodeData {
  postcode: string;
  quality: number;
  eastings: number;
  northings: number;
  country: string;
  nhs_ha: string;
  longitude: number;
  latitude: number;
  european_electoral_region: string;
  primary_care_trust: string;
  region: string;
  lsoa: string;
  msoa: string;
  incode: string;
  outcode: string;
  parliamentary_constituency: string;
  admin_district: string;
  parish: string;
  admin_county: null | string;
  admin_ward: string;
  ced: null | string;
  ccg: string;
  nuts: string;
  codes: PostcodeCodes;
}

export interface PostcodeCodes {
  admin_district: string;
  admin_county: string;
  admin_ward: string;
  parish: string;
  parliamentary_constituency: string;
  ccg: string;
  ccg_id: string;
  ced: string;
  nuts: string;
}

export interface AirtableResult<T> {
  records: Record<T>[];
}

export interface AddressFields {
  PostCode: string;
  "Address Line 2": string;
  "Next delivery date": Date;
  "Address Line 1": string;
  Areas: string[];
  "Full Address": string;
  Deliveries?: string[];
  "Next delivery status"?: string[];
  "Next delivery agent"?: string[];
}

export interface DepotFields {
  Name: string;
  "Volunteer link": string;
  "Contact phone": string;
  Address: string;
  Postcode: string;
  Description: string;
  "Has food?": boolean;
}