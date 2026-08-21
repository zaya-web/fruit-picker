import { requireUser } from '@/app/lib/session';
import PageHeader from '@/app/ui/common/page-header';
import ChangePasswordForm from '@/app/ui/settings/change-password-form';

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Тохиргоо"
        subtitle="Хэрэглэгчийн мэдээлэл болон нууц үг"
      />

      <section className="farm-card p-5 sm:p-6">
        <h2 className="text-base font-semibold">Хэрэглэгч</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--text-muted)]">Нэр</dt>
            <dd className="mt-1 font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Имэйл</dt>
            <dd className="mt-1 font-medium">{user.email}</dd>
          </div>
        </dl>
      </section>

      <section className="farm-card p-5 sm:p-6">
        <h2 className="text-base font-semibold">Нууц үг солих</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Одоогийн нууц үгээ баталгаажуулаад шинэ нууц үг тохируулна.
        </p>
        <div className="mt-5 max-w-md">
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}
