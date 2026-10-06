import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  Plus,
  Printer,
  Award,
  CheckCircle2,
  Clock,
  Download,
  Building,
  User,
  ShieldCheck,
  Check,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { CertificateRecord, CertificateType } from '../../types';
import { CertificatePrintModal } from './CertificatePrintModal';

export const CertificatesManagement: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | CertificateType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Certificates list
  const [certificates, setCertificates] = useState<CertificateRecord[]>(() =>
    currentTenant ? repo.getCertificates(currentTenant.id) : []
  );

  // Selected Certificate for Print/View Modal
  const [selectedCertForPrint, setSelectedCertForPrint] = useState<CertificateRecord | null>(null);

  // New Certificate Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [certType, setCertType] = useState<CertificateType>('transfer_certificate');
  const [certPurpose, setCertPurpose] = useState('');
  const [certConduct, setCertConduct] = useState<'Exemplary' | 'Very Good' | 'Good' | 'Satisfactory'>('Very Good');
  const [promotedNextClass, setPromotedNextClass] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!currentTenant) return null;

  const students = repo.getStudents(currentTenant.id);
  const classes = repo.getClasses(currentTenant.id);

  const filteredCerts = certificates.filter((c) => {
    const matchesFilter = activeFilter === 'all' || c.type === activeFilter;
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certificateNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const tcCount = certificates.filter((c) => c.type === 'transfer_certificate').length;
  const bonafideCount = certificates.filter((c) => c.type === 'bonafide_certificate').length;
  const taxCount = certificates.filter((c) => c.type === 'fee_tax_80c').length;
  const charCount = certificates.filter((c) => c.type === 'character_certificate').length;

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student || !certPurpose) return;

    const studentClass = classes.find((c) => c.id === student.classId)?.name || 'Grade 10';
    const prefix =
      certType === 'transfer_certificate'
        ? 'TC'
        : certType === 'bonafide_certificate'
        ? 'BON'
        : certType === 'character_certificate'
        ? 'CHR'
        : 'TAX-80C';

    const certNo = `${prefix}/2026/${Math.floor(100 + Math.random() * 900)}`;

    const newRecord = repo.issueCertificate(
      currentTenant.id,
      {
        certificateNo: certNo,
        type: certType,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        studentClass,
        admissionNo: student.admissionNo,
        issueDate: new Date().toISOString().split('T')[0],
        purpose: certPurpose,
        reasonForLeaving: certType === 'transfer_certificate' ? certPurpose : undefined,
        conduct: certConduct,
        promotedToNextClass: certType === 'transfer_certificate' ? promotedNextClass : undefined,
        academicYear: '2026-2027',
      },
      currentUser || undefined
    );

    setCertificates(repo.getCertificates(currentTenant.id));
    setIsIssueModalOpen(false);
    setCertPurpose('');
    setSelectedStudentId('');
    setSuccessMsg(`Official ${prefix} #${certNo} generated and signed for ${student.firstName} ${student.lastName}.`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-800">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Official Certificates & Documents Generator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Board-compliant Transfer Certificates (TC), Bonafide verification, Character certificates, and Section 80C Tuition Fee tax letters.
          </p>
        </div>

        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Certificate</span>
        </button>
      </div>

      {/* Success Notification Bar */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Certificates Issued</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{certificates.length} Records</div>
          <span className="text-[11px] text-teal-800 font-semibold block mt-1">Institutional Serial Registry</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Transfer Certificates (TC)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{tcCount} TCs</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">CBSE/ICSE statutory board layout</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bonafide Verifications</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{bonafideCount} Issued</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">Passport, Visa, and Olympiad proof</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Section 80C Fee Letters</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{taxCount} Generated</div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Parent Income Tax Rebate</span>
        </div>
      </div>

      {/* Controls: Search and Filter Pills */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student, serial # or purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700 focus:outline-hidden"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Certificates' },
              { id: 'transfer_certificate', label: 'Transfer (TC)' },
              { id: 'bonafide_certificate', label: 'Bonafide' },
              { id: 'fee_tax_80c', label: 'Section 80C' },
              { id: 'character_certificate', label: 'Character' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeFilter === f.id
                    ? 'bg-teal-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">Showing {filteredCerts.length} documents</div>
      </div>

      {/* Certificate Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Serial / Document #</th>
                <th className="py-3 px-4">Certificate Type</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Admission #</th>
                <th className="py-3 px-4">Date of Issue</th>
                <th className="py-3 px-4">Purpose / Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Official Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCerts.map((cert) => {
                const badgeColor =
                  cert.type === 'transfer_certificate'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : cert.type === 'bonafide_certificate'
                    ? 'bg-teal-50 text-teal-800 border-teal-200'
                    : cert.type === 'fee_tax_80c'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-indigo-50 text-indigo-800 border-indigo-200';

                return (
                  <tr key={cert.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{cert.certificateNo}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                        {cert.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{cert.studentName}</td>
                    <td className="py-3.5 px-4">{cert.studentClass}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{cert.admissionNo}</td>
                    <td className="py-3.5 px-4 text-slate-700">{cert.issueDate}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate" title={cert.purpose}>
                      {cert.purpose}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        ISSUED
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCertForPrint(cert)}
                        className="px-3 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 ml-auto transition-colors shadow-2xs cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View & Print</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Certificate Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Issue Official School Certificate</span>
              </div>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Select Pupil / Student *
                </label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="">-- Choose Enrolled Student --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} (Roll: {st.rollNo}, Adm: {st.admissionNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Certificate Category *
                </label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="transfer_certificate">Transfer Certificate (TC / School Leaving)</option>
                  <option value="bonafide_certificate">Bonafide Student Certificate</option>
                  <option value="character_certificate">Character & Conduct Certificate</option>
                  <option value="fee_tax_80c">Tuition Fee Tax Certificate (Section 80C)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Purpose / Reason for Certificate *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    certType === 'transfer_certificate'
                      ? 'e.g. Relocating to Bangalore (Father transferred)'
                      : certType === 'bonafide_certificate'
                      ? 'e.g. Passport Application & Olympiad verification'
                      : 'e.g. Parent Income Tax 80C rebate'
                  }
                  value={certPurpose}
                  onChange={(e) => setCertPurpose(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    General Conduct
                  </label>
                  <select
                    value={certConduct}
                    onChange={(e) => setCertConduct(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Exemplary">Exemplary</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Satisfactory">Satisfactory</option>
                  </select>
                </div>

                {certType === 'transfer_certificate' && (
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="promoted"
                      checked={promotedNextClass}
                      onChange={(e) => setPromotedNextClass(e.target.checked)}
                      className="rounded text-teal-800"
                    />
                    <label htmlFor="promoted" className="text-xs font-semibold text-slate-700">
                      Promoted to higher class
                    </label>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Issue & Seal Document</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Official Print Modal when certificate is selected */}
      {selectedCertForPrint && (
        <CertificatePrintModal
          certificate={selectedCertForPrint}
          tenant={currentTenant}
          student={students.find((s) => s.id === selectedCertForPrint.studentId)}
          onClose={() => setSelectedCertForPrint(null)}
        />
      )}
    </div>
  );
};
