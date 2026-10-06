import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  FileText,
  Plus,
  Send,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Search,
  Check,
  X,
  Sparkles,
  MapPin,
  Tag,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { SchoolNotice, SchoolEvent } from '../../types';

export const NoticeboardAndCalendar: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'notices' | 'calendar'>('notices');

  // Notices filtering & search
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [noticeSearch, setNoticeSearch] = useState<string>('');

  // Events filtering
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('all');

  // Notices state
  const [notices, setNotices] = useState<SchoolNotice[]>(() =>
    currentTenant ? repo.getNotices(currentTenant.id) : []
  );

  // Events state
  const [events, setEvents] = useState<SchoolEvent[]>(() =>
    currentTenant ? repo.getEvents(currentTenant.id) : []
  );

  // Publish Notice Modal
  const [isPublishNoticeOpen, setIsPublishNoticeOpen] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeAudience, setNewNoticeAudience] = useState<SchoolNotice['targetAudience']>('all');
  const [newNoticePriority, setNewNoticePriority] = useState<SchoolNotice['priority']>('important');
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);

  // Add Event Modal
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventStart, setNewEventStart] = useState('');
  const [newEventEnd, setNewEventEnd] = useState('');
  const [newEventCat, setNewEventCat] = useState<SchoolEvent['category']>('academic');
  const [newEventLocation, setNewEventLocation] = useState('');

  // Success Notification
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!currentTenant) return null;

  // Filtered Notices
  const filteredNotices = notices.filter((n) => {
    const matchesAudience = audienceFilter === 'all' || n.targetAudience === audienceFilter || n.targetAudience === 'all';
    const matchesSearch =
      n.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      n.content.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      n.noticeNo.toLowerCase().includes(noticeSearch.toLowerCase());
    return matchesAudience && matchesSearch;
  });

  // Filtered Events
  const filteredEvents = events.filter((e) => {
    return eventCategoryFilter === 'all' || e.category === eventCategoryFilter;
  });

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;

    const noticeNo = `CIR/2026/${Math.floor(100 + Math.random() * 900)}`;

    const created = repo.publishNotice(
      currentTenant.id,
      {
        noticeNo,
        title: newNoticeTitle,
        content: newNoticeContent,
        targetAudience: newNoticeAudience,
        priority: newNoticePriority,
        publishDate: new Date().toISOString().split('T')[0],
        publisherName: currentUser?.name || 'School Office Administration',
        attachmentName: 'Official_Circular_Signed.pdf',
      },
      currentUser || undefined
    );

    setNotices(repo.getNotices(currentTenant.id));
    setIsPublishNoticeOpen(false);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setFeedbackMsg(
      `Circular "${created.title}" published! ${
        notifyWhatsapp ? 'Automated WhatsApp alerts broadcasted to ' + newNoticeAudience : ''
      }`
    );
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventStart) return;

    const created = repo.createEvent(
      currentTenant.id,
      {
        title: newEventTitle,
        description: newEventDesc,
        startDate: newEventStart,
        endDate: newEventEnd || newEventStart,
        category: newEventCat,
        isAllDay: true,
        location: newEventLocation || 'Main Campus',
      },
      currentUser || undefined
    );

    setEvents(repo.getEvents(currentTenant.id));
    setIsAddEventOpen(false);
    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventStart('');
    setNewEventEnd('');
    setNewEventLocation('');
    setFeedbackMsg(`Campus Event "${created.title}" scheduled on ${created.startDate}.`);
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-800">
              <Bell className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              School Noticeboard & Academic Calendar
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish institutional circulars with automated WhatsApp broadcasts, manage campus event dates, and schedule board examinations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddEventOpen(true)}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>+ Add Event</span>
          </button>
          <button
            onClick={() => setIsPublishNoticeOpen(true)}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Circular</span>
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl gap-6">
        <button
          onClick={() => setActiveTab('notices')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'notices'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Institutional Circulars ({notices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'calendar'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Academic Calendar & Key Dates ({events.length})</span>
        </button>
      </div>

      {/* Tab 1: Noticeboard & Circulars */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          {/* Controls: Search and Filter Pills */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search notices by title, contents or circular #..."
                  value={noticeSearch}
                  onChange={(e) => setNoticeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700 focus:outline-hidden"
                />
              </div>

              <div className="hidden sm:flex items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Audiences' },
                  { id: 'parents', label: 'Parents' },
                  { id: 'teachers', label: 'Teachers' },
                  { id: 'students', label: 'Students' },
                ].map((aud) => (
                  <button
                    key={aud.id}
                    onClick={() => setAudienceFilter(aud.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      audienceFilter === aud.id
                        ? 'bg-teal-800 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-400 font-medium">Showing {filteredNotices.length} circulars</div>
          </div>

          {/* Notices Grid */}
          <div className="space-y-4">
            {filteredNotices.map((notice) => {
              const isUrgent = notice.priority === 'urgent';
              const isImportant = notice.priority === 'important';

              return (
                <div
                  key={notice.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs space-y-3 transition-all ${
                    isUrgent
                      ? 'border-rose-300 ring-1 ring-rose-300/40'
                      : isImportant
                      ? 'border-amber-300 ring-1 ring-amber-300/40'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {notice.noticeNo}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isUrgent
                              ? 'bg-rose-100 text-rose-800'
                              : isImportant
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {notice.priority}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                          Audience: {notice.targetAudience}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{notice.title}</h3>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 font-medium shrink-0">
                      <div>Published: {notice.publishDate}</div>
                      <div className="text-slate-600 font-semibold">{notice.publisherName}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{notice.content}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    {notice.attachmentName ? (
                      <button
                        onClick={() => alert(`Simulating download of ${notice.attachmentName}`)}
                        className="text-teal-800 hover:text-teal-900 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{notice.attachmentName}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No attachments attached</span>
                    )}

                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <Radio className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Broadcasting to mobile & portal apps</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Academic Calendar & Events */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Event Category:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'holiday', label: 'Holidays' },
                  { id: 'exam', label: 'Exams' },
                  { id: 'ptm', label: 'PTM' },
                  { id: 'sports', label: 'Sports' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setEventCategoryFilter(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      eventCategoryFilter === c.id
                        ? 'bg-teal-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-400 font-medium">AY 2026-2027 Schedule</div>
          </div>

          {/* Events Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((ev) => {
              const isHoliday = ev.category === 'holiday';
              const isExam = ev.category === 'exam';
              const isPtm = ev.category === 'ptm';

              return (
                <div
                  key={ev.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs space-y-3 ${
                    isHoliday
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : isExam
                      ? 'border-rose-200 bg-rose-50/20'
                      : isPtm
                      ? 'border-amber-200 bg-amber-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          isHoliday
                            ? 'bg-emerald-100 text-emerald-800'
                            : isExam
                            ? 'bg-rose-100 text-rose-800'
                            : isPtm
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ev.category.toUpperCase()}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{ev.title}</h4>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.startDate}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>

                  {ev.location && (
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.location}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Publish Notice Modal */}
      {isPublishNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Publish Official Campus Circular</span>
              </div>
              <button onClick={() => setIsPublishNoticeOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishNotice} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Circular Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Second Term Diagnostic Assessments"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newNoticeAudience}
                    onChange={(e) => setNewNoticeAudience(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="all">All Community (Parents, Teachers, Students)</option>
                    <option value="parents">Parents Only</option>
                    <option value="teachers">Teaching Faculty Only</option>
                    <option value="students">Students Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newNoticePriority}
                    onChange={(e) => setNewNoticePriority(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="normal">Normal Circular</option>
                    <option value="important">Important Notification</option>
                    <option value="urgent">Urgent / Statutory Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Official Circular Content & Instructions *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Draft official instructions here..."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-teal-700" />
                  <span className="font-semibold text-teal-900">Broadcast Instant WhatsApp Dispatch</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWhatsapp}
                  onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                  className="rounded text-teal-800"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublishNoticeOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish & Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Schedule Campus Event</span>
              </div>
              <button onClick={() => setIsAddEventOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Science Exhibition 2026"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventStart}
                    onChange={(e) => setNewEventStart(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newEventEnd}
                    onChange={(e) => setNewEventEnd(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Event Category
                  </label>
                  <select
                    value={newEventCat}
                    onChange={(e) => setNewEventCat(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="academic">Academic Activity</option>
                    <option value="holiday">Official Holiday</option>
                    <option value="exam">Examination</option>
                    <option value="ptm">Parent-Teacher Meeting</option>
                    <option value="sports">Sports Tournament</option>
                    <option value="cultural">Cultural Festival</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Campus Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main Auditorium"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Event Brief Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Key notes, timings, or participating classes..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Schedule Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
