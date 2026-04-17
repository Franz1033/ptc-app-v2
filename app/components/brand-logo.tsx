import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  className = "h-8 w-auto",
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src="/ptc-logo.png"
      alt="PTC"
      width={1078}
      height={312}
      priority={priority}
      className={className}
    />
  );
}
