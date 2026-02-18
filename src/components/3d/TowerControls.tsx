import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { TowerParams } from './TwistingTowers';

interface Props {
  params: TowerParams;
  onChange: (p: TowerParams) => void;
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '1px solid hsl(0 0% 15%)', borderRadius: 8, marginBottom: 8, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold tracking-wider uppercase"
        style={{ background: 'hsl(0 0% 8%)', color: 'hsl(180 60% 70%)' }}
      >
        {title}
        <ChevronDown size={12} style={{ transform: open ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && <div className="p-3 space-y-3">{children}</div>}
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, onChange }: {
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
          style={{ background: 'hsl(160 80% 45% / 0.1)', color: 'hsl(160 80% 55%)', border: '1px solid hsl(160 80% 45% / 0.2)' }}>
          {step < 1 ? value.toFixed(1) : value}
        </span>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px]" style={{ color: 'hsl(0 0% 75%)' }}>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className="w-8 h-[18px] rounded-full relative transition-colors"
        style={{ background: checked ? 'hsl(160 80% 45%)' : 'hsl(0 0% 15%)', border: '1px solid hsl(0 0% 20%)' }}
      >
        <div className="absolute w-3 h-3 bg-white rounded-full top-[2px] transition-transform"
          style={{ left: 2, transform: checked ? 'translateX(14px)' : 'translateX(0)' }} />
      </button>
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

const PRESETS: Record<string, Partial<TowerParams>> = {
  default: { numTowers: 3, height: 350, twist: 2, layers: 30, baseSize: 50, topSize: 20, taperStart: 30, spacing: 130, arrayType: 'linear', opacity: 1, roughness: 0.25, metalness: 0.6, towerFaces: [6, 8, 18], baseColor: '#ff6b35', topColor: '#4ecdc4', bgColor: '#080c14', showSlabs: true, showBracing: false, showCols: false },
  shanghai: { numTowers: 5, height: 480, twist: 1.5, layers: 40, baseSize: 60, topSize: 10, taperStart: 20, spacing: 160, arrayType: 'linear', opacity: 1, roughness: 0.15, metalness: 0.75, towerFaces: [8, 8, 8, 8, 8], baseColor: '#c0392b', topColor: '#e74c3c', bgColor: '#0a0508', showSlabs: true, showBracing: true, showCols: true },
  torch: { numTowers: 1, height: 550, twist: 3, layers: 50, baseSize: 55, topSize: 8, taperStart: 10, spacing: 130, arrayType: 'linear', opacity: 1, roughness: 0.1, metalness: 0.85, towerFaces: [6], baseColor: '#e67e22', topColor: '#f39c12', bgColor: '#060408', showSlabs: true, showBracing: false, showCols: false },
  crystal: { numTowers: 7, height: 300, twist: 2.5, layers: 25, baseSize: 35, topSize: 5, taperStart: 0, spacing: 110, arrayType: 'circular', opacity: 0.7, roughness: 0.05, metalness: 0.9, towerFaces: [3, 4, 5, 6, 7, 8, 9], baseColor: '#74b9ff', topColor: '#a29bfe', bgColor: '#030310', showSlabs: false, showBracing: false, showCols: false },
  brutalist: { numTowers: 9, height: 250, twist: 0.5, layers: 20, baseSize: 65, topSize: 55, taperStart: 0, spacing: 140, arrayType: 'grid', opacity: 1, roughness: 0.9, metalness: 0, towerFaces: [4, 4, 4, 4, 4, 4, 4, 4, 4], baseColor: '#636e72', topColor: '#b2bec3', bgColor: '#0d0d0d', showSlabs: true, showBracing: true, showCols: false },
  ghost: { numTowers: 5, height: 400, twist: 2, layers: 30, baseSize: 50, topSize: 15, taperStart: 25, spacing: 120, arrayType: 'circular', opacity: 0.25, roughness: 0.1, metalness: 0.95, towerFaces: [6, 8, 10, 12, 16], baseColor: '#dfe6e9', topColor: '#74b9ff', bgColor: '#020608', showSlabs: true, showBracing: false, showCols: false },
};

export default function TowerControls({ params, onChange }: Props) {
  const set = (patch: Partial<TowerParams>) => onChange({ ...params, ...patch });

  return (
    <div className="w-[280px] max-h-[70vh] overflow-y-auto rounded-xl p-3 space-y-1"
      style={{
        background: 'hsl(0 0% 4% / 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid hsl(0 0% 15%)',
      }}
      onClick={e => e.stopPropagation()}
    >
      <div className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: 'hsl(160 80% 55%)' }}>
        Tower Studio
      </div>

