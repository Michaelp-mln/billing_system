import { ClientStatus, STATUS_LABELS } from "@/types/contact";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<ClientStatus, string> = {
  negociando: "bg-status-negotiating/15 text-status-negotiating border-status-negotiating/30",
  em_andamento: "bg-status-in-progress/15 text-status-in-progress border-status-in-progress/30",
  sem_retorno: "bg-status-no-response/15 text-status-no-response border-status-no-response/30",
  finalizado: "bg-status-finished/15 text-status-finished border-status-finished/30",
  distrato: "bg-status-termination/15 text-status-termination border-status-termination/30",
};

export function StatusBadge({ status, className }: { status: ClientStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium border", statusStyles[status], className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
