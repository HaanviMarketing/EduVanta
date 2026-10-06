import React from 'react';
import {
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Bot,
  DollarSign,
  Users,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { SchoolPulseItem } from '../../types';

interface SchoolPulseViewProps {
  onNavigate: (tab: string) => void;
  onOpenCopilot: () => void;
}

export const SchoolPulseView: React.FC<SchoolPulseViewProps> = ({ onNavigate, onOpenCopilot }) => {
  const { currentTenant, currentUser } = useAuth();

  if (!currentTenant) return null;

  const pulseItems = repo.getSchoolPulse(currentTenant.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Autonomous Intelligence & Detection Layer</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            School Pulse · Daily Operations Briefing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational alerts, statutory compliance warnings, and recommended actions for {currentTenant.name}.
          </p>
        </div>

        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Bot className="w-4 h-4 text-teal-300" />
          <span>Ask Copilot to Elaborate</span>
        </button>
      </div>

      {/* Philosophy Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono text-teal-400">
            DATA → INTELLIGENCE → DETECTION → RECOMMENDATION → HUMAN APPROVAL → ACTION
          </div>
          <h3 className="text-sm font-bold text-white">
            SchoolOS Proactive Operating Philosophy
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Unlike legacy ERPs that wait for administrators to generate manual reports, SchoolOS continuously calculates operational indicators across attendance, fee accounts, and class assessments to surface priorities before they become crises.
          </p>
        </div>
      </div>

      {/* Pulse Items Grid */}
      <div className="space-y-4">
        {pulseItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                  item.severity === 'critical'
                    ? 'bg-rose-500'
                    : item.severity === 'warning'
                    ? 'bg-amber-500'
                    : item.severity === 'success'
                    ? 'bg-emerald-500'
                    : 'bg-sky-500'
                }`}
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      item.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : item.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.severity}
                  </span>
                  {item.metric && (
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      {item.metric}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center shrink-0">
              <button
                onClick={() => {
                  if (item.actionType === 'view_students' || item.actionType === 'view_attendance') {
                    onNavigate('students');
                  } else if (item.actionType === 'view_fees') {
                    onNavigate('fees');
                  } else if (item.actionType === 'view_staff') {
                    onNavigate('teachers');
                  }
                }}
                className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>{item.actionLabel}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
