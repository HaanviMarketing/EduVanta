import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  MessageSquare,
  Plus,
  ArrowRight,
  Filter,
  Check,
  X,
  Play,
  RotateCcw,
  Sliders,
  DollarSign,
  CalendarCheck,
  GraduationCap,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { AiAgentConfig, AutomationRule, PendingAutomationApproval } from '../../types';

export const AutomationStudio: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'agents' | 'approvals' | 'rules' | 'simulator'>('agents');

  // Approvals State
  const [approvalsList, setApprovalsList] = useState<PendingAutomationApproval[]>(() =>
    currentTenant ? repo.getPendingApprovals(currentTenant.id) : []
  );

  // New Rule Modal
  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleTrigger, setNewRuleTrigger] = useState<AutomationRule['triggerEvent']>('attendance_below_threshold');
  const [newRuleCondition, setNewRuleCondition] = useState('');
  const [newRuleAction, setNewRuleAction] = useState<AutomationRule['actionType']>('send_whatsapp');
  const [newRuleAudience, setNewRuleAudience] = useState<AutomationRule['targetAudience']>('parents');

  // WhatsApp Simulator State
  const [simTemplate, setSimTemplate] = useState<'attendance' | 'fee' | 'academic' | 'general'>('attendance');
  const [simStudentName, setSimStudentName] = useState('Aarav Sharma');
  const [simParentPhone, setSimParentPhone] = useState('+91 98112 34567');
  const [simCustomNotice, setSimCustomNotice] = useState('');
  const [simDispatchSuccess, setSimDispatchSuccess] = useState(false);

  if (!currentTenant) return null;

  const agents = repo.getAiAgents(currentTenant.id);
  const rules = repo.getAutomationRules(currentTenant.id);
  const pendingApprovals = approvalsList.filter((a) => a.status === 'pending');

  const handleApprove = (approvalId: string) => {
    repo.approvePendingAction(currentTenant.id, approvalId, currentUser || undefined);
    setApprovalsList(repo.getPendingApprovals(currentTenant.id));
  };

  const handleReject = (approvalId: string) => {
    repo.rejectPendingAction(currentTenant.id, approvalId, currentUser || undefined);
    setApprovalsList(repo.getPendingApprovals(currentTenant.id));
  };

  const handleToggleRule = (ruleId: string) => {
    repo.toggleAutomationRule(currentTenant.id, ruleId, currentUser || undefined);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName || !newRuleCondition) return;

    repo.createAutomationRule(
      currentTenant.id,
      {
        name: newRuleName,
        description: newRuleDesc,
        triggerEvent: newRuleTrigger,
        condition: newRuleCondition,
        actionType: newRuleAction,
        targetAudience: newRuleAudience,
        isActive: true,
      },
      currentUser || undefined
    );

    setIsNewRuleModalOpen(false);
    setNewRuleName('');
    setNewRuleDesc('');
    setNewRuleCondition('');
  };

  const handleSimulateDispatch = () => {
    setSimDispatchSuccess(true);
    setTimeout(() => setSimDispatchSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-800">
              <Zap className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Automation Studio & Autonomous AI Agents</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Layer 3 Workflow Engine: Autonomous detection, human-in-the-loop approvals, and multi-channel notification dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewRuleModalOpen(true)}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Automation Rule</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl gap-6">
        <button
          onClick={() => setActiveTab('agents')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'agents'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Autonomous AI Agents ({agents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'approvals'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Human Approvals Queue</span>
          {pendingApprovals.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
              {pendingApprovals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'rules'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Workflow Rules ({rules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'simulator'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Notification Simulator</span>
        </button>
      </div>

      {/* Tab 1: AI Autonomous Agents */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {agents.map((agent) => {
              const IconComp =
                agent.iconName === 'CalendarCheck'
                  ? CalendarCheck
                  : agent.iconName === 'DollarSign'
                  ? DollarSign
                  : agent.iconName === 'GraduationCap'
                  ? GraduationCap
                  : UserCheck;

              return (
                <div
                  key={agent.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-teal-700/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{agent.agentName}</h3>
                          <span className="text-xs text-slate-500 font-medium">{agent.role}</span>
                        </div>
                      </div>

                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{agent.status}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{agent.description}</p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-lg">
                        <span className="text-slate-400 block text-[10px]">Model Accuracy</span>
                        <span className="font-bold text-teal-800">{agent.confidenceScore}%</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg">
                        <span className="text-slate-400 block text-[10px]">Actions Today</span>
                        <span className="font-bold text-slate-800">{agent.actionsPerformedToday}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg">
                        <span className="text-slate-400 block text-[10px]">Awaiting Sign-off</span>
                        <span
                          className={`font-bold ${
                            agent.pendingApprovalsCount > 0 ? 'text-rose-600' : 'text-slate-800'
                          }`}
                        >
                          {agent.pendingApprovalsCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Last audited 4 mins ago</span>
                    </span>

                    {agent.pendingApprovalsCount > 0 ? (
                      <button
                        onClick={() => setActiveTab('approvals')}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                      >
                        <span>Review {agent.pendingApprovalsCount} Approvals</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>All actions cleared</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Human-in-the-Loop Pending Approvals */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Administrative Sign-Off & Approvals Queue</h3>
              <p className="text-xs text-slate-500">
                SchoolOS Autonomous Agents never send notices or alter academic states without designated human consent.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
              {pendingApprovals.length} Actions Pending Review
            </span>
          </div>

          <div className="space-y-3">
            {approvalsList.map((appr) => {
              const isPending = appr.status === 'pending';
              return (
                <div
                  key={appr.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                    isPending ? 'border-amber-200 bg-white' : 'border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            appr.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {appr.priority} Priority
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Generated by {appr.agentName}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{appr.title}</h4>
                      <p className="text-xs text-slate-600">{appr.description}</p>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs space-y-1 mt-2">
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span className="font-semibold text-slate-700">Target Recipients:</span>
                          <span>{appr.recipientSummary}</span>
                        </div>
                        <div className="text-slate-700 pt-1 font-mono text-[11px] leading-relaxed">
                          "{appr.payloadSummary}"
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleApprove(appr.id)}
                            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Dispatch</span>
                          </button>
                          <button
                            onClick={() => handleReject(appr.id)}
                            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                            appr.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {appr.status === 'approved' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approved & Executed</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" />
                              <span>Rejected</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Workflow Automation Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-mono">
                      {rule.triggerEvent.replace(/_/g, ' ')}
                    </span>
                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        rule.isActive ? 'bg-teal-700' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          rule.isActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{rule.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{rule.description}</p>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1 font-mono text-[11px] text-slate-700">
                    <div>
                      <span className="text-slate-400">WHEN:</span> {rule.condition}
                    </div>
                    <div>
                      <span className="text-slate-400">ACTION:</span> {rule.actionType.replace(/_/g, ' ')} &rarr;{' '}
                      {rule.targetAudience}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Fired {rule.executionCount} times</span>
                  <span>Active & Audited</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Multi-Channel Communication Simulator */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Controls Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">WhatsApp Notification Dispatcher</h3>
              <p className="text-xs text-slate-500">
                Preview official template layouts delivered directly to parents' WhatsApp numbers.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Select Notification Template
                </label>
                <select
                  value={simTemplate}
                  onChange={(e) => setSimTemplate(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="attendance">Statutory Attendance Threshold Breach (&lt;75%)</option>
                  <option value="fee">Term Tuition Fee Overdue Reminder</option>
                  <option value="academic">Academic Progress & Unit Test Marks Summary</option>
                  <option value="general">Official School Circular / Holiday Notice</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={simStudentName}
                    onChange={(e) => setSimStudentName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Parent WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={simParentPhone}
                    onChange={(e) => setSimParentPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {simTemplate === 'general' && (
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Custom Notice Body
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter custom announcement text..."
                    value={simCustomNotice}
                    onChange={(e) => setSimCustomNotice(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={handleSimulateDispatch}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Test Dispatch to WhatsApp Gateway</span>
                </button>
              </div>

              {simDispatchSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Message delivered to simulated sandbox gateway!</span>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Phone Mockup */}
          <div className="bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-800 max-w-sm mx-auto w-full">
            {/* Phone Top Notch */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-3 pb-3 border-b border-slate-800">
              <span className="font-semibold text-white">9:41 AM</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-300">WhatsApp Verified</span>
              </div>
            </div>

            {/* School Chat Header */}
            <div className="py-3 px-2 flex items-center gap-2.5 border-b border-slate-800">
              <div className="w-8 h-8 rounded-full bg-teal-800 text-white font-bold flex items-center justify-center text-xs">
                {currentTenant.name[0]}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{currentTenant.name}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </h4>
                <span className="text-[10px] text-slate-400">Official Institutional Account</span>
              </div>
            </div>

            {/* Chat Body Bubble */}
            <div className="py-6 px-2 space-y-4">
              <div className="bg-emerald-950/80 border border-emerald-800/60 text-emerald-100 rounded-xl p-3.5 text-xs shadow-md space-y-2 relative">
                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>SchoolOS Automated Dispatch</span>
                </div>

                {simTemplate === 'attendance' && (
                  <div className="space-y-1 text-slate-200">
                    <p className="font-semibold text-white">Dear Parent / Guardian of {simStudentName},</p>
                    <p className="text-[11px] leading-relaxed">
                      This is an official communication regarding statutory attendance. Aggregate attendance has fallen to{' '}
                      <span className="font-bold text-amber-300">68.5%</span>, below the mandatory board threshold of 75%.
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Please log in to the SchoolOS Parent Portal or schedule a consultation with the Vice Principal.
                    </p>
                  </div>
                )}

                {simTemplate === 'fee' && (
                  <div className="space-y-1 text-slate-200">
                    <p className="font-semibold text-white">Dear Parent of {simStudentName},</p>
                    <p className="text-[11px] leading-relaxed">
                      Tuition fee of <span className="font-bold text-emerald-300">₹15,000</span> for Term 2 is past due.
                      Please settle before 10th October to avoid statutory late fines.
                    </p>
                    <div className="mt-2 p-2 rounded bg-emerald-900/60 text-center font-bold text-[11px] text-white">
                      UPI Pay Link: https://pay.schoolos.in/dps/term2
                    </div>
                  </div>
                )}

                {simTemplate === 'academic' && (
                  <div className="space-y-1 text-slate-200">
                    <p className="font-semibold text-white">Dear Parent of {simStudentName},</p>
                    <p className="text-[11px] leading-relaxed">
                      Pre-Board Examination marks have been published. Overall score:{' '}
                      <span className="font-bold text-emerald-300">84%</span>. Complete subject-wise report card and AI remarks
                      are ready for download.
                    </p>
                  </div>
                )}

                {simTemplate === 'general' && (
                  <div className="space-y-1 text-slate-200">
                    <p className="font-semibold text-white">Official Announcement:</p>
                    <p className="text-[11px] leading-relaxed">
                      {simCustomNotice || 'The school will remain closed this Friday on account of Annual Sports Day rehearsal.'}
                    </p>
                  </div>
                )}

                <div className="text-[10px] text-emerald-400/80 text-right pt-1">9:41 AM &bull; Delivered</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Rule Modal */}
      {isNewRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Configure Automation Workflow</span>
              </div>
              <button onClick={() => setIsNewRuleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Workflow Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chronic Absenteeism Early Intervention"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Trigger Event
                </label>
                <select
                  value={newRuleTrigger}
                  onChange={(e) => setNewRuleTrigger(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="attendance_below_threshold">Student Attendance Below Statutory Threshold</option>
                  <option value="fee_overdue">Fee Invoice Overdue by X Days</option>
                  <option value="exam_marks_regression">Exam Marks Regression &gt; 10%</option>
                  <option value="lead_created">New Admission Lead Captured</option>
                  <option value="leave_applied">Teacher Leave Application Approved</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Trigger Condition (Rule Logic) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Attendance &lt; 75% for 3 consecutive weeks"
                  value={newRuleCondition}
                  onChange={(e) => setNewRuleCondition(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Action Type
                  </label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="send_whatsapp">Send WhatsApp Alert</option>
                    <option value="require_human_approval">Queue for Admin Approval</option>
                    <option value="flag_student">Flag Student in SIS</option>
                    <option value="send_email">Send Email Summary</option>
                    <option value="create_task">Create Staff Task</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newRuleAudience}
                    onChange={(e) => setNewRuleAudience(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="parents">Registered Parents</option>
                    <option value="teachers">Class Teachers / Faculty</option>
                    <option value="principal">Principal & Management</option>
                    <option value="accountant">Accounts Dept</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Description / Purpose
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why this rule runs and who benefits..."
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRuleModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Activate Workflow</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
