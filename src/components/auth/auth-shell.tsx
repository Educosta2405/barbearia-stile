import { Card, CardBody } from "@/components/ui/card";
import { BrandLogo } from "@/components/layout/brand-logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="surface-texture flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-blur-in">
        <div className="mb-8 flex justify-center">
          <BrandLogo />
        </div>

        <Card>
          <CardBody className="p-6 sm:p-8">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-silver-bright">
              {title}
            </h1>
            <p className="mb-6 mt-1 text-sm text-silver-dim">{subtitle}</p>
            {children}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
