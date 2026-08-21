'use client';

import { useState, useTransition } from 'react';
import type { DeleteActionResult } from '@/app/lib/actions/shared';
import ConfirmDialog from '@/app/ui/common/confirm-dialog';
import { useToast } from '@/app/ui/common/toast';

type DeleteButtonProps = {
  action: () => Promise<DeleteActionResult | void>;
  label?: string;
  confirmTitle?: string;
  confirmDescription?: string;
};

export default function DeleteButton({
  action,
  label = 'Устгах',
  confirmTitle = 'Устгах уу?',
  confirmDescription = 'Энэ үйлдлийг буцаах боломжгүй.',
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleConfirm() {
    setOpen(false);
    startTransition(async () => {
      try {
        const result = await action();
        if (result?.error) {
          showToast(result.error, 'error');
          return;
        }
        showToast('Амжилттай устгалаа.', 'success');
      } catch {
        showToast('Устгахад алдаа гарлаа.', 'error');
      }
    });
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => setOpen(true)}
        className="farm-btn-danger inline-flex min-h-10 items-center border border-[#efc9c9] px-3 text-sm disabled:opacity-60"
      >
        {pending ? 'Устгаж байна...' : label}
      </button>
      <ConfirmDialog
        open={open}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel="Устгах"
        cancelLabel="Болих"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