      <Section title="Tower Structure" defaultOpen>
        <Slider label="Towers" value={params.numTowers} min={1} max={10} onChange={v => set({ numTowers: Math.round(v) })} />
        <Slider label="Height" value={params.height} min={100} max={600} onChange={v => set({ height: v })} />
        <Slider label="Twist (rad×π)" value={params.twist} min={0} max={4} step={0.05} onChange={v => set({ twist: v })} />
        <Slider label="Layers" value={params.layers} min={8} max={60} onChange={v => set({ layers: Math.round(v) })} />
        <Slider label="Base Radius" value={params.baseSize} min={20} max={100} onChange={v => set({ baseSize: v })} />
        <Slider label="Top Radius" value={params.topSize} min={5} max={60} onChange={v => set({ topSize: v })} />
        <Slider label="Taper Start %" value={params.taperStart} min={0} max={80} onChange={v => set({ taperStart: v })} />
      </Section>

      <Section title="Array Config">
        <SelectControl label="Arrangement" value={params.arrayType}
          options={[{ value: 'linear', label: 'Linear' }, { value: 'circular', label: 'Circular' }, { value: 'spiral', label: 'Spiral' }, { value: 'grid', label: 'Grid' }]}
          onChange={v => set({ arrayType: v as TowerParams['arrayType'] })} />
        <Slider label="Spacing" value={params.spacing} min={60} max={400} onChange={v => set({ spacing: v })} />
        {params.arrayType === 'spiral' && (
          <>
            <Slider label="Spiral Turns" value={params.spiralTurns} min={0.5} max={4} step={0.1} onChange={v => set({ spiralTurns: v })} />
            <Slider label="Height Step" value={params.verticalOffset} min={0} max={120} onChange={v => set({ verticalOffset: v })} />
          </>
        )}
      </Section>

      <Section title="Materials">
        <Slider label="Opacity %" value={Math.round(params.opacity * 100)} min={10} max={100} onChange={v => set({ opacity: v / 100 })} />
        <Slider label="Roughness %" value={Math.round(params.roughness * 100)} min={0} max={100} onChange={v => set({ roughness: v / 100 })} />
        <Slider label="Metalness %" value={Math.round(params.metalness * 100)} min={0} max={100} onChange={v => set({ metalness: v / 100 })} />
        <Toggle label="Wireframe" checked={params.wireframe} onChange={v => set({ wireframe: v })} />
        <Toggle label="Edge Lines" checked={params.edgeLines} onChange={v => set({ edgeLines: v })} />
      </Section>

      <Section title="Structural">
        <Toggle label="Floor Slabs" checked={params.showSlabs} onChange={v => set({ showSlabs: v })} />
        <Slider label="Slab Every N" value={params.slabFreq} min={1} max={6} onChange={v => set({ slabFreq: Math.round(v) })} />
        <Toggle label="Plinth" checked={params.showPlinth} onChange={v => set({ showPlinth: v })} />
        <Toggle label="X-Bracing" checked={params.showBracing} onChange={v => set({ showBracing: v })} />
        <Toggle label="Columns" checked={params.showCols} onChange={v => set({ showCols: v })} />
        <Toggle label="Ground" checked={params.showGround} onChange={v => set({ showGround: v })} />
      </Section>

      <Section title="Camera & Scene">
        <Toggle label="Auto Rotate" checked={params.autoRotate} onChange={v => set({ autoRotate: v })} />
        <Slider label="Rotate Speed" value={params.rotSpeed} min={0} max={30} onChange={v => set({ rotSpeed: v })} />
        <Slider label="Env. Lighting %" value={Math.round(params.envLight * 100)} min={0} max={100} onChange={v => set({ envLight: v / 100 })} />
        <Slider label="Fog Density" value={params.fogDensity} min={0} max={50} onChange={v => set({ fogDensity: Math.round(v) })} />
      </Section>

      <Section title="Presets">
        <div className="grid grid-cols-2 gap-1.5">
          {Object.keys(PRESETS).map(name => (
            <button key={name} onClick={() => set(PRESETS[name])}
              className="px-2 py-1.5 rounded text-[10px] font-medium tracking-wide uppercase transition-colors"
              style={{
                background: name === 'default' ? 'hsl(160 80% 45% / 0.15)' : 'hsl(0 0% 8%)',
                border: `1px solid ${name === 'default' ? 'hsl(160 80% 45% / 0.3)' : 'hsl(0 0% 15%)'}`,
                color: name === 'default' ? 'hsl(160 80% 55%)' : 'hsl(0 0% 70%)',
              }}>
              {name}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
