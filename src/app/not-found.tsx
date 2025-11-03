import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-md opacity-100 mb-2">404</h1>
      <p className="text-sm text-muted-foreground">
        Page not found.
      </p>
    </div>
  );
}
