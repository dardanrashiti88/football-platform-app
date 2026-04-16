export type DashboardReport = {
  id: string;
  category: string;
  title: string;
  description: string;
  frequency: string;
  status: string;
  lastRun: string;
  owner: string;
  format: string;
  size: string;
  autoSchedule: boolean;
};

type ReportMetric = {
  label: string;
  value: string;
  note?: string;
};

const PDF_PAGE_WIDTH = 612;
const PDF_PAGE_HEIGHT = 792;
const PDF_MARGIN_X = 48;
const PDF_START_Y = 748;
const PDF_LINE_HEIGHT = 17;
const PDF_BOTTOM_GUARD = 64;

const slugify = (value: string) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'report';

const formatClockStamp = (value = new Date()) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);

const escapePdfText = (value: string) =>
  String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const wrapText = (value: string, maxChars = 88) => {
  const words = String(value || '').split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars) {
      if (current) lines.push(current);
      current = word;
      return;
    }
    current = candidate;
  });

  if (current) lines.push(current);
  return lines.length ? lines : [''];
};

const reportMetricMap: Record<string, ReportMetric[]> = {
  Sales: [
    { label: 'Gross Revenue', value: '$4.8M', note: 'Trailing 30 days' },
    { label: 'Average Sale', value: '$18,420', note: 'Across all editions' },
    { label: 'Margin Rate', value: '28.4%', note: 'After fees and insurance' },
    { label: 'Top Buyer Region', value: 'United Kingdom', note: 'By settled volume' },
  ],
  Trades: [
    { label: 'Open Trade Threads', value: '42', note: 'Across verified inventory' },
    { label: 'Escrow Coverage', value: '15 active', note: 'Protected swaps in flight' },
    { label: 'Counter Time', value: '2h 14m', note: 'Average response window' },
    { label: 'Trade Win Rate', value: '61%', note: 'Accepted vs declined outcomes' },
  ],
  'Sold Items': [
    { label: 'Items Sold', value: '128', note: 'Settled inside the current cycle' },
    { label: 'Average Hold Time', value: '18 days', note: 'From acquisition to sale' },
    { label: 'Margin Capture', value: '14.6%', note: 'Net of logistics' },
    { label: 'Top Buyer', value: '@vault_prime', note: 'By sold-item count' },
  ],
  Listings: [
    { label: 'Live Listings', value: '87', note: 'Across marketplace channels' },
    { label: 'Time On Market', value: '4.2 days', note: 'Median exposure time' },
    { label: 'Price Coverage', value: '78%', note: 'Listings with active bids' },
    { label: 'Stale Listings', value: '6', note: 'Aged beyond 14 days' },
  ],
  Revenue: [
    { label: 'Forecast Run Rate', value: '$6.4M', note: 'Projected 30-day revenue' },
    { label: 'Fee Capture', value: '9.8%', note: 'Weighted blended take rate' },
    { label: 'Payout Lag', value: '1.3 days', note: 'Average settlement to payout' },
    { label: 'Seasonal Variance', value: '+7.2%', note: 'Vs prior comparable period' },
  ],
  Compliance: [
    { label: 'KYC Reviewed', value: '214', note: 'Accounts reviewed this cycle' },
    { label: 'Flagged Accounts', value: '3', note: 'Requiring manual escalation' },
    { label: 'Audit Notes', value: '12 open', note: 'Awaiting analyst completion' },
    { label: 'SLA Compliance', value: '99.1%', note: 'Within internal policy target' },
  ],
  Risk: [
    { label: 'Portfolio Volatility', value: '18.4%', note: '30-day observed range' },
    { label: 'Concentration Risk', value: '24%', note: 'Top asset exposure' },
    { label: 'Insured Value', value: '$12.8M', note: 'Covered inventory total' },
    { label: 'Gap Alerts', value: '4', note: 'Policies requiring review' },
  ],
  Market: [
    { label: 'Demand Index', value: '82 / 100', note: 'Composite watch + search score' },
    { label: 'Search Spikes', value: '14', note: 'Last 24 hours' },
    { label: 'Watchlist Adds', value: '132', note: 'Across tracked cards' },
    { label: 'Top Movers', value: '18', note: 'Cards above 7% delta' },
  ],
};

