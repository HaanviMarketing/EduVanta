import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  TrendingUp,
  X,
  Check,
  Building,
  Clock,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { AdmissionLead, LeadStage, LeadSource } from '../../types';

const STAGES: { key: LeadStage; label: string; color: string; bg: string }[] = [
  { key: 'inquiry', label: '1. New Inquiry', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
  { key: 'campus_tour', label: '2. Campus Tour', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  { key: 'application_submitted', label: '3. Application', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  { key: 'assessment', label: '4. Assessment', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  { key: 'approved', label: '5. Approved', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  { key: 'enrolled', label: '6. Enrolled', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
];

export const AdmissionsCRM: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Intake Modal
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadGender, setNewLeadGender] = useState<'male' | 'female' | 'other'>('male');
  const [newLeadClassId, setNewLeadClassId] = useState('');
  const [newLeadParentName, setNewLeadParentName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadSource, setNewLeadSource] = useState<LeadSource>('website');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // Fast-track Enroll Modal
  const [leadToEnroll, setLeadToEnroll] = useState<AdmissionLead | null>(null);
  const [enrollClassId, setEnrollClassId] = useState('');
  const [enrollSectionId, setEnrollSectionId] = useState('');
  const [enrolledSuccessMsg, setEnrolledSuccessMsg] = useState<string | null>(null);

  if (!currentTenant) return null;

  const classes = repo.getClasses(currentTenant.id);
  const sections = repo.getSections(currentTenant.id);
  const leads = repo.getLeads(currentTenant.id);

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.parentPhone.includes(searchQuery);
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  const totalLeads = leads.length;
  const enrolledCount = leads.filter((l) => l.stage === 'enrolled').length;
  const highPropensity = leads.filter((l) => l.leadScore >= 85).length;
  const conversionRate = totalLeads > 0 ? Math.round((enrolledCount / totalLeads) * 100) : 0;

  const handleStageChange = (leadId: string, newStage: LeadStage) => {
    repo.updateLeadStage(currentTenant.id, leadId, newStage, currentUser || undefined);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadParentName || !newLeadPhone) return;

    // AI calculated initial lead score based on source & detail completeness
    let score = 70;
    if (newLeadSource === 'referral') score += 15;
    if (newLeadSource === 'walk_in') score += 10;
    if (newLeadEmail) score += 5;

    repo.createLead(
      currentTenant.id,
      {
        studentName: newLeadName,
        gender: newLeadGender,
        dob: '2012-05-15',
        applyingForClassId: newLeadClassId || (classes[0]?.id || ''),
        parentName: newLeadParentName,
        parentPhone: newLeadPhone,
        parentEmail: newLeadEmail || undefined,
        source: newLeadSource,
        stage: 'inquiry',
        leadScore: Math.min(99, score),
        notes: newLeadNotes || undefined,
      },
      currentUser || undefined
    );

    setIsAddLeadModalOpen(false);
    setNewLeadName('');
    setNewLeadParentName('');
    setNewLeadPhone('');
    setNewLeadEmail('');
    setNewLeadNotes('');
  };

  const handleConfirmEnrollment = () => {
    if (!leadToEnroll || !enrollClassId || !enrollSectionId) return;

    const res = repo.convertLeadToStudent(
      currentTenant.id,
      leadToEnroll.id,
      enrollClassId,
      enrollSectionId,
      currentUser || undefined
    );

    if (res) {
      setEnrolledSuccessMsg(
        `Successfully enrolled "${res.student.firstName} ${res.student.lastName}"! Student Admission No: ${res.student.admissionNo} generated.`
      );
      setTimeout(() => setEnrolledSuccessMsg(null), 5000);
    }
    setLeadToEnroll(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-800">
              <UserCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admissions CRM & Enrollment Pipeline</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track inquiries, campus visits, assessments, AI lead propensity scores, and fast-track student enrollment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pipeline Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Directory List
            </button>
          </div>

          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Admission Inquiry</span>
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {enrolledSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{enrolledSuccessMsg}</span>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Pipeline</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalLeads} Prospects</div>
          <span className="text-[11px] text-teal-800 font-semibold block mt-1">Across 6 enrollment stages</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">High Propensity (AI &gt;85%)</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{highPropensity} Leads</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">Ready for priority follow-up</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Successfully Enrolled</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{enrolledCount} Students</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">Added to Student Information System</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Conversion Rate</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{conversionRate}%</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+4.5% vs previous academic intake</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student, parent or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-700"
            >
              <option value="all">All Inflow Sources</option>
              <option value="website">Website Portal</option>
              <option value="referral">Parent Referral</option>
              <option value="walk_in">Walk-in Inquiry</option>
              <option value="social_media">Social Media / Ads</option>
              <option value="education_fair">Education Fair</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">Showing {filteredLeads.length} prospects</div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage.key);
            return (
              <div key={stage.key} className="bg-slate-100/70 rounded-xl p-3 border border-slate-200 min-w-[240px] space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className={`text-xs font-bold ${stage.color}`}>{stage.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-2xs border border-slate-200">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {stageLeads.map((lead) => {
                    const applyingClass = classes.find((c) => c.id === lead.applyingForClassId);
                    return (
                      <div
                        key={lead.id}
                        className="bg-white rounded-lg p-3 border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900">{lead.studentName}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              lead.leadScore >= 90
                                ? 'bg-purple-100 text-purple-800'
                                : lead.leadScore >= 80
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            AI {lead.leadScore}%
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 space-y-1">
                          <div className="font-semibold text-slate-700">Class: {applyingClass?.name || 'Unassigned'}</div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{lead.parentPhone}</span>
                          </div>
                          <div>Parent: {lead.parentName}</div>
                          {lead.scheduledTourDate && (
                            <div className="text-indigo-600 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Tour Scheduled</span>
                            </div>
                          )}
                        </div>

                        {/* Interactive Move / Action Menu */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <select
                            value={lead.stage}
                            onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)}
                            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700 text-[10px]"
                          >
                            {STAGES.map((s) => (
                              <option key={s.key} value={s.key}>
                                Move to {s.label}
                              </option>
                            ))}
                          </select>

                          {lead.stage !== 'enrolled' && (
                            <button
                              onClick={() => {
                                setLeadToEnroll(lead);
                                setEnrollClassId(lead.applyingForClassId);
                                const available = sections.filter((sec) => sec.classId === lead.applyingForClassId);
                                if (available.length > 0) setEnrollSectionId(available[0].id);
                              }}
                              className="px-2 py-1 bg-teal-800 hover:bg-teal-700 text-white rounded font-bold text-[10px] transition-colors"
                            >
                              Enroll
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {stageLeads.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-slate-400 italic">No prospects in this stage</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Directory List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Prospect</th>
                  <th className="py-3 px-4">Applying Class</th>
                  <th className="py-3 px-4">Parent / Guardian</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Lead Score</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const applyingClass = classes.find((c) => c.id === lead.applyingForClassId);
                  const stageObj = STAGES.find((s) => s.key === lead.stage);

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{lead.studentName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{applyingClass?.name || 'Class 9'}</td>
                      <td className="py-3 px-4">{lead.parentName}</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{lead.parentPhone}</td>
                      <td className="py-3 px-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                          {lead.source.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            lead.leadScore >= 90
                              ? 'bg-purple-100 text-purple-800'
                              : lead.leadScore >= 80
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {lead.leadScore}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stageObj?.color} bg-slate-100`}>
                          {stageObj?.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {lead.stage !== 'enrolled' ? (
                          <button
                            onClick={() => {
                              setLeadToEnroll(lead);
                              setEnrollClassId(lead.applyingForClassId);
                              const available = sections.filter((sec) => sec.classId === lead.applyingForClassId);
                              if (available.length > 0) setEnrollSectionId(available[0].id);
                            }}
                            className="px-2.5 py-1 bg-teal-800 hover:bg-teal-700 text-white rounded font-bold text-[11px] transition-colors"
                          >
                            Fast-track Enroll
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Enrolled</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Admission Inquiry Intake Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Record New Admission Inquiry</span>
              </div>
              <button onClick={() => setIsAddLeadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ishaan Verma"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Gender
                  </label>
                  <select
                    value={newLeadGender}
                    onChange={(e) => setNewLeadGender(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Applying For Grade
                  </label>
                  <select
                    value={newLeadClassId}
                    onChange={(e) => setNewLeadClassId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Inflow Source
                  </label>
                  <select
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value as LeadSource)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="website">Website Portal</option>
                    <option value="referral">Parent Referral</option>
                    <option value="walk_in">Front-Desk Walk In</option>
                    <option value="social_media">Social Media</option>
                    <option value="education_fair">Education Fair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Verma"
                    value={newLeadParentName}
                    onChange={(e) => setNewLeadParentName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Parent Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98112 34567"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Parent Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="ramesh.verma@domain.com"
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Initial Consultation Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Student interests, previous board, reason for school transfer..."
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save to Pipeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fast-track Enrollment Modal */}
      {leadToEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Fast-Track Student Enrollment</span>
              </div>
              <button onClick={() => setLeadToEnroll(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-200 text-teal-900 space-y-1">
                <span className="font-bold text-xs block">{leadToEnroll.studentName}</span>
                <p className="text-[11px] text-teal-700">
                  Enrolling this prospect will generate a permanent Student Profile, allocate a Student Admission Number,
                  and record the parent guardian in the SchoolOS SIS database.
                </p>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Enrolling Class
                </label>
                <select
                  value={enrollClassId}
                  onChange={(e) => {
                    setEnrollClassId(e.target.value);
                    const av = sections.filter((s) => s.classId === e.target.value);
                    if (av.length > 0) setEnrollSectionId(av[0].id);
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Assigned Section
                </label>
                <select
                  value={enrollSectionId}
                  onChange={(e) => setEnrollSectionId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  {sections
                    .filter((s) => s.classId === enrollClassId)
                    .map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name} (Capacity: {sec.capacity})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setLeadToEnroll(null)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEnrollment}
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Enrollment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
