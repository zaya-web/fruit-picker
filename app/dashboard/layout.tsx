import { Suspense } from 'react';
import { requireUser } from '@/app/lib/session';
import DashboardShell from '@/app/ui/common/dashboard-shell';
import { ToastProvider } from '@/app/ui/common/toast';

export default async function DashboardLayout({
  children,
}: LayoutProps<'/dashboard'>) {
  const user = await requireUser();

  return (
    <DashboardShell userName={user.name}>
      <Suspense fallback={null}>
        <ToastProvider>{children}</ToastProvider>
      </Suspense>
    </DashboardShell>
  );
}
