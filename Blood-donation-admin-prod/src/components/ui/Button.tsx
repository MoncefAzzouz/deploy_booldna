import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: string;
  type?: "submit" | "reset" | "button";
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
};

export default function Button({
  children,
  type = "button",
  className,
  onClick,
  title,
  variant = "primary",
}: Props) {
  const baseStyles = "relative px-6 py-3 rounded-xl font-bold transition-all duration-300 transform active:scale-95 shadow-lg flex items-center justify-center gap-2 overflow-hidden group";

  const variants = {
    primary: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5",
    secondary: "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 border border-slate-700/50 hover:bg-slate-700 dark:hover:bg-white",
    outline: "border-2 border-red-500 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950/20"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
      <span className="relative z-10">{children ?? title}</span>
    </button>
  );
}
