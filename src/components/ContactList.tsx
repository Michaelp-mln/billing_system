import { useState } from "react";
import { ContactRecord, STATUS_LABELS, CONTACT_METHOD_LABELS, ClientStatus } from "@/types/contact";
import { StatusBadge } from "@/components/StatusBadge";
import { updateContact, deleteContact } from "@/lib/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, History, Search, Pencil, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ClientHistoryPanel } from "@/components/ClientHistoryPanel";

interface ContactListProps {
  contacts: ContactRecord[];
  onRefresh: () => void;
}

export function ContactList({ contacts, onRefresh }: ContactListProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingObs, setEditingObs] = useState("");

  const filtered = contacts.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.enterprise.toLowerCase().includes(search.toLowerCase()) ||
      c.unit.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: ClientStatus) => {
    updateContact(id, { status: newStatus });
    toast.success("Status atualizado!");
    onRefresh();
  };

  const handleDelete = (id: string) => {
    deleteContact(id);
    toast.success("Contato removido.");
    onRefresh();
  };

  const startEditObs = (c: ContactRecord) => {
    setEditingId(c.id);
    setEditingObs(c.observations);
  };

  const saveObs = (id: string) => {
    updateContact(id, { observations: editingObs.trim() });
    setEditingId(null);
    toast.success("Observação atualizada!");
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, empreendimento ou unidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">Nenhum contato encontrado</p>
          <p className="text-sm mt-1">Registre seu primeiro contato acima.</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Empreendimento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="animate-fade-in">
                  <TableCell className="whitespace-nowrap text-sm font-mono">
                    {new Date(c.contactDate + "T00:00:00").toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="font-medium">{c.enterprise}</TableCell>
                  <TableCell>{c.clientName}</TableCell>
                  <TableCell>{c.unit}</TableCell>
                  <TableCell className="text-sm">
                    <div>{CONTACT_METHOD_LABELS[c.contactMethod]}</div>
                    {c.contactInfo && <div className="text-xs text-muted-foreground">{c.contactInfo}</div>}
                  </TableCell>
                  <TableCell>
                    <Select value={c.status} onValueChange={(v) => handleStatusChange(c.id, v as ClientStatus)}>
                      <SelectTrigger className="h-8 w-36 border-0 p-0 shadow-none">
                        <StatusBadge status={c.status} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    {editingId === c.id ? (
                      <div className="flex items-start gap-1">
                        <Textarea
                          value={editingObs}
                          onChange={(e) => setEditingObs(e.target.value)}
                          rows={2}
                          className="text-sm min-w-[150px]"
                          autoFocus
                        />
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-primary" onClick={() => saveObs(c.id)}>
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setEditingId(null)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 group cursor-pointer" onClick={() => startEditObs(c)}>
                        <span className="truncate text-sm text-muted-foreground">{c.observations || "—"}</span>
                        <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Histórico">
                            <History className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Histórico — {c.clientName}</DialogTitle>
                          </DialogHeader>
                          <ClientHistoryPanel clientName={c.clientName} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(c.id)} title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
