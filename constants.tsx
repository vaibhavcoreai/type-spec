
import React from 'react';

export const KEYBOARD_SCHEMATIC = (
  <svg viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <filter id="technicalGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Global Calibration Grid */}
    <g className="opacity-15" stroke="currentColor" strokeWidth="0.5">
      {Array.from({ length: 23 }).map((_, i) => (
        <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="250" />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`h-${i}`} x1="0" y1={i * 20} x2="450" y2={i * 20} />
      ))}
    </g>

    {/* Technical HUD Overlay */}
    <g className="text-[7px] font-mono fill-current opacity-60 uppercase tracking-widest">
      <text x="10" y="20">SYS_AUTH: [GRANTED]</text>
      <text x="10" y="32">PROTO: MEC_INPUT_V4</text>
      <text x="360" y="20" textAnchor="end">LATENCY: 0.2ms</text>
      <text x="360" y="32" textAnchor="end">BUFFER: NOMINAL</text>
      
      {/* Corner Brackets */}
      <path d="M5 5 L25 5 M5 5 L5 25" stroke="currentColor" strokeWidth="0.75" />
      <path d="M445 5 L425 5 M445 5 L445 25" stroke="currentColor" strokeWidth="0.75" />
      <path d="M5 245 L25 245 M5 245 L5 225" stroke="currentColor" strokeWidth="0.75" />
      <path d="M445 245 L425 245 M445 245 L445 225" stroke="currentColor" strokeWidth="0.75" />
    </g>

    {/* Exploded ISO Projection Lines */}
    <g stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" className="opacity-30">
      <path d="M100 80 L60 40" />
      <path d="M350 80 L390 40" />
      <circle cx="60" cy="40" r="1.5" />
      <circle cx="390" cy="40" r="1.5" />
    </g>

    {/* Isometric Key Array */}
    <g transform="translate(45, 60)" filter="url(#technicalGlow)">
      {Array.from({ length: 4 }).map((_, rowIndex) => (
        <g key={rowIndex} transform={`translate(${rowIndex * 8}, ${rowIndex * 28})`}>
          {Array.from({ length: 11 - (rowIndex === 3 ? 10 : 0) }).map((_, colIndex) => {
            const x = colIndex * 32;
            const delay = (rowIndex + colIndex) * 0.1;
            const isSpace = rowIndex === 3;
            const width = isSpace ? 180 : 26;
            const finalX = isSpace ? 60 : x;
            
            return (
              <g key={colIndex} className="animate-isometric-float" style={{ animationDelay: `${delay}s` }}>
                {/* Lower "housing" wireframe */}
                <rect x={finalX} y="0" width={width} height="20" rx="1" stroke="currentColor" strokeWidth="0.4" className="opacity-20" />
                {/* Floating Cap */}
                <rect 
                  x={finalX} 
                  y="-4" 
                  width={width} 
                  height="20" 
                  rx="1" 
                  stroke="currentColor" 
                  strokeWidth="1.2" 
                  fill="currentColor"
                  fillOpacity="0.12"
                  className="opacity-80" 
                />
                {/* Detail marks */}
                <line x1={finalX + 4} y1="4" x2={finalX + 8} y2="4" stroke="currentColor" strokeWidth="1" className="opacity-40" />
              </g>
            );
          })}
        </g>
      ))}
    </g>

    {/* Dimension Markers */}
    <g className="opacity-40" stroke="currentColor" strokeWidth="0.75">
      <line x1="45" y1="200" x2="405" y2="200" />
      <line x1="45" y1="195" x2="45" y2="205" />
      <line x1="405" y1="195" x2="405" y2="205" />
      <text x="225" y="215" textAnchor="middle" className="text-[6px] fill-current uppercase tracking-widest font-mono">X_DIM: 360.00mm</text>
    </g>

    <style>{`
      @keyframes isometric-float {
        0%, 100% { transform: translate(0, 0); opacity: 0.6; }
        50% { transform: translate(1px, -4px); opacity: 1; }
      }
      .animate-isometric-float {
        animation: isometric-float 5s infinite ease-in-out;
      }
    `}</style>
  </svg>
);

export const TECHNICAL_DICTIONARY: Record<string, string[]> = {
  avionics: ["bus", "controller", "redundant", "telemetry", "atomic", "signal", "synchronization", "logic", "architecture", "distributed", "sensor", "calibration", "avionics", "frequency", "bandwidth", "interface", "protocol"],
  thermal: ["heat", "shield", "composite", "reentry", "atmospheric", "protection", "thermal", "integrity", "inspection", "structural", "insulation", "radiation", "ablation", "convection", "conduction", "equilibrium", "gradient"],
  "life-support": ["oxygen", "scrubber", "regenerative", "cycle", "carbon", "dioxide", "sensor", "infrared", "calibrated", "atmosphere", "pressure", "cabin", "humidity", "filtration", "potable", "biomedical", "nitrogen"],
  propulsion: ["hypergolic", "fuel", "ignition", "nozzle", "combustion", "instability", "primary", "thrust", "vectoring", "propellant", "oxidizer", "cryogenic", "tankage", "manifold", "pressure", "turbopump", "exhaust"],
  quantum: ["entanglement", "relay", "coherent", "communication", "probe", "orbital", "phase", "shift", "keying", "quantum", "encryption", "decoherence", "superposition", "qubit", "teleportation", "interstellar", "nanosecond"],
  cryogenics: ["liquid", "hydrogen", "helium", "superfluid", "thermal", "isolation", "vacuum", "jacketed", "dewar", "boil-off", "sublimation", "cryostat", "kelvin", "absolute", "zero", "refrigeration", "cooling"],
  orbital: ["apogee", "perigee", "inclination", "eccentricity", "hohmann", "transfer", "trajectory", "delta-v", "burn", "rendezvous", "docking", "ballistic", "gravity", "assist", "injection", "insertion", "geostationary"],
  robotics: ["actuator", "effector", "kinematics", "manipulator", "autonomy", "heuristic", "algorithm", "optical", "lidar", "ultrasonic", "haptic", "servomechanism", "feedback", "loop", "torque", "encoder", "chassis"],
  navigation: ["sextant", "inertial", "gyroscope", "accelerometer", "dead", "reckoning", "celestial", "coordinates", "azimuth", "elevation", "doppler", "triangulation", "ranging", "waypoint", "vector", "magnitude", "orientation"]
};

export const PUNCTUATION = [".", ",", ";", ":", "!", "?", "-", "_", "/", "(", ")", "[", "]", "{", "}"];
export const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const TECHNICAL_TEXTS = [
  "The avionics system utilizes a distributed architecture with triple-redundant bus controllers.",
  "Thermal protection tiles must be inspected for micro-fractures following atmospheric reentry.",
  "Oxygen scrubbers in the life support module operate on a chemical regenerative cycle.",
  "The propulsion sequence requires a precise mix of hypergolic fuels.",
  "Quantum entanglement relays facilitate near-instantaneous communication between deep space probes."
];
