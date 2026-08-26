import Link from "next/link";
import styles from "./Button.module.scss";

type ButtonLinkVariant = "primary" | "secondary" | "ghost";
type ButtonLinkSize = "sm" | "md" | "lg";

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonLinkVariant;
  size?: ButtonLinkSize;
  children: React.ReactNode;
  href: string;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  children,
  className,
  href,
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

  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  );
}
