/** Labelled text/email/password input with consistent styling. */
export default function FormField({ id, label, type = 'text', value, onChange, required, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-widest text-stone-400"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
      />
    </div>
  );
}
