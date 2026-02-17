
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, ShieldAlert, Cpu, FlaskConical, PlaneTakeoff, Snowflake, Orbit, Bot, Compass } from 'lucide-react';
import { TextCategory } from '../types';

const ModeCard: React.FC<{
  id: TextCategory;
  protoId: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onSelect: (id: TextCategory) => void;
}> = ({ id, protoId, title, description, icon, isActive, onSelect }) => (
  <div 
    onClick={() => onSelect(id)}
    className={`technical-border p-6 cursor-pointer transition-all group float-shadow relative overflow-hidden flex flex-col ${isActive ? 'bg-[var(--accent)]/5 border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10' : 'hover:bg-[var(--surface)] border-[var(--border)]'}`}
  >
    {/* Identification Overlay */}
    <div className="absolute top-0 right-0 p-2">
      <span className={`text-[7px] font-mono tracking-widest ${isActive ? 'text-[var(--accent)] opacity-100' : 'text-[var(--muted)] opacity-30'}`}>
        {protoId}
      </span>
    </div>

    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 technical-border transition-colors ${isActive ? 'bg-[var(--accent)] text-[var(--bg)] border-transparent' : 'bg-[var(--bg)] text-[var(--muted)] group-hover:text-[var(--fg)]'}`}>
        {icon}
      </div>
      {isActive && (
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.8)]"></div>
          <span className="text-[9px] text-[var(--accent)] font-bold tracking-widest uppercase">
            LINKED
          </span>
        </div>
      )}
    </div>
    
    <h3 className={`text-sm font-bold tracking-widest mb-3 uppercase ${isActive ? 'text-[var(--accent)]' : 'text-[var(--fg)]'}`}>{title}</h3>
    <p className={`text-[11px] leading-relaxed mb-4 min-h-[60px] ${isActive ? 'text-[var(--fg)] opacity-80' : 'text-[var(--muted)]'}`}>
      {description}
    </p>
    
    <div className={`mt-auto pt-3 border-t ${isActive ? 'border-[var(--accent)]/30' : 'border-[var(--border)]'} flex justify-between items-center text-[8px] uppercase tracking-[0.2em]`}>
      <span className={isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}>Module_Ready</span>
      <span className={isActive ? 'text-[var(--fg)]' : 'text-[var(--muted)] opacity-50'}>{isActive ? '[ ACTIVE ]' : '[ STANDBY ]'}</span>
    </div>
  </div>
);

const Modes: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = React.useState<TextCategory>(() => {
    return (localStorage.getItem('typing-ref-category') as TextCategory) || 'avionics';
  });

  const handleSelect = (category: TextCategory) => {
    setActiveCategory(category);
    localStorage.setItem('typing-ref-category', category);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h1 className="text-3xl font-dos mb-4 manual-heading">Operational Protocols</h1>
        <p className="text-xs text-[var(--muted)] uppercase tracking-widest leading-relaxed max-w-xl">
          Select a diagnostic data stream for input simulation. Each protocol provides unique technical terminology designed for high-stress operational environments.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModeCard 
          id="avionics"
          protoId="PRT_AV-101"
          title="Avionics Manual"
          description="Triple-redundant bus architectures, flight control logic, and sensor fusion arrays for orbital attitude adjustment."
          icon={<Cpu size={20} strokeWidth={1.5} />}
          isActive={activeCategory === 'avionics'}
          onSelect={handleSelect}
        />
        <ModeCard 
          id="thermal"
          protoId="PRT_TH-202"
          title="Thermal Protection"
          description="Ablative heat shield composite measurements, passive cooling loops, and atmospheric reentry thermal gradient logs."
          icon={<ShieldAlert size={20} strokeWidth={1.5} />}
          isActive={activeCategory === 'thermal'}
          onSelect={handleSelect}
        />
        <ModeCard 
          id="life-support"
          protoId="PRT_LS-303"
          title="Life Support"
          description="Closed-loop oxygen regeneration, CO2 scrubber efficiency telemetry, and pressurized cabin humidity regulation systems."
          icon={<FlaskConical size={20} strokeWidth={1.5} />}
          isActive={activeCategory === 'life-support'}
          onSelect={handleSelect}
        />
        <ModeCard 
          id="propulsion"
          protoId="PRT_PR-404"
          title="Propulsion Logs"
          description="Hypergolic fuel/oxidizer mixing ratios, ignition timing sequences, and nozzle combustion instability metrics."
          icon={<PlaneTakeoff size={20} strokeWidth={1.5} />}
          isActive={activeCategory === 'propulsion'}
          onSelect={handleSelect}
        />
        <ModeCard 
          id="quantum"
          protoId="PRT_QM-505"
          title="Quantum Relays"
          description="Interstellar phase-shift keying logs, entanglement relay synchronization, and deep-space decoherence mitigation."
          icon={<Radio size={20} strokeWidth={1.5} />}
          isActive={activeCategory === 'quantum'}
          onSelect={handleSelect}
        />
        <ModeCard 
          id="cryogenics"
          protoId="PRT_CY-606"
          title="Cryo-Storage"
          description="Zero-boil-off tankage telemetry, superfluid helium distribution systems, and absolute-zero Kelvin cryostat logs."
          icon={<Snowflake size={20} strokeWidth={1.5} />}
          isActive={activeCategory === 'cryogenics'}
          onSelect={handleSelect}
        />
        <ModeCard 
          id="orbital"
          protoId="PRT_OM-707"
          title="Orbital Mechanics"
          description="Hohmann transfer trajectory calculations, orbital eccentricity measurements, and Delta-V burn vector injection logs."
          icon={<Orbit size={20} strokeWidth={1.5} />}
          isActive={activeCategory === 'orbital'}
          onSelect={handleSelect}
        />
        <ModeCard 
          id="robotics"
          protoId="PRT_RB-808"
          title="Robotics Interface"
          description="Haptic feedback loop calibration, kinematics for manipulator arm dexterity, and servomechanism actuator telemetry."
          icon={<Bot size={20} strokeWidth={1.5} />}
          isActive={activeCategory === 'robotics'}
          onSelect={handleSelect}
        />
        <ModeCard 
          id="navigation"
          protoId="PRT_NV-909"
          title="Inertial Navigation"
          description="Dead reckoning vectors, celestial triangulation bias corrections, and gyroscope drift compensation parameters."
          icon={<Compass size={20} strokeWidth={1.5} />}
          isActive={activeCategory === 'navigation'}
          onSelect={handleSelect}
        />
      </div>

      <div className="pt-8 flex justify-center">
        <button 
          onClick={() => navigate('/test')}
          className="px-12 py-4 bg-[var(--fg)] text-[var(--bg)] text-xs uppercase tracking-[0.4em] hover:bg-[var(--accent)] hover:text-white transition-all font-bold border border-[var(--fg)] hover:border-[var(--accent)]"
        >
          Initialize Selected Protocol
        </button>
      </div>
    </div>
  );
};

export default Modes;
