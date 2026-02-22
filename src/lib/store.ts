import { ContactRecord } from "@/types/contact";

const STORAGE_KEY = "cobranca_contacts";

export function getContacts(): ContactRecord[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveContact(contact: Omit<ContactRecord, "id" | "createdAt" | "updatedAt">): ContactRecord {
  const contacts = getContacts();
  const now = new Date().toISOString();
  const newContact: ContactRecord = {
    ...contact,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  contacts.unshift(newContact);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return newContact;
}

export function updateContact(id: string, updates: Partial<ContactRecord>): ContactRecord | null {
  const contacts = getContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return null;
  contacts[index] = { ...contacts[index], ...updates, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return contacts[index];
}

export function deleteContact(id: string): boolean {
  const contacts = getContacts();
  const filtered = contacts.filter((c) => c.id !== id);
  if (filtered.length === contacts.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function getClientHistory(clientName: string): ContactRecord[] {
  return getContacts().filter(
    (c) => c.clientName.toLowerCase() === clientName.toLowerCase()
  );
}

export function getUniqueClients(): string[] {
  const contacts = getContacts();
  return [...new Set(contacts.map((c) => c.clientName))];
}
