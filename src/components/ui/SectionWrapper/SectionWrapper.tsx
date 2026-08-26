import styles from "./SectionWrapper.module.scss";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  as?: "section" | "div";
  "aria-labelledby"?: string;
}

export function SectionWrapper({
  children,
  id,
  className,
  as: Tag = "section",
  ...props
}: SectionWrapperProps) {
  const classes = [styles.section, className].filter(Boolean).join(" ");

  return (
    <Tag id={id} className={classes} {...props}>
      <div className={styles.container}>{children}</div>
    </Tag>
  );
}
