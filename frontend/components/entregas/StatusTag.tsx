import { Badge } from "@/components/ui/Badge";
import { getStatusMeta } from "@/lib/utils/status";
import type { StatusEntrega } from "@/types/entrega";

export function StatusTag({ status }: { status: StatusEntrega }) {
  const meta = getStatusMeta(status);
  return <Badge colorClass={meta.colorClass}>{meta.label}</Badge>;
}
