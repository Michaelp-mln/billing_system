import { useState } from "react";
import { ContactMethod, ClientStatus, CONTACT_METHOD_LABELS, STATUS_LABELS } from "@/types/contact";
import { saveContact } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface ContactFormProps {
  onSaved: () => void;
}

export function ContactForm({ onSaved }: ContactFormProps) {
  const [enterprise, setEnterprise] = useState("");
  const [clientName, setClientName] = useState("");
  const [unit, setUnit] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("telefone");
  const [contactDate, setContactDate] = useState(new Date().toISOString().split("T")[0]);
  const [observations, setObservations] = useState("");
  const [status, setStatus] = useState<ClientStatus>("em_andamento");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enterprise.trim() || !clientName.trim() || !unit.trim()) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    saveContact({ enterprise: enterprise.trim(), clientName: clientName.trim(), unit: unit.trim(), contactMethod, contactDate, observations: observations.trim(), status });
    toast.success("Contato registrado com sucesso!");
    setEnterprise("");
    setClientName("");
    setUnit("");
    setObservations("");
    setContactMethod("telefone");
    setStatus("em_andamento");
    setContactDate(new Date().toISOString().split("T")[0]);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="enterprise">Empreendimento *</Label>
          <Input id="enterprise" value={enterprise} onChange={(e) => setEnterprise(e.target.value)} placeholder="Ex: Bresser" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="clientName">Nome do Cliente *</Label>
          <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Ex: Edson Santos" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="unit">Unidade *</Label>
          <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Ex: 2308" />
        </div>
        <div className="space-y-1.5">
          <Label>Forma de Contato</Label>
          <Select value={contactMethod} onValueChange={(v) => setContactMethod(v as ContactMethod)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(CONTACT_METHOD_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contactDate">Data do Contato</Label>
          <Input id="contactDate" type="date" value={contactDate} onChange={(e) => setContactDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ClientStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="observations">Observações</Label>
        <Textarea id="observations" value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Descreva o resultado do contato..." rows={3} />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Registrar Contato
      </Button>
    </form>
  );
}
