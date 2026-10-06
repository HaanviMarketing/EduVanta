import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './features/dashboard/Dashboard';
import { SchoolPulseView } from './features/pulse/SchoolPulseView';
import { StudentManagement } from './features/students/StudentManagement';
import { TeacherManagement } from './features/teachers/TeacherManagement';
import { AcademicsManagement } from './features/academics/AcademicsManagement';
import { FeeManagement } from './features/fees/FeeManagement';
import { AttendanceManagement } from './features/attendance/AttendanceManagement';
import { TimetableBuilder } from './features/timetable/TimetableBuilder';
import { ExamsManagement } from './features/exams/ExamsManagement';
import { AdmissionsCRM } from './features/crm/AdmissionsCRM';
import { AutomationStudio } from './features/automation/AutomationStudio';
import { TransportManagement } from './features/transport/TransportManagement';
import { LibraryManagement } from './features/library/LibraryManagement';
import { CertificatesManagement } from './features/certificates/CertificatesManagement';
import { NoticeboardAndCalendar } from './features/communication/NoticeboardAndCalendar';
import { PayrollManagement } from './features/payroll/PayrollManagement';
import { ParentPortal } from './features/portals/ParentPortal';
import { TeacherPortal } from './features/portals/TeacherPortal';
import { SchoolSettings } from './features/settings/SchoolSettings';
import { SuperAdminPortal } from './features/superadmin/SuperAdminPortal';
import { OnboardingWizard } from './features/onboarding/OnboardingWizard';
import { UserManual } from './features/manual/UserManual';
import { PublicLandingPage } from './features/landing/PublicLandingPage';
import { SchoolOSCopilot } from './components/copilot/SchoolOSCopilot';
import { CommandPalette } from './components/search/CommandPalette';
import { AuditLogModal } from './features/audit/AuditLogModal';
import { repo } from './lib/storage';

const MainApp: React.FC = () => {
  const { currentTenant, currentUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();

  React.useEffect(() => {
    if (currentUser?.role === 'parent') {
      setActiveTab('parent_portal');
    } else if (currentUser?.role === 'teacher' || currentUser?.role === 'class_teacher') {
      setActiveTab('teacher_portal');
    }
  }, [currentUser?.role]);

  if (isLoading || !currentTenant) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white space-y-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center font-bold text-slate-900 text-lg animate-pulse">
          EV
        </div>
        <div className="text-sm font-semibold tracking-wide">Loading Eduvanta SaaS Platform...</div>
        <div className="text-xs text-slate-400">Synchronizing isolated multi-tenant school records</div>
      </div>
    );
  }

  const pulseCount = repo.getSchoolPulse(currentTenant.id).length;

  if (activeTab === 'landing') {
    return (
      <PublicLandingPage
        onGoToDashboard={() => setActiveTab('dashboard')}
        onOpenManual={() => setActiveTab('manual')}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100/70 font-sans text-slate-900 antialiased">
      {/* Sidebar */}
      <Sidebar
        activeTab={isOnboardingOpen ? 'onboarding' : activeTab}
        onSelectTab={(tab) => {
          if (tab === 'onboarding') {
            setIsOnboardingOpen(true);
          } else {
            setIsOnboardingOpen(false);
            setActiveTab(tab);
          }
        }}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        pulseCount={pulseCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Executive Topbar */}
        <Navbar
          onOpenCommand={() => setIsCommandOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          onOpenAuditLogs={() => setIsAuditModalOpen(true)}
          onStartOnboarding={() => setIsOnboardingOpen(true)}
          onOpenLanding={() => setActiveTab('landing')}
        />

        {/* Dynamic Main Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {isOnboardingOpen ? (
              <OnboardingWizard
                onComplete={(tenantId) => {
                  setIsOnboardingOpen(false);
                  setActiveTab('dashboard');
                }}
                onCancel={() => setIsOnboardingOpen(false)}
              />
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <Dashboard
                    onNavigate={(tab) => setActiveTab(tab)}
                    onOpenCopilot={() => setIsCopilotOpen(true)}
                    onSelectStudent={(sId) => {
                      setSelectedStudentId(sId);
                      setActiveTab('students');
                    }}
                  />
                )}

                {activeTab === 'pulse' && (
                  <SchoolPulseView
                    onNavigate={(tab) => setActiveTab(tab)}
                    onOpenCopilot={() => setIsCopilotOpen(true)}
                  />
                )}

                {activeTab === 'students' && (
                  <StudentManagement initialSelectedStudentId={selectedStudentId} />
                )}

                {activeTab === 'teachers' && <TeacherManagement />}

                {activeTab === 'academics' && <AcademicsManagement />}

                {activeTab === 'timetable' && <TimetableBuilder />}

                {activeTab === 'exams' && <ExamsManagement />}

                {activeTab === 'attendance' && <AttendanceManagement />}

                {activeTab === 'fees' && <FeeManagement />}

                {activeTab === 'crm' && <AdmissionsCRM />}

                {activeTab === 'transport' && <TransportManagement />}

                {activeTab === 'library' && <LibraryManagement />}

                {activeTab === 'certificates' && <CertificatesManagement />}

                {activeTab === 'notices' && <NoticeboardAndCalendar />}

                {activeTab === 'payroll' && <PayrollManagement />}

                {activeTab === 'automation' && <AutomationStudio />}

                {activeTab === 'parent_portal' && <ParentPortal />}

                {activeTab === 'teacher_portal' && <TeacherPortal />}

                {activeTab === 'settings' && <SchoolSettings />}

                {activeTab === 'manual' && <UserManual />}

                {activeTab === 'audit' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900">Tenant Audit Trail</h2>
                      <button
                        onClick={() => setIsAuditModalOpen(true)}
                        className="px-3 py-1.5 bg-teal-800 text-white rounded-lg text-xs font-semibold"
                      >
                        Open Full Screen Audit Modal
                      </button>
                    </div>
                    <AuditLogModal isOpen={true} onClose={() => setActiveTab('dashboard')} />
                  </div>
                )}

                {activeTab === 'superadmin' && (
                  <SuperAdminPortal onStartOnboarding={() => setIsOnboardingOpen(true)} />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Global AI Copilot Slide-out */}
      <SchoolOSCopilot isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={(tab) => {
          setIsOnboardingOpen(false);
          setActiveTab(tab);
        }}
        onSelectStudent={(sId) => {
          setSelectedStudentId(sId);
          setActiveTab('students');
        }}
      />

      {/* Audit Log Modal */}
      {isAuditModalOpen && (
        <AuditLogModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
