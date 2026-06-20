

type Props = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

export default function CheckboxItem({ label, checked, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[90%] pointer-events-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-red-600 focus:ring-red-400 pointer-events-auto"
      />
      {label}
    </label>
  );
}
