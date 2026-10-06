import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { ClassRoom, Section, Subject } from '../../types';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classes: ClassRoom[];
  sections: Section[];
  subjects: Subject[];
}

const teacherSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  department: z.string().min(2, 'Department is required'),
  designation: z.string().min(2, 'Designation is required'),
  gender: z.enum(['male', 'female', 'other']),
  experienceYears: z.number().min(0),
  qualification: z.string().min(2, 'Qualification is required'),
  address: z.string().min(5, 'Address is required'),
  employeeId: z.string().min(3, 'Employee ID is required'),
});

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  classes,
  sections,
  subjects,
}) => {
  const { currentTenant, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'female' as 'male' | 'female' | 'other',
    department: 'Mathematics',
    designation: 'Senior Faculty (PGT)',
    experienceYears: 5,
    qualification: 'M.Sc. Mathematics, B.Ed.',
    address: '',
    employeeId: `EMP-${Math.floor(100 + Math.random() * 900)}`,
    assignedSubjectId: subjects[0]?.id || '',
    assignedClassId: classes[0]?.id || '',
    isClassTeacher: false,
    classTeacherClassId: classes[0]?.id || '',
    classTeacherSectionId: sections[0]?.id || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen || !currentTenant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = teacherSchema.safeParse({
      ...formData,
      experienceYears: Number(formData.experienceYears),
    });

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errMap[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(errMap);
      return;
    }

    const assignedSection = sections.find((s) => s.classId === formData.assignedClassId);

    repo.createTeacher(
      currentTenant.id,
      {
        employeeId: formData.employeeId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        photoUrl: `https://images.unsplash.com/photo-${
          formData.gender === 'female' ? '1544005313-94ddf0286df2' : '1506794778202-cad84cf45f1d'
        }?w=150&auto=format&fit=crop&q=80`,
        gender: formData.gender,
        dob: '1988-04-10',
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        qualifications: [formData.qualification],
        experienceYears: Number(formData.experienceYears),
        joiningDate: new Date().toISOString().split('T')[0],
        department: formData.department,
        designation: formData.designation,
        employmentType: 'full_time',
        assignedSubjects: formData.assignedSubjectId
          ? [
              {
                subjectId: formData.assignedSubjectId,
                classId: formData.assignedClassId,
                sectionId: assignedSection?.id || '',
              },
            ]
          : [],
        isClassTeacherOf: formData.isClassTeacher
          ? {
              classId: formData.classTeacherClassId,
              sectionId: formData.classTeacherSectionId,
            }
          : undefined,
        status: 'active',
        todayAttendance: 'present',
      },
      currentUser || undefined
    );

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add Faculty Member</h2>
              <p className="text-xs text-slate-500">Teacher Management · {currentTenant.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Meera"
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
                placeholder="e.g. Sengupta"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
              {errors.lastName && <p className="text-[11px] text-rose-500 mt-0.5">{errors.lastName}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Employee ID *</label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-teal-600"
              />
              {errors.employeeId && <p className="text-[11px] text-rose-500 mt-0.5">{errors.employeeId}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 capitalize"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="faculty@school.edu"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
              {errors.email && <p className="text-[11px] text-rose-500 mt-0.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Phone Number *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 99201 11223"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
              {errors.phone && <p className="text-[11px] text-rose-500 mt-0.5">{errors.phone}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Sciences">Sciences</option>
                <option value="Humanities & Languages">Humanities & Languages</option>
                <option value="Technology">Technology & AI</option>
                <option value="Arts & Sports">Arts & Sports</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Designation *</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Senior PGT Mathematics"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
              {errors.designation && <p className="text-[11px] text-rose-500 mt-0.5">{errors.designation}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Qualifications *</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. M.Sc. Physics, B.Ed."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
              {errors.qualification && <p className="text-[11px] text-rose-500 mt-0.5">{errors.qualification}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Residential Address *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full residential address"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
              />
              {errors.address && <p className="text-[11px] text-rose-500 mt-0.5">{errors.address}</p>}
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-900">
                <input
                  type="checkbox"
                  checked={formData.isClassTeacher}
                  onChange={(e) => setFormData({ ...formData, isClassTeacher: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Assign as Class Teacher</span>
              </label>

              {formData.isClassTeacher && (
                <div className="grid grid-cols-2 gap-3 mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Grade / Class</label>
                    <select
                      value={formData.classTeacherClassId}
                      onChange={(e) => setFormData({ ...formData, classTeacherClassId: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Section</label>
                    <select
                      value={formData.classTeacherSectionId}
                      onChange={(e) => setFormData({ ...formData, classTeacherSectionId: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded bg-white"
                    >
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Faculty Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
