'use client';

import {
  getFruitBalance,
  getWorkerBalance,
} from '@/app/lib/report-settlement';
import type { ReportStats } from '@/app/lib/report-stats';

type ExportProps = {
  report: ReportStats;
};

function getWorkersWithHarvest(report: ReportStats) {
  return report.workers.filter((worker) => worker.totalKg > 0);
}

function periodLabel(year: number, month?: number) {
  return month ? `${year} оны ${month}-р сар` : `${year} он`;
}

function escapeCsv(value: string | number) {
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function buildExcelCsv(report: ReportStats) {
  const label = periodLabel(report.year, report.month);
  const lines: string[] = [];

  lines.push(['Тайлан', label].map(escapeCsv).join(','));
  lines.push(
    [
      'Тооцоо',
      'Үлдэгдэл (төлбөр − төлсөн) 0-оос их эсвэл бага бол тооцоотой; яг 0 бол тооцоогүй',
    ]
      .map(escapeCsv)
      .join(','),
  );
  lines.push('');
  lines.push(['Хураангуй'].map(escapeCsv).join(','));
  lines.push(['Нийт түүсэн (kg)', report.summary.totalKg].map(escapeCsv).join(','));
  lines.push(['Нийт олгосон төлбөр (₮)', report.summary.totalPaid].map(escapeCsv).join(','));
  lines.push(['Төлөгдөөгүй үлдэгдэл (₮)', report.summary.unpaidAmount].map(escapeCsv).join(','));
  lines.push(['Төлөгдөөгүй (kg)', report.summary.unpaidKg].map(escapeCsv).join(','));
  lines.push('');

  if (!report.month) {
    lines.push(['Сараар'].map(escapeCsv).join(','));
    lines.push(
      ['Сар', 'Түүсэн (kg)', 'Төлбөр (₮)', 'Төлсөн (₮)'].map(escapeCsv).join(','),
    );
    for (const row of report.monthly) {
      lines.push(
        [row.label, row.totalKg, row.totalEarned, row.paidAmount]
          .map(escapeCsv)
          .join(','),
      );
    }
    lines.push('');
  }

  lines.push(['Ургацаар'].map(escapeCsv).join(','));
  lines.push(
    ['Ургац', 'Түүсэн (kg)', 'Төлбөр (₮)', 'Төлсөн (₮)', 'Үлдэгдэл (₮)', 'Тооцоо']
      .map(escapeCsv)
      .join(','),
  );
  for (const fruit of report.fruits.filter((item) => item.totalKg > 0)) {
    const balance = getFruitBalance(fruit);
    lines.push(
      [
        fruit.fruitName,
        fruit.totalKg,
        fruit.totalEarned,
        fruit.totalPaid,
        balance,
        balance !== 0 ? 'Тооцоотой' : 'Тооцоогүй',
      ]
        .map(escapeCsv)
        .join(','),
    );
  }
  lines.push('');

  lines.push(['Ажилтнаар'].map(escapeCsv).join(','));
  lines.push(
    [
      'Нэр',
      'Утас',
      'Нийт түүсэн (kg)',
      'Төлбөр (₮)',
      'Төлсөн (₮)',
      'Үлдэгдэл (₮)',
      'Тооцоо',
    ]
      .map(escapeCsv)
      .join(','),
  );
  for (const worker of getWorkersWithHarvest(report)) {
    const balance = getWorkerBalance(worker);
    lines.push(
      [
        worker.workerName,
        worker.phone ?? '',
        worker.totalKg,
        worker.totalEarned,
        worker.totalPaid,
        balance,
        balance !== 0 ? 'Тооцоотой' : 'Тооцоогүй',
      ]
        .map(escapeCsv)
        .join(','),
    );
  }

  return lines.join('\n');
}

function buildPdfHtml(report: ReportStats) {
  const fmt = (n: number) => n.toLocaleString('en-US');
  const label = periodLabel(report.year, report.month);

  const monthlyRows = report.monthly
    .map(
      (row) => `
      <tr>
        <td>${row.label}</td>
        <td style="text-align:right">${fmt(row.totalKg)}</td>
        <td style="text-align:right">${fmt(row.totalEarned)}</td>
        <td style="text-align:right">${fmt(row.paidAmount)}</td>
      </tr>`,
    )
    .join('');

  const fruitRows = report.fruits
    .filter((fruit) => fruit.totalKg > 0)
    .map((fruit) => {
      const balance = getFruitBalance(fruit);
      return `
      <tr>
        <td>${fruit.fruitName}</td>
        <td style="text-align:right">${fmt(fruit.totalKg)}</td>
        <td style="text-align:right">${fmt(fruit.totalEarned)}</td>
        <td style="text-align:right">${fmt(fruit.totalPaid)}</td>
        <td style="text-align:right">${fmt(balance)}</td>
        <td>${balance !== 0 ? 'Тооцоотой' : 'Тооцоогүй'}</td>
      </tr>`;
    })
    .join('');

  const workerRows = getWorkersWithHarvest(report)
    .map((worker) => {
      const balance = getWorkerBalance(worker);
      return `
      <tr>
        <td>${worker.workerName}</td>
        <td>${worker.phone ?? '—'}</td>
        <td style="text-align:right">${fmt(worker.totalKg)}</td>
        <td style="text-align:right">${fmt(worker.totalEarned)}</td>
        <td style="text-align:right">${fmt(worker.totalPaid)}</td>
        <td style="text-align:right">${fmt(balance)}</td>
        <td>${balance !== 0 ? 'Тооцоотой' : 'Тооцоогүй'}</td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="utf-8" />
  <title>${label}-ийн тайлан</title>
  <style>
    body { font-family: Arial, sans-serif; color: #1f1a14; margin: 32px; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    p { margin: 0 0 16px; color: #5c5346; }
    h2 { font-size: 16px; margin: 24px 0 8px; }
    .cards { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 12px 16px; min-width: 160px; }
    .card strong { display: block; font-size: 18px; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f0e6; }
    @media print {
      body { margin: 16px; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <h1>${label}-ийн тайлан</h1>
  <p>Тооцоотой = үлдэгдэл (төлбөр − төлсөн) 0-оос их эсвэл бага. Тооцоогүй = үлдэгдэл яг 0.</p>

  <div class="cards">
    <div class="card">Нийт түүсэн<strong>${fmt(report.summary.totalKg)} kg</strong></div>
    <div class="card">Нийт төлсөн<strong>₮${fmt(report.summary.totalPaid)}</strong></div>
    <div class="card">Үлдэгдэл<strong>₮${fmt(report.summary.unpaidAmount)}</strong></div>
  </div>

  ${
    report.month
      ? ''
      : `<h2>Сараар</h2>
  <table>
    <thead>
      <tr><th>Сар</th><th>Түүсэн (kg)</th><th>Төлбөр (₮)</th><th>Төлсөн (₮)</th></tr>
    </thead>
    <tbody>${monthlyRows}</tbody>
  </table>`
  }

  <h2>Ургацаар</h2>
  <table>
    <thead>
      <tr>
        <th>Ургац</th><th>Түүсэн (kg)</th><th>Төлбөр (₮)</th>
        <th>Төлсөн (₮)</th><th>Үлдэгдэл (₮)</th><th>Тооцоо</th>
      </tr>
    </thead>
    <tbody>${fruitRows}</tbody>
  </table>

  <h2>Ажилтнаар</h2>
  <table>
    <thead>
      <tr>
        <th>Нэр</th><th>Утас</th><th>Нийт түүсэн (kg)</th>
        <th>Төлбөр (₮)</th><th>Төлсөн (₮)</th><th>Үлдэгдэл (₮)</th><th>Тооцоо</th>
      </tr>
    </thead>
    <tbody>${workerRows}</tbody>
  </table>

  <script>
    window.onload = function () {
      window.print();
    };
  </script>
</body>
</html>`;
}

export default function ReportExportButtons({ report }: ExportProps) {
  const label = periodLabel(report.year, report.month);
  const fileSlug = report.month
    ? `tailan-${report.year}-${String(report.month).padStart(2, '0')}`
    : `tailan-${report.year}`;

  const downloadExcel = () => {
    const csv = '\uFEFF' + buildExcelCsv(report);
    downloadBlob(
      `${fileSlug}.csv`,
      new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    );
  };

  const downloadPdf = () => {
    const html = buildPdfHtml(report);
    const win = window.open('', '_blank');
    if (!win) {
      alert('Попап блоклогдсон байна. PDF татахын тулд зөвшөөрнө үү.');
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={downloadPdf}
        className="rounded-xl border border-[#d9d3c4] px-4 py-2 text-sm font-medium hover:bg-[#f8f4eb]"
        title={`${label} PDF`}
      >
        PDF татах
      </button>
      <button
        type="button"
        onClick={downloadExcel}
        className="rounded-xl border border-[#d9d3c4] px-4 py-2 text-sm font-medium hover:bg-[#f8f4eb]"
        title={`${label} Excel`}
      >
        Excel татах
      </button>
    </div>
  );
}
