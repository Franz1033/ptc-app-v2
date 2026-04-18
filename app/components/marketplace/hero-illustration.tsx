import Image from "next/image";

export function HeroIllustration() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#f9fcf7_0%,#ffffff_100%)] p-6 sm:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(104,153,78,0.12),rgba(255,255,255,0))]" />
      <Image
        src="/illustrations/undraw-online-shopping.svg"
        alt=""
        width={960}
        height={556}
        priority
        className="relative z-10 mx-auto h-auto w-full max-w-[560px]"
      />
    </div>
  );
}
