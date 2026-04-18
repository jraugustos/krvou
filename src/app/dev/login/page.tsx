import { devLoginAction } from "@/actions/dev-login";
import { Button } from "@/components/ui/button";

export default function DevLoginPage() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-5">
      <h1 className="font-pixel text-primary text-lg uppercase">Dev Login</h1>
      <p className="font-heading text-on-surface-variant text-sm">
        dev@krvou.test
      </p>
      <form action={devLoginAction}>
        <Button type="submit" variant="default" size="lg">
          Entrar como Dev
        </Button>
      </form>
    </div>
  );
}
