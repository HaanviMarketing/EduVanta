import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Printer,
  Layers,
  Users,
  Shield,
  X,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { DayOfWeek, TimetableSlot } from '../../types';

export const TimetableBuilder: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [viewMode, setViewMode] = useState<'class' | 'teacher'>('class');

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  // Slot editor modal state
  const [editingSlot, setEditingSlot] = useState<{
    dayOfWeek: DayOfWeek;
    periodNumber: number;
    currentSlot?: TimetableSlot;
  } | null>(null);

  const [slotForm, setSlotForm] = useState({
    subjectId: '',
    teacherId: '',
    roomNo: '',
  });

  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  if (!currentTenant) return null;

  const classes = repo.getClasses(currentTenant.id);
  const sections = repo.getSections(currentTenant.id);
  const subjects = repo.getSubjects(currentTenant.id);
  const teachers = repo.getTeachers(currentTenant.id);

  // Set initial selections
  if (!selectedClassId && classes.length > 0) setSelectedClassId(classes[0].id);
  const availableSections = sections.filter((s) => s.classId === selectedClassId);
  if (!selectedSectionId && availableSections.length > 0) setSelectedSectionId(availableSections[0].id);
  if (!selectedTeacherId && teachers.length > 0) setSelectedTeacherId(teachers[0].id);

  const days: { key: DayOfWeek; label: string }[] = [
    { key: 'mon', label: 'Monday' },
    { key: 'tue', label: 'Tuesday' },
    { key: 'wed', label: 'Wednesday' },
    { key: 'thu', label: 'Thursday' },
    { key: 'fri', label: 'Friday' },
    { key: 'sat', label: 'Saturday' },
  ];

  const periods = [1, 2, 3, 4, 5, 6];

  // Fetch slots based on view mode
  const currentSlots =
    viewMode === 'class'
      ? repo.getTimetableSlots(currentTenant.id, selectedClassId, selectedSectionId)
      : repo.getTimetableSlots(currentTenant.id, undefined, undefined, selectedTeacherId);

  const handleOpenEditor = (day: DayOfWeek, period: number, current?: TimetableSlot) => {
    setConflictWarning(null);
    setEditingSlot({ dayOfWeek: day, periodNumber: period, currentSlot: current });
    setSlotForm({
      subjectId: current?.subjectId || subjects[0]?.id || '',
      teacherId: current?.teacherId || teachers[0]?.id || '',
      roomNo: current?.roomNo || 'Room 301',
    });
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;

    const result = repo.saveTimetableSlot(
      currentTenant.id,
      {
        classId: selectedClassId,
        sectionId: selectedSectionId,
        dayOfWeek: editingSlot.dayOfWeek,
        periodNumber: editingSlot.periodNumber,
        subjectId: slotForm.subjectId,
        teacherId: slotForm.teacherId,
        roomNo: slotForm.roomNo,
      },
      currentUser || undefined
    );

    if (result.conflict) {
      setConflictWarning(result.conflict);
    } else {
      setEditingSlot(null);
      setConflictWarning(null);
    }
  };

  const handleDeleteSlot = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    repo.deleteTimetableSlot(currentTenant.id, slotId, currentUser || undefined);
    setEditingSlot(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Interactive Timetable Matrix</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated period scheduling with real-time faculty & classroom conflict detection · {currentTenant.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold">
            <button
              onClick={() => setViewMode('class')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'class' ? 'bg-teal-800 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Class-wise Matrix
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'teacher' ? 'bg-teal-800 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty Workload View
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Schedule</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center gap-4 text-xs">
        {viewMode === 'class' ? (
          <>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Target Grade</label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  const sec = sections.find((s) => s.classId === e.target.value);
                  if (sec) setSelectedSectionId(sec.id);
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 bg-white font-medium"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Section</label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 bg-white font-medium"
              >
                {availableSections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-slate-500 font-medium mb-1">Select Faculty Member</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 bg-white font-medium min-w-[220px]"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName} ({t.department})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="ml-auto text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
          <span>Click any period box to assign or reschedule faculty</span>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-center text-xs border-collapse">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-3.5 border-r border-b border-slate-200 w-28 bg-slate-100/70">Day / Period</th>
              {periods.map((p) => (
                <th key={p} className="p-3 border-r border-b border-slate-200 min-w-[150px]">
                  <div>Period {p}</div>
                  <div className="text-[9px] font-mono text-slate-400 font-normal mt-0.5">
                    {p === 1 && '08:30 - 09:15'}
                    {p === 2 && '09:15 - 10:00'}
                    {p === 3 && '10:15 - 11:00'}
                    {p === 4 && '11:00 - 11:45'}
                    {p === 5 && '12:30 - 01:15'}
                    {p === 6 && '01:15 - 02:00'}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {days.map((day) => (
              <tr key={day.key} className="hover:bg-slate-50/50">
                <td className="p-3.5 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/70 text-left">
                  {day.label}
                </td>

                {periods.map((period) => {
                  const slot = currentSlots.find(
                    (s) => s.dayOfWeek === day.key && s.periodNumber === period
                  );

                  const subject = subjects.find((sub) => sub.id === slot?.subjectId);
                  const teacher = teachers.find((t) => t.id === slot?.teacherId);
                  const cls = classes.find((c) => c.id === slot?.classId);

                  return (
                    <td
                      key={period}
                      onClick={() => handleOpenEditor(day.key, period, slot)}
                      className="p-2.5 border-r border-slate-100 align-top cursor-pointer transition-colors hover:bg-teal-50/50 group"
                    >
                      {slot ? (
                        <div className="p-2.5 bg-teal-50/70 border border-teal-200/80 rounded-lg text-left space-y-1 group-hover:border-teal-400 shadow-2xs">
                          <div className="font-bold text-teal-950 text-xs truncate">
                            {subject?.name || 'Class Subject'}
                          </div>
                          <div className="text-[11px] text-teal-800 font-medium truncate">
                            {viewMode === 'class' ? (
                              <span>{teacher?.firstName} {teacher?.lastName}</span>
                            ) : (
                              <span>{cls?.name}</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                            <span>{slot.roomNo || 'Room 301'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-16 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-teal-400 group-hover:text-teal-700">
                          <Plus className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slot Editor Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Period {editingSlot.periodNumber} ({editingSlot.dayOfWeek.toUpperCase()})
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Assign Subject, Teacher, and Classroom allocation
                </p>
              </div>
              <button
                onClick={() => setEditingSlot(null)}
                className="text-slate-400 hover:text-slate-600 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conflict Alert Warning */}
            {conflictWarning && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Timetable Collision Detected</span>
                </div>
                <p className="text-[11px] leading-relaxed">{conflictWarning}</p>
              </div>
            )}

            <form onSubmit={handleSaveSlot} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Subject *</label>
                <select
                  value={slotForm.subjectId}
                  onChange={(e) => setSlotForm({ ...slotForm, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 bg-white"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Teaching Faculty *</label>
                <select
                  value={slotForm.teacherId}
                  onChange={(e) => setSlotForm({ ...slotForm, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 bg-white"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Room / Laboratory</label>
                <input
                  type="text"
                  placeholder="e.g. Room 301 / Physics Lab"
                  value={slotForm.roomNo}
                  onChange={(e) => setSlotForm({ ...slotForm, roomNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {editingSlot.currentSlot ? (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSlot(editingSlot.currentSlot!.id, e)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Period</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSlot(null)}
                    className="px-3 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Period Slot</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