const getReportMetrics = (report: DashboardReport) =>
  reportMetricMap[report.category] || [
    { label: 'Coverage', value: 'Standard', note: 'Default report package' },
    { label: 'Updated', value: report.lastRun, note: 'Most recent run window' },
    { label: 'Owner', value: report.owner, note: 'Responsible desk' },
    { label: 'Schedule', value: report.autoSchedule ? 'Automatic' : 'Manual', note: report.frequency },
  ];

const buildNarrative = (report: DashboardReport) => [
  `${report.title} is generated from the ${report.category.toLowerCase()} desk and packaged for ${report.owner}.`,
  `${report.description} This export reflects the most recent ${report.frequency.toLowerCase()} run captured at ${report.lastRun}.`,
  `The current delivery mode is ${report.autoSchedule ? 'automatic' : 'manual'}, with an output target of ${report.format}.`,
];

const buildTextPages = (report: DashboardReport) => {
  const pages: Array<Array<{ text: string; size?: number; bold?: boolean; gapAfter?: number }>> = [[]];
  let y = PDF_START_Y;
  let currentPage = pages[0];

  const pushLine = (entry: { text: string; size?: number; bold?: boolean; gapAfter?: number }) => {
    if (y < PDF_BOTTOM_GUARD) {
      currentPage = [];
      pages.push(currentPage);
      y = PDF_START_Y;
    }
    currentPage.push(entry);
    y -= entry.gapAfter ?? PDF_LINE_HEIGHT;
  };

  pushLine({ text: 'FODR Reports Center', size: 12, bold: true, gapAfter: 18 });
  pushLine({ text: report.title, size: 22, bold: true, gapAfter: 24 });
  pushLine({ text: `Generated ${formatClockStamp()} · Owner ${report.owner}`, size: 11, gapAfter: 24 });

  pushLine({ text: 'Report Snapshot', size: 13, bold: true, gapAfter: 18 });
  [
    `Category: ${report.category}`,
    `Frequency: ${report.frequency}`,
    `Current Status: ${report.status}`,
    `Last Run: ${report.lastRun}`,
    `Preferred Output: ${report.format}`,
    `Auto Schedule: ${report.autoSchedule ? 'Enabled' : 'Manual only'}`,
  ].forEach((line) => pushLine({ text: line, size: 11 }));

  pushLine({ text: '', gapAfter: 12 });
  pushLine({ text: 'Executive Summary', size: 13, bold: true, gapAfter: 18 });
  buildNarrative(report).forEach((paragraph) => {
    wrapText(paragraph, 86).forEach((line) => pushLine({ text: line, size: 11 }));
    pushLine({ text: '', gapAfter: 8 });
  });

  pushLine({ text: 'Key Metrics', size: 13, bold: true, gapAfter: 18 });
  getReportMetrics(report).forEach((metric) => {
    pushLine({ text: `${metric.label}: ${metric.value}`, size: 11, bold: true, gapAfter: 16 });
    if (metric.note) {
      wrapText(metric.note, 78).forEach((line) => pushLine({ text: `  ${line}`, size: 10 }));
    }
    pushLine({ text: '', gapAfter: 8 });
  });

  pushLine({ text: 'Operations Notes', size: 13, bold: true, gapAfter: 18 });
  [
    'Prepared for dashboard review and executive sharing.',
    'Values are snapshot estimates meant for operational planning.',
    'Use CSV exports for line-item analysis and PDF for presentation-ready review.',
  ].forEach((note) => {
    wrapText(note, 84).forEach((line) => pushLine({ text: line, size: 11 }));
  });

  return pages;
};

