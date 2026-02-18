import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import * as THREE from 'three';
import type { OceanParams } from './HolographicOcean';

interface Props {
  params: OceanParams;
  onChange: (p: OceanParams) => void;
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '1px solid hsl(0 0% 15%)', borderRadius: 8, marginBottom: 8, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold tracking-wider uppercase"
        style={{ background: 'hsl(0 0% 8%)', color: 'hsl(180 100% 50%)' }}
      >
        {title}
        <ChevronDown size={12} style={{ transform: open ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && <div className="p-3 space-y-3">{children}</div>}
    </div>
  );
}

function Slider({ label, value, min, max, step = 0.01, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px]" style={{ color: 'hsl(0 0% 75%)' }}>{label}</span>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="w-[100px] h-[3px] appearance-none rounded cursor-pointer"
          style={{ background: 'hsl(0 0% 15%)' }}
        />
        <span className="min-w-[36px] text-center text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: 'hsl(180 100% 50% / 0.1)', color: 'hsl(180 100% 60%)', border: '1px solid hsl(180 100% 50% / 0.2)' }}>
          {step >= 1 ? Math.round(value) : value.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function SelectControl({ label, value, options, onChange }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px]" style={{ color: 'hsl(0 0% 75%)' }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="text-[11px] px-2 py-1 rounded cursor-pointer outline-none"
        style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(0 0% 20%)', color: '#fff' }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px]" style={{ color: 'hsl(0 0% 75%)' }}>{label}</span>
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        className="w-6 h-6 rounded cursor-pointer border-0 p-0" style={{ background: 'transparent' }} />
    </div>
  );
}

export default function OceanControls({ params, onChange }: Props) {
  const set = (patch: Partial<OceanParams>) => onChange({ ...params, ...patch });

  const randomize = () => {
    const primaryHue = Math.random();
    const secHue = (primaryHue + 0.5) % 1;
    const c1 = new THREE.Color().setHSL(primaryHue, 1.0, 0.6);
    const c2 = new THREE.Color().setHSL(secHue, 0.8, 0.2);

    set({
      gravity: 5 + Math.random() * 30,
      pressure: 2 + Math.random() * 10,
      repulsionStrength: 1 + Math.random() * 10,
      damping: 0.94 + Math.random() * 0.05,
      fillLevel: -4 + Math.random() * 6,
      waveHeight: Math.random() * 3.5,
      waveSpeed: 0.2 + Math.random() * 3.0,
      waveFreq: 0.2 + Math.random() * 1.0,
      colorSurface: '#' + c1.getHexString(),
      colorDeep: '#' + c2.getHexString(),
    });
  };

  const applyPreset = (mode: 'Dark' | 'Light') => {
    if (mode === 'Light') {
      set({
        blendMode: 'Normal',
        backgroundColor: '#f0f8ff',
        colorSurface: '#0055aa',
        colorDeep: '#000033',
      });
    } else {
      set({
        blendMode: 'Additive',
        backgroundColor: '#010103',
        colorSurface: '#b3ffff',
        colorDeep: '#001133',
      });
    }
  };

  return (
    <div className="w-[280px] max-h-[70vh] overflow-y-auto rounded-xl p-3 space-y-1"
      style={{
        background: 'hsl(0 0% 4% / 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid hsl(0 0% 15%)',
      }}
      onClick={e => e.stopPropagation()}
    >
      <div className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: 'hsl(180 100% 50%)' }}>
        HOLO CORE
      </div>

      <Section title="Fluid Physics" defaultOpen>
        <Slider label="Gravity G" value={params.gravity} min={1} max={40} step={0.5} onChange={v => set({ gravity: v })} />
        <Slider label="Buoyancy" value={params.pressure} min={1} max={20} step={0.5} onChange={v => set({ pressure: v })} />
        <Slider label="Stacking Pressure" value={params.repulsionStrength} min={0} max={20} step={0.5} onChange={v => set({ repulsionStrength: v })} />
        <Slider label="Air Resistance" value={params.damping} min={0.90} max={0.999} step={0.001} onChange={v => set({ damping: v })} />
        <Slider label="Water Level" value={params.fillLevel} min={-5} max={5} step={0.1} onChange={v => set({ fillLevel: v })} />
        <Slider label="Turbulence" value={params.turbulence} min={0} max={3} step={0.1} onChange={v => set({ turbulence: v })} />
      </Section>

      <Section title="Wave Dynamics">
        <Slider label="Amplitude" value={params.waveHeight} min={0} max={4} step={0.1} onChange={v => set({ waveHeight: v })} />
        <Slider label="Speed" value={params.waveSpeed} min={0} max={4} step={0.1} onChange={v => set({ waveSpeed: v })} />
        <Slider label="Frequency" value={params.waveFreq} min={0.1} max={1.5} step={0.05} onChange={v => set({ waveFreq: v })} />
      </Section>

      <Section title="Hologram Visuals">
        <div className="flex gap-1.5 mb-2">
          <button onClick={() => applyPreset('Dark')}
            className="flex-1 px-2 py-1.5 rounded text-[10px] font-medium uppercase"
            style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 20%)', color: 'hsl(180 100% 60%)' }}>
            Dark
          </button>
          <button onClick={() => applyPreset('Light')}
            className="flex-1 px-2 py-1.5 rounded text-[10px] font-medium uppercase"
            style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 20%)', color: 'hsl(0 0% 70%)' }}>
            Light
          </button>
        </div>
        <SelectControl label="Blend Mode" value={params.blendMode}
          options={[{ value: 'Additive', label: 'Additive' }, { value: 'Normal', label: 'Normal' }]}
          onChange={v => set({ blendMode: v as OceanParams['blendMode'] })} />
        <ColorPicker label="Background" value={params.backgroundColor} onChange={v => set({ backgroundColor: v })} />
        <ColorPicker label="Foam Color" value={params.colorSurface} onChange={v => set({ colorSurface: v })} />
        <ColorPicker label="Deep Color" value={params.colorDeep} onChange={v => set({ colorDeep: v })} />
        <Slider label="Particle Size" value={params.particleSize} min={0.05} max={1.0} step={0.01} onChange={v => set({ particleSize: v })} />
      </Section>

      <Section title="Post-Processing">
        <Slider label="Bloom Strength" value={params.bloomStrength} min={0} max={3} step={0.05} onChange={v => set({ bloomStrength: v })} />
        <Slider label="Bloom Radius" value={params.bloomRadius} min={0} max={1} step={0.05} onChange={v => set({ bloomRadius: v })} />
        <Slider label="Bloom Threshold" value={params.bloomThreshold} min={0} max={1} step={0.01} onChange={v => set({ bloomThreshold: v })} />
      </Section>

      <Section title="Actions">
        <button onClick={randomize}
          className="w-full px-3 py-2 rounded text-[11px] font-bold tracking-wider uppercase transition-colors"
          style={{ background: 'hsl(180 100% 50% / 0.15)', border: '1px solid hsl(180 100% 50% / 0.3)', color: 'hsl(180 100% 60%)' }}>
          🎲 Randomize
        </button>
      </Section>
    </div>
  );
}
