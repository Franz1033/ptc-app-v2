import { AuthForm } from "@/app/components/auth/auth-form";

type AuthShellProps = {
  mode: "sign-in" | "sign-up";
  nextPath: string;
};

export function AuthShell({ mode, nextPath }: AuthShellProps) {
  return (
    <main className="fixed inset-0 z-10 h-[100dvh] w-[100vw] overflow-hidden bg-[#ecfaef]">
      <div className="h-full w-full overflow-y-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-full w-full max-w-5xl items-start justify-center pt-[clamp(1rem,6dvh,4.25rem)] pb-[clamp(1rem,2.75dvh,2rem)]">
          <div className="w-full max-w-[460px] rounded-[30px] border border-white/70 bg-white px-6 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-7 sm:py-7">
            <AuthForm mode={mode} nextPath={nextPath} />
          </div>
        </div>
      </div>
    </main>
  );
}
