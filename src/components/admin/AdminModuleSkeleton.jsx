import Card from '@/components/ui/Card';

export default function AdminModuleSkeleton({ variant = 'table' }) {
  if (variant === 'form') {
    return (
      <div className="grid gap-8">
        <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 h-8 w-56 animate-pulse rounded-xl bg-slate-200" />
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="grid gap-2">
                <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                <div className="h-10 animate-pulse rounded-md bg-slate-100" />
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="h-6 w-40 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-5 h-56 animate-pulse rounded-2xl bg-slate-100" />
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="h-8 w-52 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-4 w-80 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-12 w-44 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </Card>

      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 h-12 max-w-md animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </Card>
    </div>
  );
}
