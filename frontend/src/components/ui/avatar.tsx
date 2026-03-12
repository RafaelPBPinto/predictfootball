import Image from "next/image";

type AvatarSize = "sm" | "md" | "lg";

const sizeMap: Record<AvatarSize, { px: number; text: string }> = {
  sm: { px: 32, text: "text-xs" },
  md: { px: 48, text: "text-base" },
  lg: { px: 64, text: "text-xl" },
};

interface AvatarProps {
  src: string | null;
  alt: string;
  size?: AvatarSize;
  fallback?: string;
  rounded?: boolean;
}

export function Avatar({ src, alt, size = "md", fallback, rounded = true }: AvatarProps) {
  const { px, text } = sizeMap[size];
  const roundedClass = rounded ? "rounded-full" : "rounded-lg";

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        className={`${roundedClass} object-cover`}
        style={{ width: px, height: px }}
      />
    );
  }

  const letter = fallback || alt.charAt(0).toUpperCase();
  return (
    <div
      className={`flex items-center justify-center bg-bg-elevated ${text} font-bold text-text-muted ${roundedClass}`}
      style={{ width: px, height: px }}
    >
      {letter}
    </div>
  );
}
