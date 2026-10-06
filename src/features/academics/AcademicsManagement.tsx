import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Layers,
  GraduationCap,
  Users,
  Check,
  X,
  FileCode,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { hasPermission } from '../../lib/rbac';
import { ClassRoom, Section, Subject } from '../../types';

export const AcademicsManagement: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'classes' | 'sections' | 'subjects'>('classes');

  // Modals state
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);

  // New Class Form
  const [newClass, setNewClass] = useState({
    name: '',
    code: '',
    numericGrade: 10,
    capacity: 120,
    description: '',
  });

  // New Section Form
  const [newSection, setNewSection] = useState({
    name: 'Section C',
    classId: '',
    capacity: 40,
    roomNo: 'Room 303',
  });

  // New Subject Form
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    type: 'theory' as 'theory' | 'practical' | 'both',
    maxMarks: 100,
    passingMarks: 33,
    weightage: 100,
    selectedClassIds: [] as string[],
  });

  if (!currentTenant) return null;

  const classes = repo.getClasses(currentTenant.id);
  const sections = repo.getSections(currentTenant.id);
  const subjects = repo.getSubjects(currentTenant.id);
  const teachers = repo.getTeachers(currentTenant.id);
  const students = repo.getStudents(currentTenant.id);

  const canEdit = hasPermission(currentUser, 'academics', 'create');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name.trim()) return;

    repo.createClass(
      currentTenant.id,
      {
        name: newClass.name.trim(),
        code: newClass.code.trim() || newClass.name.substring(0, 3).toUpperCase(),
        numericGrade: Number(newClass.numericGrade),
        capacity: Number(newClass.capacity),
        description: newClass.description.trim(),
      },
      currentUser || undefined
    );

    setShowAddClass(false);
    setNewClass({ name: '', code: '', numericGrade: 10, capacity: 120, description: '' });
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    const classId = newSection.classId || classes[0]?.id;
    if (!classId || !newSection.name.trim()) return;

    repo.createSection(
      currentTenant.id,
      {
        classId,
        name: newSection.name.trim(),
        capacity: Number(newSection.capacity),
        roomNo: newSection.roomNo.trim(),
      },
      currentUser || undefined
    );

    setShowAddSection(false);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name.trim()) return;

    repo.createSubject(
      currentTenant.id,
      {
        name: newSubject.name.trim(),
        code: newSubject.code.trim() || newSubject.name.substring(0, 4).toUpperCase(),
        type: newSubject.type,
        classIds: newSubject.selectedClassIds.length > 0 ? newSubject.selectedClassIds : classes.map((c) => c.id),
        maxMarks: Number(newSubject.maxMarks),
        passingMarks: Number(newSubject.passingMarks),
        weightage: Number(newSubject.weightage),
      },
      currentUser || undefined
    );

    setShowAddSubject(false);
    setNewSubject({
      name: '',
      code: '',
      type: 'theory',
      maxMarks: 100,
      passingMarks: 33,
      weightage: 100,
      selectedClassIds: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academics & Curricula</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Class Roster · Section Division · Subject Specifications · {currentTenant.name}
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddClass(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class</span>
            </button>
            <button
              onClick={() => setShowAddSection(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-400" />
              <span>Add Section</span>
            </button>
            <button
              onClick={() => setShowAddSubject(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-400" />
              <span>Add Subject</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('classes')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'classes'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Classes ({classes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'sections'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sections & Rooms ({sections.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'subjects'
              ? 'border-teal-700 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Subjects & Grading ({subjects.length})</span>
        </button>
      </div>

      {/* Tab 1: Classes */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => {
            const classStudents = students.filter((s) => s.classId === c.id);
            const classSections = sections.filter((s) => s.classId === c.id);

            return (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                      <div className="text-[11px] text-teal-800 font-mono font-medium">
                        Code: {c.code} · Grade {c.numericGrade}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                      {classSections.length} Sections
                    </span>
                  </div>

                  {c.description && (
                    <p className="text-xs text-slate-500 mb-3">{c.description}</p>
                  )}

                  <div className="space-y-1.5 my-3 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Enrollment</span>
                      <span className="font-semibold text-slate-900">
                        {classStudents.length} / {c.capacity} students
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-teal-700 h-full rounded-full"
                        style={{ width: `${Math.min(100, (classStudents.length / c.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Sections: {classSections.map((s) => s.name).join(', ') || 'None'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Sections */}
      {activeTab === 'sections' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Section Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Room No</th>
                <th className="py-3 px-4">Class Teacher</th>
                <th className="py-3 px-4">Enrolled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sections.map((s) => {
                const parentClass = classes.find((c) => c.id === s.classId);
                const teacher = teachers.find((t) => t.id === s.classTeacherId);
                const enrolledCount = students.filter((st) => st.sectionId === s.id).length;

                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{parentClass?.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{s.capacity} max</td>
                    <td className="py-3 px-4 text-slate-500">{s.roomNo || 'TBD'}</td>
                    <td className="py-3 px-4">
                      {teacher ? (
                        <span className="font-semibold text-teal-800">
                          {teacher.firstName} {teacher.lastName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {enrolledCount} students
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Subjects */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Max Marks</th>
                <th className="py-3 px-4">Passing Marks</th>
                <th className="py-3 px-4">Applicable Classes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((subj) => (
                <tr key={subj.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{subj.name}</td>
                  <td className="py-3 px-4 font-mono text-teal-800 font-medium">{subj.code}</td>
                  <td className="py-3 px-4 capitalize">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                      {subj.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{subj.maxMarks}</td>
                  <td className="py-3 px-4 font-mono text-rose-600 font-semibold">{subj.passingMarks}</td>
                  <td className="py-3 px-4 text-slate-500">
                    {subj.classIds
                      .map((cid) => classes.find((c) => c.id === cid)?.name)
                      .filter(Boolean)
                      .join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add New Class Grade</h3>
              <button onClick={() => setShowAddClass(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateClass} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Class Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 11 (Commerce)"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Class Code</label>
                  <input
                    type="text"
                    placeholder="e.g. G11-COM"
                    value={newClass.code}
                    onChange={(e) => setNewClass({ ...newClass, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Numeric Grade</label>
                  <input
                    type="number"
                    value={newClass.numericGrade}
                    onChange={(e) => setNewClass({ ...newClass, numericGrade: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Student Capacity</label>
                <input
                  type="number"
                  value={newClass.capacity}
                  onChange={(e) => setNewClass({ ...newClass, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClass(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-lg"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add New Section</h3>
              <button onClick={() => setShowAddSection(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSection} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Class *</label>
                <select
                  value={newSection.classId || classes[0]?.id}
                  onChange={(e) => setNewSection({ ...newSection, classId: e.target.value })}
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
                <label className="block font-medium text-slate-700 mb-1">Section Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Section C"
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newSection.capacity}
                    onChange={(e) => setNewSection({ ...newSection, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 303"
                    value={newSection.roomNo}
                    onChange={(e) => setNewSection({ ...newSection, roomNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSection(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-lg"
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add Subject & Assessment Rules</h3>
              <button onClick={() => setShowAddSubject(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubject} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Robotics & Automation"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g. ROB-01"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Curriculum Type</label>
                  <select
                    value={newSubject.type}
                    onChange={(e) => setNewSubject({ ...newSubject, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600 capitalize"
                  >
                    <option value="theory">Theory</option>
                    <option value="practical">Practical</option>
                    <option value="both">Both Theory & Lab</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={newSubject.maxMarks}
                    onChange={(e) => setNewSubject({ ...newSubject, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={newSubject.passingMarks}
                    onChange={(e) => setNewSubject({ ...newSubject, passingMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-teal-600"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-lg"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
