import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center">

        {/* Logo / Nombre */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-2xl font-bold">
            C
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Custodia
          </h1>
        </div>

        {/* Tagline */}
        <p className="max-w-sm text-muted-foreground text-lg">
          Sistema de despacho para negocios con domicilio propio
        </p>

        {/* Botón de entrada */}
        <Link
          href="/login"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ingresar
        </Link>

      </div>
    </div>
  );
}
