import styles from "./Button.module.scss";

type ButtonLinkVariant = "primary" | "secondary" | "ghost";
type ButtonLinkSize = "sm" | "md" | "lg";

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonLinkVariant;
  size?: ButtonLinkSize;
  children: React.ReactNode;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: ButtonLinkProps) {
  const classes = [
    styles.button,
    styles[variant],
    size !== "md" && styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a className={classes} {...props}>
      {children}
    </a>
  );
}
