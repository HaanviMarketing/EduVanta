import React, { useState } from 'react';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Users,
  Plus,
  Radio,
  Navigation,
  CheckCircle2,
  X,
  Check,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { BusRoute, BusVehicle, LiveBusTelemetry } from '../../types';

export const TransportManagement: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'telemetry' | 'routes' | 'vehicles'>('telemetry');

  // Selected Route for GPS Live Telemetry
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-01');

  // Simulated live telemetry state
  const [simSpeed, setSimSpeed] = useState<number>(38);
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [simProgressStep, setSimProgressStep] = useState<number>(1);

  // New Route Modal State
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteCode, setNewRouteCode] = useState('');
  const [newMorningTime, setNewMorningTime] = useState('07:00 AM');
  const [newEveningTime, setNewEveningTime] = useState('02:15 PM');

  // New Vehicle Modal State
  const [isAddVehOpen, setIsAddVehOpen] = useState(false);
  const [newVehNo, setNewVehNo] = useState('');
  const [newVehModel, setNewVehModel] = useState('');
  const [newVehCapacity, setNewVehCapacity] = useState(42);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');

  if (!currentTenant) return null;

  const vehicles = repo.getTransportVehicles(currentTenant.id);
  const routes = repo.getTransportRoutes(currentTenant.id);
  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const assignedVehicle = vehicles.find((v) => v.id === activeRoute?.vehicleId);

  const totalCapacity = vehicles.reduce((sum, v) => sum + v.capacity, 0);
  const onRouteCount = vehicles.filter((v) => v.status === 'on_route').length;

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName || !newRouteCode) return;

    repo.saveBusRoute(
      currentTenant.id,
      {
        routeName: newRouteName,
        routeCode: newRouteCode,
        vehicleId: vehicles[0]?.id || 'veh-01',
        morningStartTime: newMorningTime,
        eveningStartTime: newEveningTime,
        stops: [
          { id: `stop-${Date.now()}-1`, stopName: 'Sector 14 Main Cross', morningPickupTime: '07:15 AM', eveningDropTime: '02:45 PM', studentIds: [] },
          { id: `stop-${Date.now()}-2`, stopName: 'DPS Campus Terminal', morningPickupTime: '08:10 AM', eveningDropTime: '02:20 PM', studentIds: [] },
        ],
      },
      currentUser || undefined
    );

    setIsAddRouteOpen(false);
    setNewRouteName('');
    setNewRouteCode('');
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehNo || !newDriverName) return;

    repo.saveBusVehicle(
      currentTenant.id,
      {
        vehicleNo: newVehNo,
        busModel: newVehModel || 'Eicher Skyline 40-Seater',
        capacity: Number(newVehCapacity),
        driverName: newDriverName,
        driverPhone: newDriverPhone || '+91 98111 00000',
        driverLicenseNo: 'DL-01201500991',
        conductorName: 'Rajesh',
        conductorPhone: '+91 98111 00001',
        gpsDeviceId: `GPS-${newVehNo.replace(/[^A-Z0-9]/gi, '')}`,
        insuranceExpiryDate: '2027-08-15',
        fitnessCertExpiryDate: '2027-06-30',
        status: 'idle',
      },
      currentUser || undefined
    );

    setIsAddVehOpen(false);
    setNewVehNo('');
    setNewVehModel('');
    setNewDriverName('');
    setNewDriverPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-800">
              <Bus className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Transport & Fleet Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time GPS bus telemetry, transit routes, student pickup rosters, driver compliance, and emergency SOS alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddVehOpen(true)}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            + Add Bus
          </button>
          <button
            onClick={() => setIsAddRouteOpen(true)}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Route</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Institutional Fleet</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{vehicles.length} Buses</div>
          <span className="text-[11px] text-teal-800 font-semibold block mt-1">
            Total Seating Capacity: {totalCapacity} students
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active on Route</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{onRouteCount} Vehicles</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>Broadcasting Live GPS Signals</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Transit Routes</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{routes.length} Active Corridors</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">Covering 14 pickup zones</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fleet Safety Score</span>
          <div className="text-2xl font-black text-slate-900 mt-1">100% Valid</div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            All fitness & insurance certificates current
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl gap-6">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'telemetry'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Live GPS Telemetry & Tracking</span>
        </button>

        <button
          onClick={() => setActiveTab('routes')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'routes'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Transit Routes & Stop Rosters ({routes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vehicles')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'vehicles'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Bus Fleet & Drivers ({vehicles.length})</span>
        </button>
      </div>

      {/* Tab 1: Live Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          {/* Route Switcher & Live Indicators */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Track Vehicle on Route:</span>
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden"
              >
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.routeCode} &bull; {r.routeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSosActive(!sosActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  sosActive
                    ? 'bg-rose-600 text-white animate-bounce'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{sosActive ? '🚨 SOS BROADCAST ACTIVE' : 'Simulate Driver SOS'}</span>
              </button>
            </div>
          </div>

          {sosActive && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold text-sm block">EMERGENCY SOS ALERT TRANSMITTED</span>
                  <span>
                    Bus {assignedVehicle?.vehicleNo} triggered distress alert near {activeRoute?.stops[1]?.stopName}.
                    Driver: {assignedVehicle?.driverName} ({assignedVehicle?.driverPhone}).
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSosActive(false)}
                className="px-3 py-1.5 bg-rose-700 text-white rounded-lg font-bold text-xs"
              >
                Dismiss SOS
              </button>
            </div>
          )}

          {/* Map & Live Corridor View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Simulated Map Display */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[380px] border border-slate-800">
              {/* Background Map Grid Graphic */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Live Overlay Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Live Telemetry Stream
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">GPS ID: {assignedVehicle?.gpsDeviceId}</span>
              </div>

              {/* Center Map Transit Path */}
              <div className="relative z-10 my-8 space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-300 px-2">
                  <span>Start: {activeRoute?.stops[0]?.stopName}</span>
                  <span className="font-bold text-teal-400">Destination: School Campus</span>
                </div>

                {/* Corridor Progression Bar with Stops */}
                <div className="relative">
                  <div className="h-2 rounded-full bg-slate-800 w-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${(simProgressStep / (activeRoute?.stops.length || 4)) * 100}%` }}
                    />
                  </div>

                  {/* Stop Pins along the line */}
                  <div className="flex justify-between items-center -mt-3.5 px-1">
                    {activeRoute?.stops.map((stop, idx) => (
                      <div
                        key={stop.id}
                        onClick={() => setSimProgressStep(idx + 1)}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            idx + 1 <= simProgressStep
                              ? 'bg-teal-400 text-slate-950 ring-4 ring-teal-400/20 shadow-md'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className="text-[10px] text-slate-400 group-hover:text-white mt-1 max-w-[80px] text-center truncate">
                          {stop.stopName.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Speed & Telemetry Footer */}
              <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Vehicle Speed</span>
                    <span className="text-lg font-black text-white font-mono">{simSpeed} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Next Stop</span>
                    <span className="text-sm font-bold text-teal-300">
                      {activeRoute?.stops[Math.min(simProgressStep, activeRoute.stops.length - 1)]?.stopName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Estimated Arrival</span>
                    <span className="text-sm font-bold text-emerald-400">4 mins</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSimSpeed(Math.max(0, simSpeed - 5))}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs"
                    title="Simulate brake"
                  >
                    - Speed
                  </button>
                  <button
                    onClick={() => setSimSpeed(Math.min(65, simSpeed + 5))}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs"
                    title="Simulate acceleration"
                  >
                    + Speed
                  </button>
                </div>
              </div>
            </div>

            {/* Assigned Bus & Driver Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                      Assigned Vehicle
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{assignedVehicle?.vehicleNo}</h3>
                    <span className="text-xs text-slate-500">{assignedVehicle?.busModel}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    GPS ONLINE
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Designated Driver:</span>
                    <span className="font-bold text-slate-800">{assignedVehicle?.driverName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Driver Phone:</span>
                    <span className="font-mono text-slate-800">{assignedVehicle?.driverPhone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Conductor:</span>
                    <span className="font-semibold text-slate-800">{assignedVehicle?.conductorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Bus Seating:</span>
                    <span className="font-bold text-slate-800">{assignedVehicle?.capacity} Seats</span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-slate-500">
                  <div className="flex justify-between text-[11px]">
                    <span>Commercial Insurance:</span>
                    <span className="font-semibold text-slate-700">Valid till {assignedVehicle?.insuranceExpiryDate}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Govt Fitness Certificate:</span>
                    <span className="font-semibold text-slate-700">Valid till {assignedVehicle?.fitnessCertExpiryDate}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${assignedVehicle?.driverPhone}`}
                  className="w-full py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver Cabin</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Routes & Stop Rosters */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {routes.map((route) => {
              const bus = vehicles.find((v) => v.id === route.vehicleId);
              return (
                <div key={route.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {route.routeCode}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{route.routeName}</h3>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Bus: {bus?.vehicleNo}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Morning Start: {route.morningStartTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Drop: {route.eveningStartTime}</span>
                    </div>
                  </div>

                  {/* Stops Timeline */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Designated Stops ({route.stops.length})
                    </span>
                    {route.stops.map((stop, idx) => (
                      <div key={stop.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-800">{stop.stopName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          <span>{stop.morningPickupTime}</span> &bull; <span>{stop.eveningDropTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Vehicles & Fleet */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{v.vehicleNo}</h4>
                  <span className="text-xs text-slate-500">{v.busModel}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    v.status === 'on_route'
                      ? 'bg-emerald-100 text-emerald-800'
                      : v.status === 'maintenance'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {v.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Seating Capacity:</span>
                  <span className="font-bold text-slate-800">{v.capacity} Seats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver:</span>
                  <span className="font-semibold text-slate-800">{v.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver Phone:</span>
                  <span className="font-mono text-slate-800">{v.driverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Conductor:</span>
                  <span className="font-semibold text-slate-800">{v.conductorName}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                <div>Fitness Cert Valid: {v.fitnessCertExpiryDate}</div>
                <div>Insurance Valid: {v.insuranceExpiryDate}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Route Modal */}
      {isAddRouteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Configure Transit Route</span>
              </div>
              <button onClick={() => setIsAddRouteOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoute} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Route Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohini & Pitampura Express"
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Route Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="R-03"
                    value={newRouteCode}
                    onChange={(e) => setNewRouteCode(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Morning Start
                  </label>
                  <input
                    type="text"
                    value={newMorningTime}
                    onChange={(e) => setNewMorningTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Evening Drop
                  </label>
                  <input
                    type="text"
                    value={newEveningTime}
                    onChange={(e) => setNewEveningTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRouteOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Route</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Vehicle Modal */}
      {isAddVehOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Add Bus to Fleet</span>
              </div>
              <button onClick={() => setIsAddVehOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Registration No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="DL-01-GH-3319"
                    value={newVehNo}
                    onChange={(e) => setNewVehNo(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="60"
                    value={newVehCapacity}
                    onChange={(e) => setNewVehCapacity(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Bus Model & Chassis
                </label>
                <input
                  type="text"
                  placeholder="Tata Starbus Ultra AC"
                  value={newVehModel}
                  onChange={(e) => setNewVehModel(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Driver Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaswinder Singh"
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Driver Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98111 88990"
                    value={newDriverPhone}
                    onChange={(e) => setNewDriverPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVehOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Register Vehicle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
