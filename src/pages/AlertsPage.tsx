import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  ArrowRight, 
  Camera, 
  FileText,
  Filter,
  CheckCircle,
  HelpCircle,
  XCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCoordinates } from '../utils/geo';
import { VerificationTask, AlertItem } from '../types';

export const AlertsPage: React.FC = () => {
  const { 
    alerts, 
    verificationTasks, 
    updateVerificationTask, 
    resolveAlert, 
    navigate, 
    setSelectedInterventionId,
    setSelectedObservationId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'alerts'>('queue');
  const [selectedTask, setSelectedTask] = useState<VerificationTask | null>(verificationTasks[0] || null);
  const [reviewDecision, setReviewDecision] = useState<'Confirmed' | 'Not Confirmed' | 'Inconclusive'>('Confirmed');
  const [officerNotes, setOfficerNotes] = useState('');
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignedOfficer, setAssignedOfficer] = useState('K. Venkatesh (Field Officer)');

  const handleAssignTask = () => {
    if (!selectedTask) return;
    updateVerificationTask(selectedTask.id, {
      status: 'Assigned',
      assignedToName: assignedOfficer
    });
    setAssignmentModalOpen(false);
  };

  const handleSubmitReview = () => {
    if (!selectedTask) return;
    updateVerificationTask(selectedTask.id, {
      status: 'Approved',
      reviewDecision,
      fieldResponseNotes: officerNotes || selectedTask.fieldResponseNotes
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Field Verification & Anomaly Queue
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ground-truth validation loop: Remote Anomaly → Task Dispatch → Geo-Tagged Photo → Officer Review
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === 'queue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verification Tasks ({verificationTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === 'alerts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Remote Alerts ({alerts.filter(a => !a.resolved).length})
          </button>
        </div>
      </div>

      {/* Verification Workflow Diagram */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-3 font-bold">
          Field Verification Ground-Truth Loop
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-blue-700 font-bold">STEP 1</div>
            <div className="text-xs font-bold text-slate-900 mt-1">Remote Observation</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Sentinel-2 multi-spectral anomaly</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-amber-700 font-bold">STEP 2</div>
            <div className="text-xs font-bold text-slate-900 mt-1">Verification Task</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Catchment officer dispatch</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-indigo-700 font-bold">STEP 3</div>
            <div className="text-xs font-bold text-slate-900 mt-1">Field Inspection</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Field officer GPS ground visit</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-emerald-700 font-bold">STEP 4</div>
            <div className="text-xs font-bold text-slate-900 mt-1">Geo-Tagged Photo</div>
            <div className="text-[11px] text-slate-500 mt-0.5">EXIF-locked evidence uploaded</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-blue-700 font-bold">STEP 5</div>
            <div className="text-xs font-bold text-slate-900 mt-1">Officer Review</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Confirmed / Inconclusive decision</div>
          </div>
        </div>
      </div>

      {/* Tab 1: Verification Tasks Queue */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Tasks List */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Active Field Tasks</span>
              <span className="text-[10px] font-mono text-blue-700">{verificationTasks.length} Assigned</span>
            </div>

            <div className="space-y-2">
              {verificationTasks.map((task) => {
                const isSelected = selectedTask?.id === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-bold text-blue-700">{task.watershedCode}</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                        task.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : task.status === 'Field Submitted'
                          ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {task.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs leading-snug">{task.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{task.reason}</p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{task.assignedToName || 'Unassigned'}</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Selected Task Review Workspace */}
          {selectedTask && (
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-blue-700 uppercase font-bold">
                    Task Review Workspace
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{selectedTask.title}</h3>
                </div>
                <button
                  onClick={() => setAssignmentModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Re-assign Officer</span>
                </button>
              </div>

              {/* Anomaly Description & GPS Location */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Coordinates:</span>
                  <span className="text-slate-900 font-bold">{formatCoordinates(selectedTask.location.lat, selectedTask.location.lng)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Catchment:</span>
                  <span className="text-slate-900">{selectedTask.watershedCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Field Officer:</span>
                  <span className="text-slate-900 font-semibold">{selectedTask.assignedToName || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Remote Anomaly Trigger:</span>
                  <p className="text-slate-700 font-sans text-xs leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                    {selectedTask.remoteAnomalyDescription}
                  </p>
                </div>
              </div>

              {/* Field Response Evidence */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-mono">
                  Ground Verification Response
                </span>

                {selectedTask.fieldResponsePhotoUrl ? (
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0 border border-slate-300">
                      <img
                        src={selectedTask.fieldResponsePhotoUrl}
                        alt="Verification ground proof"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1 text-xs">
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        Ground Photo Geotag Verified
                      </span>
                      <p className="text-slate-700 italic text-xs leading-relaxed mt-1">
                        "{selectedTask.fieldResponseNotes}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center space-y-2">
                    <Clock className="w-6 h-6 text-amber-600 mx-auto" />
                    <div className="text-xs font-bold text-amber-800">
                      Awaiting Ground Inspection Photo Upload
                    </div>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      Field officer {selectedTask.assignedToName} has been dispatched to collect GPS geotagged imagery.
                    </p>
                    <button
                      onClick={() => navigate('/evidence')}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                    >
                      Upload Ground Verification Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Officer Review Decision */}
              {selectedTask.fieldResponsePhotoUrl && (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-mono">
                    Official Review & Sign-Off
                  </span>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setReviewDecision('Confirmed')}
                      className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        reviewDecision === 'Confirmed'
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-400'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Confirmed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewDecision('Not Confirmed')}
                      className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        reviewDecision === 'Not Confirmed'
                          ? 'bg-red-50 border-red-400 text-red-900 ring-1 ring-red-400'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Not Confirmed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewDecision('Inconclusive')}
                      className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        reviewDecision === 'Inconclusive'
                          ? 'bg-amber-50 border-amber-400 text-amber-900 ring-1 ring-amber-400'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>Inconclusive</span>
                    </button>
                  </div>

                  <button
                    onClick={handleSubmitReview}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Verification Decision & Finalize Evidence Chain
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Remote Alerts List */}
      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-colors ${
                alert.resolved
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 uppercase font-bold">
                  {alert.type.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono text-slate-500">{alert.date}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">{alert.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-800 font-semibold">{formatCoordinates(alert.location.lat, alert.location.lng)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (alert.relatedInterventionId) {
                        setSelectedInterventionId(alert.relatedInterventionId);
                        navigate(`/interventions/${alert.relatedInterventionId}`);
                      } else {
                        navigate('/explorer');
                      }
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold cursor-pointer"
                  >
                    Inspect Map
                  </button>
                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold cursor-pointer"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Modal */}
      {assignmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Assign Field Officer to Verification Task
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Officer Selection
              </label>
              <select
                value={assignedOfficer}
                onChange={(e) => setAssignedOfficer(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="K. Venkatesh (Field Officer)">K. Venkatesh (Field Officer - Vangara Cluster)</option>
                <option value="Smt. Priya Sharma (Officer)">Smt. Priya Sharma (Sub-divisional Officer)</option>
                <option value="Dr. Ramesh Babu (Admin)">Dr. Ramesh Babu (State Directorate)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAssignmentModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTask}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
