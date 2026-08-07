import Image from "next/image";
import styles from "./Influencers.module.scss";

interface ProfileImageProps {
  src: string;
  alt: string;
}

export function ProfileImage({ src, alt }: ProfileImageProps) {
  return (
    <div className={styles.imageWrapper}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 25vw"
        priority={false}
      />
    </div>
  );
}
