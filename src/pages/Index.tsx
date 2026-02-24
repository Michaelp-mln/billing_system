import { useState, useCallback } from "react";
import { getContacts } from "@/lib/store";
import { ContactRecord, ClientStatus, STATUS_LABELS } from "@/types/contact";
import { ContactForm } from "@/components/ContactForm";
import { ContactList } from "@/components/ContactList";
import { Building2, Users, Phone, TrendingUp } from "lucide-react";

const Index = () => {
  const [contacts, setContacts] = useState<ContactRecord[]>(getContacts);
  const refresh = useCallback(() => setContacts(getContacts()), []);

  const today = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();
  const todayCount = contacts.filter((c) => c.contactDate === today).length;
  const uniqueClients = new Set(contacts.map((c) => c.clientName)).size;

  const statusCounts = contacts.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Contatos Hoje", value: todayCount, icon: Phone, color: "text-info" },
    { label: "Total de Clientes", value: uniqueClients, icon: Users, color: "text-accent" },
    { label: "Total de Registros", value: contacts.length, icon: TrendingUp, color: "text-success" },
    { label: "Em Andamento", value: statusCounts.em_andamento || 0, icon: Building2, color: "text-status-in-progress" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Painel de Cobrança</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Controle de contatos e status</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <section className="bg-card rounded-xl border p-5 shadow-sm">
          <h2 className="text-base font-semibold mb-4">Novo Registro de Contato</h2>
          <ContactForm onSaved={refresh} />
        </section>

        {/* List */}
        <section>
          <h2 className="text-base font-semibold mb-4">Contatos Registrados</h2>
          <ContactList contacts={contacts} onRefresh={refresh} />
        </section>
      </main>
    </div>
  );
};

export default Index;
