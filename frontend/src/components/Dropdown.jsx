import React, { useState, useRef, useEffect } from "react";

export default function Dropdown({
  options = [],
  value,
  onChange,
  width = "80px",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`} style={{ width }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-1 px-2 py-1.5 border rounded-md text-sm bg-white border-gray-300 hover:bg-gray-50"
      >
        <span>{current?.label ?? value}</span>
        <span className="text-gray-500">▼</span>
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${opt.value === value ? "bg-green-50 text-green-800" : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
