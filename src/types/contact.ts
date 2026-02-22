export type ContactMethod = "telefone" | "whatsapp" | "email" | "presencial";

export type ClientStatus = "negociando" | "em_andamento" | "sem_retorno" | "finalizado" | "distrato";

export interface ContactRecord {
  id: string;
  enterprise: string;
  clientName: string;
  unit: string;
  contactMethod: ContactMethod;
  contactDate: string;
  observations: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABELS: Record<ClientStatus, string> = {
  negociando: "Negociando",
  em_andamento: "Em andamento",
  sem_retorno: "Sem retorno",
  finalizado: "Finalizado",
  distrato: "Distrato",
};

export const CONTACT_METHOD_LABELS: Record<ContactMethod, string> = {
  telefone: "Telefone",
  whatsapp: "WhatsApp",
  email: "E-mail",
  presencial: "Presencial",
};
