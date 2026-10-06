import React, { useState } from 'react';
import { X, UserPlus, Check, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { ClassRoom, Section } from '../../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classes: ClassRoom[];
  sections: Section[];
}

const studentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['male', 'female', 'other']),
  dob: z.string().min(1, 'Date of birth is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  governmentId: z.string().optional(),
  classId: z.string().min(1, 'Class is required'),
  sectionId: z.string().min(1, 'Section is required'),
  admissionNo: z.string().min(3, 'Admission number is required'),
  rollNo: z.string().min(1, 'Roll number is required'),
  house: z.string().optional(),
  previousSchool: z.string().optional(),
  fatherName: z.string().min(2, 'Father name is required'),
  fatherPhone: z.string().min(10, 'Valid phone number is required'),
  fatherEmail: z.string().email().optional().or(z.literal('')),
  motherName: z.string().min(2, 'Mother name is required'),
  motherPhone: z.string().min(10, 'Valid phone number is required'),
  residentialAddress: z.string().min(5, 'Residential address is required'),
  emergencyContactPhone: z.string().min(10, 'Emergency phone is required'),
});

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  classes,
  sections,
}) => {
  const { currentTenant, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male' as 'male' | 'female' | 'other',
    dob: '2010-06-15',
    bloodGroup: 'B+',
    governmentId: '',
    classId: classes[0]?.id || '',
    sectionId: sections[0]?.id || '',
    admissionNo: `DPA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    rollNo: '10A-15',
    house: 'Shivaji House',
    previousSchool: '',
    fatherName: '',
    fatherPhone: '',
    fatherEmail: '',
    motherName: '',
    motherPhone: '',
    residentialAddress: '',
    emergencyContactPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'student' | 'parents'>('student');

  if (!isOpen || !currentTenant) return null;

  const filteredSections = sections.filter((s) => s.classId === formData.classId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = studentSchema.safeParse(formData);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errMap[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(errMap);
      if (
        errMap.fatherName ||
        errMap.fatherPhone ||
        errMap.motherName ||
        errMap.residentialAddress ||
        errMap.emergencyContactPhone
      ) {
        setActiveTab('parents');
      } else {
        setActiveTab('student');
      }
      return;
    }

    // Persist new student
    repo.createStudent(
      currentTenant.id,
      {
        admissionNo: formData.admissionNo,
        rollNo: formData.rollNo,
        firstName: formData.firstName,
        lastName: formData.lastName,
        photoUrl: `https://images.unsplash.com/photo-${
          formData.gender === 'female' ? '1534528741775-53994a69daeb' : '1500648767791-00dcc994a43e'
        }?w=150&auto=format&fit=crop&q=80`,
        gender: formData.gender,
        dob: formData.dob,
        bloodGroup: formData.bloodGroup,
        governmentId: formData.governmentId || undefined,
        admissionDate: new Date().toISOString().split('T')[0],
        academicYearId: currentTenant.currentAcademicYearId,
        classId: formData.classId,
        sectionId: formData.sectionId || filteredSections[0]?.id || '',
        house: formData.house,
        previousSchool: formData.previousSchool,
        status: 'active',
        parentGuardian: {
          fatherName: formData.fatherName,
          fatherPhone: formData.fatherPhone,
          fatherEmail: formData.fatherEmail || undefined,
          motherName: formData.motherName,
          motherPhone: formData.motherPhone,
          emergencyContactPhone: formData.emergencyContactPhone,
          residentialAddress: formData.residentialAddress,
        },
        attendancePercentage: 100,
        academicAverage: 80,
        feeBalance: 0,
        riskStatus: 'stable',
        riskReasons: ['Newly enrolled student record initialized'],
        recommendedActions: ['Complete classroom orientation and distribute ID badge'],
        documents: [],
      },
      currentUser || undefined
    );

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Enroll New Student</h2>
              <p className="text-xs text-slate-500">Student Information System (SIS) · {currentTenant.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 border-b border-slate-200 flex gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'student'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Student Bio & Class
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('parents')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'parents'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Parents & Emergency Contact
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'student' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Aarav"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
                {errors.firstName && <p className="text-[11px] text-rose-500 mt-0.5">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Kapoor"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
                {errors.lastName && <p className="text-[11px] text-rose-500 mt-0.5">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Admission Number *</label>
                <input
                  type="text"
                  value={formData.admissionNo}
                  onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-teal-600"
                />
                {errors.admissionNo && <p className="text-[11px] text-rose-500 mt-0.5">{errors.admissionNo}</p>}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Roll Number *</label>
                <input
                  type="text"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-teal-600"
                />
                {errors.rollNo && <p className="text-[11px] text-rose-500 mt-0.5">{errors.rollNo}</p>}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Grade / Class *</label>
                <select
                  value={formData.classId}
                  onChange={(e) => {
                    const cid = e.target.value;
                    const sec = sections.find((s) => s.classId === cid);
                    setFormData({ ...formData, classId: cid, sectionId: sec?.id || '' });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Section *</label>
                <select
                  value={formData.sectionId}
                  onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                >
                  {filteredSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 capitalize"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Blood Group *</label>
                <input
                  type="text"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  placeholder="e.g. O+, B+, A+"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Aadhaar / National ID</label>
                <input
                  type="text"
                  value={formData.governmentId}
                  onChange={(e) => setFormData({ ...formData, governmentId: e.target.value })}
                  placeholder="e.g. 9845-2231-1092"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">House Allocation</label>
                <input
                  type="text"
                  value={formData.house}
                  onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                  placeholder="e.g. Shivaji House"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Previous School</label>
                <input
                  type="text"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  placeholder="e.g. St. Mary's Convent"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Father's Name *</label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="e.g. Arun Kapoor"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
                {errors.fatherName && <p className="text-[11px] text-rose-500 mt-0.5">{errors.fatherName}</p>}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Father's Phone *</label>
                <input
                  type="text"
                  value={formData.fatherPhone}
                  onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                  placeholder="+91 98188 77665"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
                {errors.fatherPhone && <p className="text-[11px] text-rose-500 mt-0.5">{errors.fatherPhone}</p>}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mother's Name *</label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  placeholder="e.g. Priya Kapoor"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
                {errors.motherName && <p className="text-[11px] text-rose-500 mt-0.5">{errors.motherName}</p>}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mother's Phone *</label>
                <input
                  type="text"
                  value={formData.motherPhone}
                  onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })}
                  placeholder="+91 98188 77666"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
                {errors.motherPhone && <p className="text-[11px] text-rose-500 mt-0.5">{errors.motherPhone}</p>}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Emergency Contact Phone *</label>
                <input
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="+91 98188 77665"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
                {errors.emergencyContactPhone && (
                  <p className="text-[11px] text-rose-500 mt-0.5">{errors.emergencyContactPhone}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Parent Email</label>
                <input
                  type="email"
                  value={formData.fatherEmail}
                  onChange={(e) => setFormData({ ...formData, fatherEmail: e.target.value })}
                  placeholder="parent@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Residential Address *</label>
                <textarea
                  rows={2}
                  value={formData.residentialAddress}
                  onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                  placeholder="Street, Building, Sector, City, Pincode"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
                {errors.residentialAddress && (
                  <p className="text-[11px] text-rose-500 mt-0.5">{errors.residentialAddress}</p>
                )}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {activeTab === 'student' ? (
              <div></div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('student')}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Back to Student Bio
              </button>
            )}

            <div className="flex items-center gap-2">
              {activeTab === 'student' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('parents')}
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-lg"
                >
                  Next: Parents & Contact
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Enrollment</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
