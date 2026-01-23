import { TextareaHTMLAttributes, forwardRef, useState } from "react";
import { clsx } from "clsx";
import { MdContentCopy, MdCheck } from "react-icons/md";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  showCopy?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, showCopy, value, onBlur, onChange, ...props }, ref) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      if (value) {
        await navigator.clipboard.writeText(String(value));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      const trimmedValue = e.target.value.trim();
      if (trimmedValue !== e.target.value && onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: trimmedValue },
          currentTarget: { ...e.currentTarget, value: trimmedValue },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(syntheticEvent);
      }
      onBlur?.(e);
    };

    const hasCopyButton = showCopy && value;

    const textareaElement = (
      <div className="relative w-full">
        <textarea
          className={clsx(
            "flex min-h-[100px] w-full rounded-[var(--radius-12)] bg-[var(--color-gray-0)] px-4 py-3 text-sm text-[var(--color-gray-950)]",
            "border border-[var(--color-gray-200)]",
            "placeholder:text-[var(--color-gray-400)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue-500)]/20 focus-visible:border-[var(--color-blue-500)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "font-mono resize-y break-all overflow-x-auto",
            hasCopyButton && "pr-12",
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          {...props}
        />
        {hasCopyButton && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-2 w-8 h-8 rounded-full bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] hover:bg-[var(--color-gray-50)] flex items-center justify-center transition-colors cursor-pointer"
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
              <MdCheck style={{ width: 16, height: 16, color: 'var(--color-green-500)' }} />
            ) : (
              <MdContentCopy style={{ width: 16, height: 16 }} />
            )}
          </button>
        )}
      </div>
    );

    if (!label) {
      return textareaElement;
    }

    return (
      <div className="w-full">
        {label && <label className="text-sm mb-2 block">{label}</label>}
        {textareaElement}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
