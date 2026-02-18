import { useState } from 'react';
import type { PavilionParams } from './ParametricPavilion';

interface SliderDef {
  key: keyof PavilionParams;
  label: string;
  min: number;
  max: number;
  step: number;
  folder: string;
}

const sliders: SliderDef[] = [
  // Grid Layout
  { key: 'brickCountX', label: 'Columns (X)', min: 10, max: 150, step: 1, folder: 'Grid Layout' },
  { key: 'brickCountY', label: 'Rows (Y)', min: 5, max: 80, step: 1, folder: 'Grid Layout' },
  { key: 'spacing', label: 'Joint Spacing', min: 0, max: 0.1, step: 0.001, folder: 'Grid Layout' },
  // Brick Dimensions
  { key: 'brickWidth', label: 'Width', min: 0.1, max: 2.0, step: 0.01, folder: 'Brick Dimensions' },
  { key: 'brickHeight', label: 'Height', min: 0.1, max: 2.0, step: 0.01, folder: 'Brick Dimensions' },
  { key: 'brickDepth', label: 'Depth (Tube)', min: 0.1, max: 2.0, step: 0.01, folder: 'Brick Dimensions' },
  { key: 'brickThickness', label: 'Thickness', min: 0.01, max: 0.2, step: 0.001, folder: 'Brick Dimensions' },
  // Void Shape
  { key: 'cavityWidth', label: 'Void Width', min: 0, max: 30, step: 0.1, folder: 'Void Shape' },
  { key: 'voidSpread', label: 'Void Spread', min: 1, max: 20, step: 0.1, folder: 'Void Shape' },
  { key: 'voidTaper', label: 'Vertical Taper', min: 0.1, max: 10, step: 0.1, folder: 'Void Shape' },
  { key: 'voidOffset', label: 'Center Offset', min: -20, max: 20, step: 0.1, folder: 'Void Shape' },
  // Atmosphere
  { key: 'timeOfDay', label: 'Time of Day', min: 6, max: 20, step: 0.1, folder: 'Atmosphere' },
  { key: 'ambientLight', label: 'Ambient Light', min: 0, max: 2, step: 0.05, folder: 'Atmosphere' },
  // Animation
  { key: 'speed', label: 'Cycle Speed', min: 0.1, max: 5, step: 0.1, folder: 'Animation' },
];

interface PavilionControlsProps {
  params: PavilionParams;
  onChange: (params: PavilionParams) => void;
}

export default function PavilionControls({ params, onChange }: PavilionControlsProps) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    'Grid Layout': false,
    'Brick Dimensions': false,
    'Void Shape': true,
    'Atmosphere': true,
    'Animation': true,
  });

  const updateColor = (key: keyof PavilionParams, value: string) => {
    onChange({ ...params, [key]: value });
  };

  const toggleFolder = (name: string) => {
    setOpenFolders(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const folders = [...new Set(sliders.map(s => s.folder))];

  const update = (key: keyof PavilionParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div
      className="w-72 max-h-[calc(100vh-48px)] overflow-y-auto rounded-xl p-1"
      style={{
        backgroundColor: 'hsl(0 0% 0% / 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid hsl(0 0% 15%)',
      }}
    >
      <div className="px-3 py-2.5 border-b" style={{ borderColor: 'hsl(0 0% 15%)' }}>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'hsl(45 100% 60%)' }}>
          Pavilion Control
        </span>
      </div>

      {folders.map(folder => (
        <div key={folder}>
          <button
            onClick={() => toggleFolder(folder)}
            className="w-full flex items-center justify-between px-3 py-2 text-left"
            style={{ borderBottom: '1px solid hsl(0 0% 10%)' }}
          >
            <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'hsl(0 0% 60%)' }}>
              {folder}
            </span>
            <span className="text-[10px]" style={{ color: 'hsl(0 0% 40%)' }}>
              {openFolders[folder] ? '▾' : '▸'}
            </span>
          </button>

          {openFolders[folder] && (
            <div className="px-3 py-2 space-y-3">
              {sliders.filter(s => s.folder === folder).map(s => (
                <div key={s.key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px]" style={{ color: 'hsl(0 0% 50%)' }}>{s.label}</label>
                    <span className="text-[10px] font-mono" style={{ color: 'hsl(45 100% 60% / 0.7)' }}>
                      {Number(params[s.key]).toFixed(s.step < 0.01 ? 3 : s.step < 1 ? 1 : 0)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={params[s.key] as number}
                    onChange={e => update(s.key, parseFloat(e.target.value))}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(90deg, hsl(45 100% 60%) ${((params[s.key] as number - s.min) / (s.max - s.min)) * 100}%, hsl(0 0% 20%) ${((params[s.key] as number - s.min) / (s.max - s.min)) * 100}%)`,
                    }}
                  />
                </div>
              ))}

              {folder === 'Atmosphere' && (
                <div className="flex items-center justify-between">
                  <label className="text-[10px]" style={{ color: 'hsl(0 0% 50%)' }}>Background</label>
                  <input
                    type="color"
                    value={params.bgColor}
                    onChange={e => updateColor('bgColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                    style={{ background: 'transparent' }}
                  />
                </div>
              )}

              {folder === 'Animation' && (
                <div className="flex items-center justify-between">
                  <label className="text-[10px]" style={{ color: 'hsl(0 0% 50%)' }}>Auto Cycle</label>
                  <button
                    onClick={() => onChange({ ...params, animate: !params.animate })}
                    className="w-8 h-4 rounded-full relative transition-colors duration-200"
                    style={{
                      backgroundColor: params.animate ? 'hsl(45 100% 60%)' : 'hsl(0 0% 20%)',
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full absolute top-0.5 transition-all duration-200"
                      style={{
                        backgroundColor: 'hsl(0 0% 100%)',
                        left: params.animate ? '17px' : '2px',
                      }}
                    />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
