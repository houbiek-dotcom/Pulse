import { useState } from 'react';

interface CohortRow {
  cohort: string;
  size: number;
  months: (number | null)[];
}

const COHORT_DATA: CohortRow[] = [
  { cohort: 'Jan 2026', size: 1240, months: [100, 34, 28, 21, 18, 15] },
  { cohort: 'Feb 2026', size: 1150, months: [100, 32, 26, 19, 16, null] },
  { cohort: 'Mar 2026', size: 1380, months: [100, 30, 25, 17, null, null] },
  { cohort: 'Apr 2026', size: 1420, months: [100, 28, 22, null, null, null] },
  { cohort: 'May 2026', size: 1510, months: [100, 29, null, null, null, null] },
];

export default function Retention() {
  const [cohorts] = useState<CohortRow[]>(COHORT_DATA);

  // Return specific heat map background colors consistent with Pulse Guidelines
  const getHeatmapClass = (percentage: number | null) => {
    if (percentage === null) return 'bg-slate-950/20 text-slate-700';
    if (percentage === 100) return 'bg-[#4F46E5] text-white font-extrabold';
    if (percentage >= 30) return 'bg-[#4F46E5]/20 text-indigo-400 border border-indigo-500/20 font-bold';
    if (percentage >= 25) return 'bg-[#0D9488]/20 text-teal-400 border border-teal-500/20 font-semibold';
    if (percentage >= 18) return 'bg-[#0D9488]/10 text-teal-500/80 border border-teal-500/10 font-semibold';
    if (percentage >= 10) return 'bg-slate-800/40 text-slate-400 border border-slate-800/40';
    return 'bg-slate-900/50 text-slate-500';
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Header controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Customer Cohort Retention</h2>
          <p className="text-sm text-slate-400 mt-1">Analyze user decay curve and lifetime value metrics across customer sign-up intervals.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#4F46E5]/10 text-indigo-400 border border-indigo-500/20">
            📊 Target Net Retention: &gt; 110%
          </span>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average LTV Card */}
        <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-indigo-500/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Average Customer LTV</span>
            <span className="text-xs text-[#0D9488] font-bold">📈 +12.4% vs Q1</span>
          </div>
          <div className="flex items-baseline space-x-1.5 mt-4">
            <span className="text-3xl font-black text-white tracking-tight">$142.50</span>
            <span className="text-xs text-slate-500">USD</span>
          </div>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            Calculated over a 12-month trailing index. Your average customer purchase frequency has expanded to <strong className="text-white">1.8x annually</strong>.
          </p>
        </div>

        {/* Average Month-1 Retention */}
        <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 shadow-xl hover:border-indigo-500/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Month-1 Retention Benchmark</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20">
              Above Target
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5 mt-4">
            <span className="text-3xl font-black text-white tracking-tight">28.5%</span>
            <span className="text-xs text-slate-500">avg</span>
          </div>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            Target month-1 benchmark is set to <strong className="text-white">25.0%</strong>. Customer repeat orders within 30 days are pacing <strong className="text-[#0D9488]">3.5% higher</strong> than expected benchmarks.
          </p>
        </div>
      </div>

      {/* Heatmap Grid Matrix */}
      <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Retention Cohort Matrix</h3>
          <p className="text-xs text-slate-400 mt-1">Percentage of users who returned and placed subsequent orders in each offset month.</p>
        </div>

        <div className="overflow-x-auto pt-2">
          <div className="min-w-[640px]">
            {/* Header Matrix Rows */}
            <div className="grid grid-cols-8 border-b border-slate-800/80 pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
              <div className="text-left pl-2">Cohort Month</div>
              <div>Store Size</div>
              <div>Month 0</div>
              <div>Month 1</div>
              <div>Month 2</div>
              <div>Month 3</div>
              <div>Month 4</div>
              <div>Month 5</div>
            </div>

            {/* Matrix Data Rows */}
            <div className="divide-y divide-slate-800/60 mt-1">
              {cohorts.map((row) => (
                <div key={row.cohort} className="grid grid-cols-8 py-3.5 items-center text-center hover:bg-slate-800/10 rounded-lg transition-colors">
                  {/* Cohort Name */}
                  <div className="text-left font-extrabold text-sm text-white pl-2">{row.cohort}</div>
                  {/* Cohort Size */}
                  <div className="text-xs font-bold text-slate-400">{row.size.toLocaleString()} customers</div>
                  
                  {/* Month Columns */}
                  {row.months.map((val, idx) => (
                    <div key={idx} className="px-1.5">
                      <div className={`py-2 px-1 rounded-xl text-xs flex items-center justify-center h-9 transition-all duration-300 ${getHeatmapClass(val)}`}>
                        {val !== null ? `${val}%` : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-end gap-4 text-[10px] font-bold text-slate-400 pt-4 border-t border-slate-800/60">
          <span>Heatmap Scale:</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#4F46E5]"></span>
            <span>100% (Acquisition)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#4F46E5]/20 border border-indigo-500/20"></span>
            <span>&gt; 30%</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#0D9488]/20 border border-teal-500/20"></span>
            <span>&gt; 25%</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#0D9488]/10 border border-teal-500/10"></span>
            <span>&gt; 18%</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-slate-900/50"></span>
            <span>&lt; 15%</span>
          </span>
        </div>
      </div>
    </div>
  );
}
