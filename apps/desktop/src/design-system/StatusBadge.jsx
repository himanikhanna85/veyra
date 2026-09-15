import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  PauseCircle,
  Square,
  XCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  PASS: {
    Icon: CheckCircle2,
    meaning: "Expected outcome held",
  },
  FAIL: {
    Icon: XCircle,
    meaning: "Application contradicted the expected outcome",
  },
  BLOCKED: {
    Icon: PauseCircle,
    meaning: "Veyra could not act with confidence",
  },
  ERROR: {
    Icon: AlertTriangle,
    meaning: "Veyra or its runtime failed",
  },
  INTERRUPTED: {
    Icon: Square,
    meaning: "Run stopped before a conclusion",
  },
  RUNNING: {
    Icon: LoaderCircle,
    meaning: "Execution is active",
  },
  QUEUED: {
    Icon: Clock3,
    meaning: "Waiting to execute",
  },
};

export function StatusBadge({ status, compact = false }) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    throw new Error(`Unsupported Veyra status: ${status}`);
  }

  const { Icon, meaning } = config;

  return (
    <span
      aria-label={`${status} — ${meaning}`}
      className={`status-badge${compact ? " status-badge--compact" : ""}`}
      data-status={status.toLowerCase()}
      role="status"
    >
      <Icon aria-hidden="true" size={compact ? 14 : 15} strokeWidth={2.2} />
      <span>{status}</span>
    </span>
  );
}
