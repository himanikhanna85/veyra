import { forwardRef } from "react";
import { LoaderCircle } from "lucide-react";

export const Button = forwardRef(function Button(
  {
    busy = false,
    children,
    className = "",
    disabled = false,
    icon: Icon,
    size = "default",
    variant = "secondary",
    ...props
  },
  ref,
) {
  const label = typeof children === "string" ? children : props["aria-label"];
  const buttonLabel = busy && label ? `${label} — Running` : props["aria-label"];
  const VisibleIcon = busy ? LoaderCircle : Icon;

  return (
    <button
      {...props}
      aria-busy={busy || undefined}
      aria-label={buttonLabel}
      aria-live={busy ? "polite" : undefined}
      className={`button button--${variant} button--${size} ${className}`.trim()}
      disabled={disabled || busy}
      ref={ref}
      type={props.type ?? "button"}
    >
      {VisibleIcon ? (
        <VisibleIcon
          aria-hidden="true"
          className={busy ? "button__spinner" : undefined}
          size={size === "compact" ? 15 : 17}
          strokeWidth={2}
        />
      ) : null}
      <span>{children}</span>
    </button>
  );
});
