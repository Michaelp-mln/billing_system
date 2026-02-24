import { getClientHistory } from "@/lib/store";
import { CONTACT_METHOD_LABELS } from "@/types/contact";
import { StatusBadge } from "@/components/StatusBadge";
import { CalendarDays, MessageSquare, Phone } from "lucide-react";

interface ClientHistoryPanelProps {
  clientName: string;
}

export function ClientHistoryPanel({ clientName }: ClientHistoryPanelProps) {
  const history = getClientHistory(clientName);

  if (history.length === 0) {
    return <p className="text-muted-foreground py-4">Nenhum histórico encontrado.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">
        Total de contatos: <span className="font-semibold text-foreground">{history.length}</span>
      </p>
      <div className="space-y-3">
        {history.map((record, i) => (
          <div key={record.id} className="relative pl-6 pb-4 border-l-2 border-border last:border-l-0">
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono">{new Date(record.contactDate + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                </div>
                <StatusBadge status={record.status} />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {CONTACT_METHOD_LABELS[record.contactMethod]}
                  {record.contactInfo && <span className="ml-1">({record.contactInfo})</span>}
                </span>
                <span>{record.enterprise} — Un. {record.unit}</span>
              </div>
              {record.observations && (
                <div className="flex gap-2 text-sm">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <p>{record.observations}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
