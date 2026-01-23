import { InputHTMLAttributes, forwardRef, useId } from "react";
import { clsx } from "clsx";
import { MdCheck } from "react-icons/md";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, checked, onChange, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    const checkboxElement = (
      <div className="relative inline-flex">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={onChange}
          className={clsx(
            "peer h-5 w-5 cursor-pointer appearance-none rounded-[var(--radius-6)] bg-[var(--color-gray-0)]",
            "border border-[var(--color-gray-300)]",
            "checked:bg-[var(--color-blue-500)] checked:border-[var(--color-blue-500)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue-500)]/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            className
          )}
          ref={ref}
          {...props}
        />
        <MdCheck className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
      </div>
    );

    if (!label) {
      return checkboxElement;
    }

    return (
      <div className="flex items-center gap-2">
        {checkboxElement}
        <label
          htmlFor={checkboxId}
          className="text-sm cursor-pointer select-none"
        >
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
