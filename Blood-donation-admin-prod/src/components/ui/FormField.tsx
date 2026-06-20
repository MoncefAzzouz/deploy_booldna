import { type ChangeEvent, type JSX } from "react";
import { FiChevronDown, FiPlus, FiMinus } from "react-icons/fi";

type Props = {
  icon: JSX.Element;
  name: string;
  value: string;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password";
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNumberChange?: (value: number) => void;
  as?: "input" | "select";
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  label?: string;
};

export default function FormInput({ icon, name, value, placeholder, type = "text", onChange, onNumberChange, as = "input", options = [], min = 0, max, step = 1, error, label }: Props) {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && (
        <label className="ml-5 mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}

      <div className="flex w-full items-center relative group">
        <div
          className={`
            relative flex w-full items-center rounded-2xl mx-4 border transition-all duration-300
            ${error
              ? "border-red-400 bg-red-50/50 dark:bg-red-900/10"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus-within:border-red-500 dark:focus-within:border-red-400 shadow-sm focus-within:shadow-md focus-within:shadow-red-500/10"}
          `}
        >
          <div className={`p-3.5 transition-colors duration-300 ${error ? "text-red-500" : "text-slate-400 group-focus-within:text-red-500"}`}>
            {icon}
          </div>

          {as === "input" && type !== "number" && (
            <input
              name={name}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="flex-1 bg-transparent px-2 py-3.5 outline-none focus-visible:outline-none
                         placeholder-slate-400 text-sm font-medium text-slate-700 dark:text-slate-200"
            />
          )}

          {as === "input" && type === "number" && (
            <div className="relative flex items-center w-full">
              <input
                name={name}
                type="number"
                value={value}
                onChange={(e) =>
                  onNumberChange && onNumberChange(Number(e.target.value))
                }
                min={min}
                max={max}
                className="flex-1 pr-16 bg-transparent text-slate-700 dark:text-slate-200 outline-none text-sm font-medium
                   [appearance:textfield]
                   [&::-webkit-outer-spin-button]:appearance-none
                   [&::-webkit-inner-spin-button]:appearance-none
                   px-2 py-3.5"
              />

              <div className="absolute right-4 flex flex-row gap-2">
                <button
                  type="button"
                  aria-label={`Increase ${name}`}
                  onClick={() =>
                    onNumberChange &&
                    onNumberChange(
                      Math.min(Number(value) + step, max ?? Infinity)
                    )
                  }
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <FiPlus className="text-xs" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={`Decrease ${name}`}
                  onClick={() =>
                    onNumberChange &&
                    onNumberChange(Math.max(Number(value) - step, min))
                  }
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <FiMinus className="text-xs" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {as === "select" && (
            <>
              <select
                name={name}
                value={value}
                onChange={onChange}
                className="flex-1 appearance-none bg-transparent px-2 py-3.5
                           outline-none text-sm font-medium text-slate-700 dark:text-slate-200 pr-10 cursor-pointer"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800">
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="absolute right-4 pointer-events-none text-slate-400 group-focus-within:text-red-500 transition-colors">
                <FiChevronDown />
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-6 mt-1 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500" />
          {error}
        </span>
      )}
    </div>
  );
}
