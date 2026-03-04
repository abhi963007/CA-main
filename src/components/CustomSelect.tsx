import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
    label: string;
    value: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    className = '',
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className={`relative ${className}`}>

            {/* ── Trigger button ── */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`
          flex w-full items-center justify-between gap-2 rounded-lg border
          bg-slate-50 py-2.5 pl-3.5 pr-3 text-sm outline-none transition-all
          ${open
                        ? 'border-primary bg-white shadow-sm ring-2 ring-primary/15'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-white'
                    }
        `}
            >
                <span className={selected ? 'text-slate-800 font-medium truncate' : 'text-slate-400 truncate'}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown
                    className={`
            w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-150
            ${open ? 'rotate-180' : ''}
          `}
                />
            </button>

            {/* ── Dropdown panel ── */}
            {open && (
                <div className="
          absolute z-50 left-0 mt-1 w-full min-w-max
          rounded-xl border border-slate-200 bg-white
          shadow-lg shadow-slate-200/80 overflow-hidden
          animate-in fade-in slide-in-from-top-1 duration-100
        ">
                    <div className="py-1">
                        {/* Options */}
                        {options.map((opt) => {
                            const isActive = value === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    className={`
                    flex w-full items-center justify-between whitespace-nowrap
                    px-3 py-2.5 text-sm transition-colors text-left
                    ${isActive
                                            ? 'bg-primary/5 text-primary font-semibold'
                                            : 'text-slate-700 hover:bg-slate-50 font-normal'
                                        }
                  `}
                                >
                                    {opt.label}
                                    {isActive && <Check className="ml-4 w-3.5 h-3.5 text-primary flex-shrink-0" />}
                                </button>
                            );
                        })}

                        {/* Clear option — only show if something is selected */}
                        {value && (
                            <>
                                <div className="my-1 mx-3 h-px bg-slate-100" />
                                <button
                                    type="button"
                                    onClick={() => { onChange(''); setOpen(false); }}
                                    className="flex w-full items-center whitespace-nowrap px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Clear selection
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
