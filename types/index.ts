export type RsvpStatus = "PENDING" | "ATTENDING" | "DECLINED" | "MAYBE";
export type ContactMethod = "EMAIL" | "WHATSAPP" | "SMS" | "MANUAL";
export type DeliveryStatus = "SENT" | "DELIVERED" | "FAILED" | "PENDING";
export type MessageType = "INVITATION" | "REMINDER" | "CONFIRMATION" | "CUSTOM";

export interface EventData {
  id: string;
  title: string;
  coupleNames: string;
  date: Date;
  time: string;
  venue: string;
  address: string;
  mapUrl: string | null;
  dressCode: string | null;
  message: string | null;
  rules: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  primaryColor: string;
  accentColor: string;
  fontDisplay: string;
  fontBody: string;
  backgroundStyle: "DARK" | "LIGHT" | "IMAGE";
}
