import { useEffect, useState } from 'react';
import { Clock, Search } from 'lucide-react';
import { reportCategories, defaultReports } from '../data/reports';
import { cn } from '../lib/cn';
import {
  downloadReportBundlePdf,
  downloadReportCsv,
  downloadReportPdf,
  getReportDownloadTimestamp,
  type DashboardReport,
} from '../lib/report-export';

type ReportsViewProps = {
  isDarkMode: boolean;
  onAction: (message: string) => void;
};

export const ReportsView = ({ isDarkMode, onAction }: ReportsViewProps) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [reportSearch, setReportSearch] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reportActionMessage, setReportActionMessage] = useState<string | null>(null);
  const [reportList, setReportList] = useState<DashboardReport[]>(defaultReports);

  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-200';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const filteredReports = reportList.filter((report) => {
    const matchesCategory = activeCategory === 'All' || report.category === activeCategory;
    const query = reportSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      report.title.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      report.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (!selectedReportId && filteredReports.length > 0) {
      setSelectedReportId(filteredReports[0].id);
    }
  }, [filteredReports, selectedReportId]);

  const selectedReport = reportList.find((report) => report.id === selectedReportId) ?? filteredReports[0];

  const updateReport = (id: string, updates: Partial<DashboardReport>) => {
    setReportList((prev) => prev.map((report) => (report.id === id ? { ...report, ...updates } : report)));
  };

  const publishAction = (message: string) => {
    setReportActionMessage(message);
    onAction(message);
  };

  const markReportsGenerated = (reports: DashboardReport[]) => {
    const timestamp = getReportDownloadTimestamp();
    reports.forEach((report) => {
      updateReport(report.id, { status: 'Ready', lastRun: timestamp });
    });
  };

  const handleGenerate = (id: string) => {
    const report = reportList.find((item) => item.id === id);
    if (!report) return;

    downloadReportPdf(report);
    markReportsGenerated([report]);
    publishAction(`${report.title} PDF generated`);
  };

  const handleGenerateBundle = () => {
    if (!filteredReports.length) return;
    downloadReportBundlePdf(filteredReports);
    markReportsGenerated(filteredReports);
    publishAction(`Bundle generated for ${filteredReports.length} reports`);
  };

  const handleExportCenter = () => {
    if (!filteredReports.length) return;
    downloadReportBundlePdf(filteredReports);
    publishAction('Reports center PDF exported');
  };

  const handleDownloadPdf = () => {
    if (!selectedReport) return;
    downloadReportPdf(selectedReport);
    markReportsGenerated([selectedReport]);
    publishAction(`${selectedReport.title} PDF downloaded`);
  };

  const handleDownloadCsv = () => {
    if (!selectedReport) return;
    downloadReportCsv(selectedReport);
    publishAction(`${selectedReport.title} CSV downloaded`);
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports Center</h2>
          <p className={cn('text-sm', muted)}>
            Sales, trades, sold items, and market intelligence reports in one command desk.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateBundle}
            className="px-4 py-2 rounded-xl bg-orange-500 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-orange-500/20"
          >
            Generate Bundle
          </button>
          <button
            onClick={handleExportCenter}
            className={cn('px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest', panelBg, panelBorder, 'border')}
          >
            Export Center
          </button>
        </div>
      </div>
      {reportActionMessage && <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{reportActionMessage}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
          <div className="text-[10px] uppercase tracking-widest text-gray-400">Sales Reports</div>
          <div className="mt-2 text-2xl font-bold">12</div>
          <div className="text-xs text-emerald-400 font-bold">+3 new</div>
        </div>
        <div className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
          <div className="text-[10px] uppercase tracking-widest text-gray-400">Trade Reports</div>
          <div className="mt-2 text-2xl font-bold">9</div>
          <div className="text-xs text-orange-400 font-bold">2 queued</div>
        </div>
        <div className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
          <div className="text-[10px] uppercase tracking-widest text-gray-400">Sold Items</div>
          <div className="mt-2 text-2xl font-bold">7</div>
          <div className="text-xs text-emerald-400 font-bold">Ready</div>
        </div>
        <div className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
          <div className="text-[10px] uppercase tracking-widest text-gray-400">Compliance</div>
          <div className="mt-2 text-2xl font-bold">4</div>
          <div className="text-xs text-blue-400 font-bold">Reviewed</div>
        </div>
      </div>

      <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={reportSearch}
              onChange={(event) => setReportSearch(event.target.value)}
              placeholder="Search reports by title, category, or detail"
              className={cn(
                'w-full rounded-xl pl-9 pr-3 py-2 text-xs font-medium',
                isDarkMode ? 'bg-white/5 border border-white/10 text-gray-200' : 'bg-gray-50 border border-gray-200 text-gray-700'
              )}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {reportCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                  activeCategory === category
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : cn(isDarkMode ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-gray-50 border border-gray-200 text-gray-600')
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
        <div className={cn('rounded-3xl border overflow-hidden', panelBg, panelBorder)}>
          <div className={cn('px-6 py-4 border-b', panelBorder)}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
              <span>Report Catalog</span>
              <span>{filteredReports.length} reports</span>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {filteredReports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={cn(
                  'w-full text-left px-6 py-4 transition-colors',
                  selectedReportId === report.id ? 'bg-orange-500/10' : isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold">{report.title}</div>
                    <p className={cn('text-xs mt-1', muted)}>{report.description}</p>
                    <div className={cn('mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest', muted)}>
                      <span>{report.category}</span>
                      <span>•</span>
                      <span>{report.frequency}</span>
                      <span>•</span>
                      <span>{report.format}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn('text-[10px] font-bold uppercase tracking-widest', report.status === 'Ready' ? 'text-emerald-400' : 'text-orange-400')}>
                      {report.status}
                    </div>
                    <div className={cn('text-[10px]', muted)}>{report.lastRun}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold">{selectedReport?.title ?? 'Select a report'}</div>
                <p className={cn('text-xs mt-1', muted)}>{selectedReport?.description}</p>
              </div>
              {selectedReport && (
                <button
                  onClick={() => handleGenerate(selectedReport.id)}
                  className="px-3 py-2 rounded-xl bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white"
                >
                  Generate
                </button>
              )}
            </div>
            {selectedReport && (
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Category</div>
                  <div className="mt-1 font-bold">{selectedReport.category}</div>
                </div>
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Frequency</div>
                  <div className="mt-1 font-bold">{selectedReport.frequency}</div>
                </div>
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Owner</div>
                  <div className="mt-1 font-bold">{selectedReport.owner}</div>
                </div>
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Format</div>
                  <div className="mt-1 font-bold">{selectedReport.format}</div>
                </div>
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Last Run</div>
                  <div className="mt-1 font-bold">{selectedReport.lastRun}</div>
                </div>
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>File Size</div>
                  <div className="mt-1 font-bold">{selectedReport.size}</div>
                </div>
              </div>
            )}
            {selectedReport && (
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-widest"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, 'border')}
                >
                  Download CSV
                </button>
                <button
                  onClick={() => {
                    if (!selectedReport) return;
                    publishAction(`${selectedReport.title} share link copied`);
                  }}
                  className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, 'border')}
                >
                  Share
                </button>
              </div>
            )}
          </div>

          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Scheduling & Delivery</div>
              <Clock size={16} className="text-orange-400" />
            </div>
            <div className="mt-4 space-y-3 text-xs">
              {filteredReports.slice(0, 4).map((report) => (
                <div key={report.id} className={cn('flex items-center justify-between rounded-xl border px-3 py-2', panelBorder)}>
                  <div>
                    <div className="font-bold">{report.title}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{report.frequency}</div>
                  </div>
                  <button
                    onClick={() => updateReport(report.id, { autoSchedule: !report.autoSchedule })}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                      report.autoSchedule ? 'bg-emerald-500/20 text-emerald-300' : cn(panelBg, panelBorder, 'border', muted)
                    )}
                  >
                    {report.autoSchedule ? 'Scheduled' : 'Manual'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