const buildBundlePages = (reports: DashboardReport[]) => {
  const pages: Array<Array<{ text: string; size?: number; bold?: boolean; gapAfter?: number }>> = [[]];
  let y = PDF_START_Y;
  let currentPage = pages[0];

  const pushLine = (entry: { text: string; size?: number; bold?: boolean; gapAfter?: number }) => {
    if (y < PDF_BOTTOM_GUARD) {
      currentPage = [];
      pages.push(currentPage);
      y = PDF_START_Y;
    }
    currentPage.push(entry);
    y -= entry.gapAfter ?? PDF_LINE_HEIGHT;
  };

  pushLine({ text: 'FODR Reports Bundle', size: 22, bold: true, gapAfter: 24 });
  pushLine({ text: `Generated ${formatClockStamp()} · ${reports.length} reports included`, size: 11, gapAfter: 24 });

  reports.forEach((report, index) => {
    pushLine({ text: `${index + 1}. ${report.title}`, size: 13, bold: true, gapAfter: 18 });
    pushLine({
      text: `${report.category} · ${report.frequency} · ${report.owner} · ${report.format}`,
      size: 10,
      gapAfter: 16,
    });
    wrapText(report.description, 84).forEach((line) => pushLine({ text: line, size: 11 }));
    pushLine({ text: `Status ${report.status} · Last run ${report.lastRun}`, size: 10, gapAfter: 18 });
    getReportMetrics(report).slice(0, 2).forEach((metric) => {
      pushLine({ text: `• ${metric.label}: ${metric.value}`, size: 10 });
    });
    pushLine({ text: '', gapAfter: 16 });
  });

  return pages;
};

const drawTextLine = (
  x: number,
  y: number,
  text: string,
  size: number,
  bold = false,
) => `BT /${bold ? 'F2' : 'F1'} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdfText(text)}) Tj ET`;

const makePdfContent = (page: Array<{ text: string; size?: number; bold?: boolean; gapAfter?: number }>) => {
  let y = PDF_START_Y;
  const commands = [
    '0.12 0.13 0.15 rg',
    '0.12 0.13 0.15 RG',
    `${PDF_MARGIN_X} ${PDF_START_Y + 22} m ${PDF_PAGE_WIDTH - PDF_MARGIN_X} ${PDF_START_Y + 22} l S`,
  ];

  page.forEach((entry) => {
    commands.push(drawTextLine(PDF_MARGIN_X, y, entry.text, entry.size ?? 11, entry.bold));
    y -= entry.gapAfter ?? PDF_LINE_HEIGHT;
  });

  commands.push(
    `${PDF_MARGIN_X} 44 m ${PDF_PAGE_WIDTH - PDF_MARGIN_X} 44 l S`,
    drawTextLine(PDF_MARGIN_X, 28, 'FODR Dashboard · Confidential operational report export', 9, false),
  );

  return commands.join('\n');
};

const createPdfBlob = (pages: Array<Array<{ text: string; size?: number; bold?: boolean; gapAfter?: number }>>) => {
  const objects: string[] = [];
  const addObject = (value: string) => {
    objects.push(value);
    return objects.length;
  };

  const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const pageIds = pages.map(() => addObject(''));
  const contentIds = pages.map((page) => {
    const content = makePdfContent(page);
    return addObject(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });
  const pagesId = addObject('');

  pageIds.forEach((pageId, index) => {
    objects[pageId - 1] =
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PDF_PAGE_WIDTH} ${PDF_PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentIds[index]} 0 R >>`;
  });

  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
};

const triggerDownload = (filename: string, blob: Blob) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadReportPdf = (report: DashboardReport) => {
  const blob = createPdfBlob(buildTextPages(report));
  triggerDownload(`${slugify(report.title)}.pdf`, blob);
  return blob;
};

export const downloadReportBundlePdf = (reports: DashboardReport[]) => {
  const blob = createPdfBlob(buildBundlePages(reports));
  triggerDownload(`fodr-reports-bundle-${new Date().toISOString().slice(0, 10)}.pdf`, blob);
  return blob;
};

export const downloadReportCsv = (report: DashboardReport) => {
  const rows = [
    ['Report', report.title],
    ['Category', report.category],
    ['Description', report.description],
    ['Frequency', report.frequency],
    ['Owner', report.owner],
    ['Status', report.status],
    ['Last Run', report.lastRun],
    ['Format', report.format],
    ['File Size', report.size],
    ['Auto Schedule', report.autoSchedule ? 'Enabled' : 'Manual'],
    [],
    ['Metric', 'Value', 'Note'],
    ...getReportMetrics(report).map((metric) => [metric.label, metric.value, metric.note || '']),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\n');

  triggerDownload(`${slugify(report.title)}.csv`, new Blob([csv], { type: 'text/csv;charset=utf-8' }));
};

export const getReportDownloadTimestamp = () => formatClockStamp();
