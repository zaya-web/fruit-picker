'use server';

export type { DeleteActionResult } from '@/app/lib/actions/shared';

export {
  createWorker,
  updateWorker,
  deleteWorker,
  type WorkerFormState,
} from '@/app/lib/actions/workers';

export {
  createFruit,
  updateFruit,
  deleteFruit,
  type FruitFormState,
} from '@/app/lib/actions/crops';

export {
  createWorkRecord,
  updateWorkRecord,
  deleteWorkRecord,
  type WorkRecordFormState,
} from '@/app/lib/actions/work-records';

export {
  createPayment,
  updatePayment,
  deletePayment,
  type PaymentFormState,
} from '@/app/lib/actions/payments';
