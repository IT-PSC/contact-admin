import type { ContactLink, ContactType, Employee } from "./types";

export const CONTACT_TYPE_OPTIONS: { value: ContactType; labelKey: string }[] = [
  { value: "phone", labelKey: "phone" },
  { value: "telegram", labelKey: "telegram" },
  { value: "facebook", labelKey: "facebook" },
  { value: "tiktok", labelKey: "tiktok" },
  { value: "linkedin", labelKey: "linkedin" },
  { value: "whatsapp", labelKey: "whatsapp" },
  { value: "instagram", labelKey: "instagram" },
  { value: "website", labelKey: "website" },
  { value: "custom", labelKey: "custom" },
];

export function newContactId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyContact(type: ContactType = "phone"): ContactLink {
  return { id: newContactId(), type, value: "", label: "" };
}

export function contactsFromEmployee(employee?: Employee | null): ContactLink[] {
  if (!employee) return [emptyContact("phone")];
  if (employee.contacts?.length) {
    return employee.contacts.map((item) => ({
      id: item.id || newContactId(),
      type: item.type,
      value: item.value,
      label: item.label || "",
    }));
  }
  const legacy: ContactLink[] = [];
  const push = (type: ContactType, value: string) => {
    if (!value.trim()) return;
    legacy.push({ id: newContactId(), type, value: value.trim(), label: "" });
  };
  push("phone", employee.phone);
  push("telegram", employee.telegram);
  push("facebook", employee.facebook);
  push("tiktok", employee.tiktok);
  push("linkedin", employee.linkedin);
  return legacy.length > 0 ? legacy : [emptyContact("phone")];
}

export function sanitizeContacts(contacts: ContactLink[]): ContactLink[] {
  return contacts
    .map((item) => ({
      id: item.id || newContactId(),
      type: item.type,
      value: item.value.trim(),
      label: item.label.trim(),
    }))
    .filter((item) => item.value.length > 0);
}

export function legacyFieldsFromContacts(contacts: ContactLink[]) {
  const pick = (type: ContactType) =>
    contacts.find((item) => item.type === type)?.value ?? "";
  return {
    phone: pick("phone"),
    telegram: pick("telegram"),
    facebook: pick("facebook"),
    tiktok: pick("tiktok"),
    linkedin: pick("linkedin"),
  };
}

export function resolveEmployeeContacts(employee: Employee): ContactLink[] {
  if (employee.contacts?.length) return employee.contacts;
  return contactsFromEmployee(employee).filter((item) => item.value.trim());
}

export function contactHref(contact: ContactLink): string {
  const value = contact.value.trim();
  if (!value) return "#";
  if (contact.type === "phone" || contact.type === "whatsapp") {
    const digits = value.replace(/[^\d+]/g, "");
    if (contact.type === "whatsapp") {
      if (/^https?:\/\//i.test(value) || value.startsWith("wa.me/")) {
        return value.startsWith("http") ? value : `https://${value}`;
      }
      return `https://wa.me/${digits.replace(/^\+/, "")}`;
    }
    return `tel:${digits}`;
  }
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("t.me/") || value.startsWith("wa.me/")) return `https://${value}`;
  return `https://${value}`;
}

export function contactDisplayLabel(contact: ContactLink): string {
  if (contact.type === "custom" && contact.label.trim()) return contact.label.trim();
  return contact.value;
}
