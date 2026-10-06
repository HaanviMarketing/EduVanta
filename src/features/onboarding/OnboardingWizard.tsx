import React, { useState } from 'react';
import {
  Check,
  Building,
  Palette,
  Calendar,
  GraduationCap,
  Layers,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';

interface OnboardingWizardProps {
  onComplete: (tenantId: string) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onCancel }) => {
  const { switchTenant } = useAuth();
  const [step, setStep] = useState(1);

  // Form State
  const [schoolData, setSchoolData] = useState({
    name: '',
    code: '',
    board: 'CBSE' as const,
    tagline: 'Empowering future leaders with knowledge and character',
    email: '',
    phone: '',
    website: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    logoUrl: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=150',
    primaryColor: '#0f766e',
    academicYearName: '2026-2027',
    classesCount: 10,
    selectedCurricula: ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'],
  });

  const totalSteps = 6;

  const handleFinish = () => {
    // 1. Create Tenant
    const newTenant = repo.createTenant({
      name: schoolData.name || 'New Greenfield Academy',
      slug: (schoolData.name || 'greenfield-academy').toLowerCase().replace(/\s+/g, '-'),
      code: schoolData.code || 'GFA-01',
      board: schoolData.board,
      tagline: schoolData.tagline,
      logoUrl: schoolData.logoUrl,
      email: schoolData.email || 'admin@greenfield.edu',
      phone: schoolData.phone || '+91 98111 00000',
      website: schoolData.website || 'https://greenfield.schoolos.app',
      address: {
        street: schoolData.street || 'Phase 1, Knowledge Park',
        city: schoolData.city || 'Greater Noida',
        state: schoolData.state || 'Uttar Pradesh',
        pincode: schoolData.pincode || '201310',
        country: 'India',
      },
      currentAcademicYearId: 'ay-2026-2027',
      plan: 'professional',
      subscriptionStatus: 'active',
      currency: 'INR',
      currencySymbol: '₹',
      branding: {
        primaryColor: schoolData.primaryColor,
        secondaryColor: '#0369a1',
        accentColor: '#f59e0b',
      },
      settings: {
        minAttendancePercent: 75,
        attendanceAlertThreshold: 70,
        feeLateFinePerDay: 50,
        allowParentLeaveApplication: true,
        enableWhatsAppAlerts: true,
        gradingScale: [
          { grade: 'A1', minScore: 91, maxScore: 100, gpa: 10, remark: 'Outstanding' },
          { grade: 'A2', minScore: 81, maxScore: 90, gpa: 9, remark: 'Excellent' },
          { grade: 'B1', minScore: 71, maxScore: 80, gpa: 8, remark: 'Very Good' },
          { grade: 'B2', minScore: 61, maxScore: 70, gpa: 7, remark: 'Good' },
          { grade: 'C', minScore: 40, maxScore: 60, gpa: 5, remark: 'Average' },
          { grade: 'D', minScore: 33, maxScore: 39, gpa: 4, remark: 'Pass' },
          { grade: 'E', minScore: 0, maxScore: 32, gpa: 0, remark: 'Needs Remedial Support' },
        ],
      },
    });

    // 2. Create Initial Classes
    const defaultClasses = [
      { name: 'Grade 10', code: 'G10', numericGrade: 10, capacity: 120 },
      { name: 'Grade 9', code: 'G9', numericGrade: 9, capacity: 120 },
      { name: 'Grade 8', code: 'G8', numericGrade: 8, capacity: 100 },
      { name: 'Grade 7', code: 'G7', numericGrade: 7, capacity: 100 },
    ];

    defaultClasses.forEach((c) => {
      const cls = repo.createClass(newTenant.id, c);
      // Create Section A for each
      repo.createSection(newTenant.id, {
        classId: cls.id,
        name: 'Section A',
        capacity: 40,
        roomNo: `Room ${c.numericGrade}01`,
      });
    });

    // 3. Create Core Subjects
    schoolData.selectedCurricula.forEach((subjName) => {
      repo.createSubject(newTenant.id, {
        name: subjName,
        code: subjName.substring(0, 4).toUpperCase(),
        type: 'theory',
        classIds: [],
        maxMarks: 100,
        passingMarks: 33,
        weightage: 100,
      });
    });

    switchTenant(newTenant.id);
    onComplete(newTenant.id);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in">
      {/* Wizard Header */}
      <div className="p-6 bg-slate-900 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>SchoolOS Setup Wizard</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Step {step} of {totalSteps}
          </span>
        </div>

        <h2 className="text-xl font-bold tracking-tight">Onboard New Educational Institution</h2>
        <p className="text-xs text-slate-400 mt-1">
          Set up institutional boundaries, branding, academic structure, and tenant isolation.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
          <div
            className="bg-teal-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 text-xs space-y-4 min-h-[340px]">
        {/* Step 1: School Identity */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-700" />
              <span>Institutional Identity & Affiliation</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">School Name *</label>
              <input
                type="text"
                placeholder="e.g. Greenwood International School"
                value={schoolData.name}
                onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-teal-600"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">School Code *</label>
                <input
                  type="text"
                  placeholder="e.g. GIS-01"
                  value={schoolData.code}
                  onChange={(e) => setSchoolData({ ...schoolData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Educational Board</label>
                <select
                  value={schoolData.board}
                  onChange={(e) => setSchoolData({ ...schoolData, board: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                >
                  <option value="CBSE">CBSE (India)</option>
                  <option value="ICSE">ICSE / ISC</option>
                  <option value="IB">International Baccalaureate (IB)</option>
                  <option value="Cambridge">Cambridge IGCSE</option>
                  <option value="State Board">State Board</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Motto / Tagline</label>
              <input
                type="text"
                value={schoolData.tagline}
                onChange={(e) => setSchoolData({ ...schoolData, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>
          </div>
        )}

        {/* Step 2: Contact & Address */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="font-semibold text-slate-900 text-sm">Official Contact & Campus Location</div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Admin Email *</label>
                <input
                  type="email"
                  placeholder="admin@school.edu"
                  value={schoolData.email}
                  onChange={(e) => setSchoolData({ ...schoolData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  placeholder="+91 98111 22334"
                  value={schoolData.phone}
                  onChange={(e) => setSchoolData({ ...schoolData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Campus Street Address</label>
              <input
                type="text"
                placeholder="Plot 12, Institutional Area, Sector 5"
                value={schoolData.street}
                onChange={(e) => setSchoolData({ ...schoolData, street: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="e.g. Pune"
                  value={schoolData.city}
                  onChange={(e) => setSchoolData({ ...schoolData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={schoolData.state}
                  onChange={(e) => setSchoolData({ ...schoolData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  placeholder="411001"
                  value={schoolData.pincode}
                  onChange={(e) => setSchoolData({ ...schoolData, pincode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Branding */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Palette className="w-4 h-4 text-teal-700" />
              <span>School Logo & Theme Color</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Logo Image URL</label>
              <input
                type="url"
                value={schoolData.logoUrl}
                onChange={(e) => setSchoolData({ ...schoolData, logoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Primary Theme Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={schoolData.primaryColor}
                  onChange={(e) => setSchoolData({ ...schoolData, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                />
                <span className="font-mono text-slate-600">{schoolData.primaryColor}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
              <img
                src={schoolData.logoUrl}
                alt="Logo preview"
                className="w-12 h-12 rounded-lg object-cover border border-slate-200"
              />
              <div>
                <div className="font-bold text-slate-900">{schoolData.name || 'Sample School Name'}</div>
                <div className="text-slate-500">{schoolData.board} Board</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Academic Year */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>Academic Year Session</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Academic Year</label>
              <input
                type="text"
                value={schoolData.academicYearName}
                onChange={(e) => setSchoolData({ ...schoolData, academicYearName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 font-mono"
              />
              <p className="text-slate-500 mt-1">
                Standard annual term spanning April 1, 2026 to March 31, 2027.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Classes & Curricula */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-700" />
              <span>Initial Classes & Curricula Setup</span>
            </div>

            <p className="text-slate-500 leading-relaxed">
              SchoolOS will automatically generate Grade 7 through Grade 10 with Section A and standard room allocations.
            </p>

            <div>
              <label className="block font-medium text-slate-700 mb-2">Included Subject Curricula:</label>
              <div className="flex flex-wrap gap-2">
                {['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science & AI', 'Hindi', 'Physical Ed'].map((subj) => {
                  const isSelected = schoolData.selectedCurricula.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSchoolData({
                            ...schoolData,
                            selectedCurricula: schoolData.selectedCurricula.filter((s) => s !== subj),
                          });
                        } else {
                          setSchoolData({
                            ...schoolData,
                            selectedCurricula: [...schoolData.selectedCurricula, subj],
                          });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                        isSelected
                          ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {subj} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Confirmation & Provisioning */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-teal-950 font-bold text-sm">
                <Check className="w-4 h-4 text-teal-700" />
                <span>Ready to Initialize SchoolOS Tenant</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Clicking Complete Setup will automatically configure tenant isolation, initialize default administrator and principal roles, build default grade levels, and establish institutional RBAC boundaries.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">School:</span>
                <span className="font-bold text-slate-900">{schoolData.name || 'Greenfield Academy'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Board:</span>
                <span className="font-medium text-slate-800">{schoolData.board}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Curricula:</span>
                <span className="text-slate-800">{schoolData.selectedCurricula.length} Subjects</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Subscription Tier:</span>
                <span className="font-bold text-teal-700">Professional (AI-Native Enabled)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
        ) : (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold text-xs"
          >
            Cancel
          </button>
        )}

        {step < totalSteps ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !schoolData.name.trim()}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Complete Setup & Launch SchoolOS</span>
          </button>
        )}
      </div>
    </div>
  );
};
