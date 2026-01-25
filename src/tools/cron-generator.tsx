"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToolConfig } from "@/types/tool";

const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString());
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString());
const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];
const DAYS_OF_WEEK = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const PRESETS = [
  { label: "Every minute", expression: "* * * * *" },
  { label: "Every hour", expression: "0 * * * *" },
  { label: "Every day at midnight", expression: "0 0 * * *" },
  { label: "Every day at noon", expression: "0 12 * * *" },
  { label: "Every Monday at 9 AM", expression: "0 9 * * 1" },
  { label: "Every weekday at 9 AM", expression: "0 9 * * 1-5" },
  { label: "Every 5 minutes", expression: "*/5 * * * *" },
  { label: "Every 15 minutes", expression: "*/15 * * * *" },
  { label: "Every 30 minutes", expression: "*/30 * * * *" },
  { label: "First day of every month", expression: "0 0 1 * *" },
];

function describeCron(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression";

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  const describeField = (value: string, unit: string, values?: { value: string; label: string }[]): string => {
    if (value === "*") return `every ${unit}`;
    if (value.startsWith("*/")) return `every ${value.slice(2)} ${unit}s`;
    if (value.includes(",")) return `${unit}s ${value}`;
    if (value.includes("-")) return `${unit}s ${value}`;
    if (values) {
      const match = values.find((v) => v.value === value);
      return match ? match.label : value;
    }
    return value;
  };

  const parts_desc: string[] = [];

  // Minute
  if (minute === "*") {
    parts_desc.push("every minute");
  } else if (minute.startsWith("*/")) {
    parts_desc.push(`every ${minute.slice(2)} minutes`);
  } else {
    parts_desc.push(`at minute ${minute}`);
  }

  // Hour
  if (hour !== "*") {
    if (hour.startsWith("*/")) {
      parts_desc.push(`every ${hour.slice(2)} hours`);
    } else {
      const hourNum = parseInt(hour);
      const ampm = hourNum >= 12 ? "PM" : "AM";
      const hour12 = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
      parts_desc.push(`at ${hour12}:${minute.padStart(2, "0")} ${ampm}`);
    }
  }

  // Day of month
  if (dayOfMonth !== "*") {
    if (dayOfMonth.startsWith("*/")) {
      parts_desc.push(`every ${dayOfMonth.slice(2)} days`);
    } else {
      parts_desc.push(`on day ${dayOfMonth} of the month`);
    }
  }

  // Month
  if (month !== "*") {
    const monthMatch = MONTHS.find((m) => m.value === month);
    if (monthMatch) {
      parts_desc.push(`in ${monthMatch.label}`);
    } else {
      parts_desc.push(`in month ${month}`);
    }
  }

  // Day of week
  if (dayOfWeek !== "*") {
    if (dayOfWeek === "1-5") {
      parts_desc.push("on weekdays");
    } else if (dayOfWeek === "0,6") {
      parts_desc.push("on weekends");
    } else {
      const dayMatch = DAYS_OF_WEEK.find((d) => d.value === dayOfWeek);
      if (dayMatch) {
        parts_desc.push(`on ${dayMatch.label}`);
      } else {
        parts_desc.push(`on day ${dayOfWeek} of the week`);
      }
    }
  }

  return parts_desc.join(", ").replace(/^./, (c) => c.toUpperCase());
}

export function CronGeneratorTool() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const [expression, setExpression] = useState("* * * * *");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const expr = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setExpression(expr);
    setDescription(describeCron(expr));
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const applyPreset = (expr: string) => {
    const parts = expr.split(" ");
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    }
  };

  const handleReset = () => {
    setMinute("*");
    setHour("*");
    setDayOfMonth("*");
    setMonth("*");
    setDayOfWeek("*");
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <Label className="mb-2 block text-sm">Quick Presets</Label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.slice(0, 6).map((preset) => (
            <Button
              key={preset.expression}
              variant="secondary"
              size="sm"
              onClick={() => applyPreset(preset.expression)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <Label className="mb-2 block text-sm">Minute</Label>
          <select
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="flex h-11 w-full rounded-[var(--radius-12)] bg-[var(--color-gray-0)] px-4 text-sm text-[var(--color-gray-950)] border border-[var(--color-gray-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue-500)]/20 focus-visible:border-[var(--color-blue-500)]"
          >
            <option value="*">Every (*)</option>
            <option value="*/5">Every 5 (*/5)</option>
            <option value="*/10">Every 10 (*/10)</option>
            <option value="*/15">Every 15 (*/15)</option>
            <option value="*/30">Every 30 (*/30)</option>
            {MINUTES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label className="mb-2 block text-sm">Hour</Label>
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="flex h-11 w-full rounded-[var(--radius-12)] bg-[var(--color-gray-0)] px-4 text-sm text-[var(--color-gray-950)] border border-[var(--color-gray-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue-500)]/20 focus-visible:border-[var(--color-blue-500)]"
          >
            <option value="*">Every (*)</option>
            <option value="*/2">Every 2 (*/2)</option>
            <option value="*/4">Every 4 (*/4)</option>
            <option value="*/6">Every 6 (*/6)</option>
            <option value="*/12">Every 12 (*/12)</option>
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h.padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label className="mb-2 block text-sm">Day of Month</Label>
          <select
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="flex h-11 w-full rounded-[var(--radius-12)] bg-[var(--color-gray-0)] px-4 text-sm text-[var(--color-gray-950)] border border-[var(--color-gray-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue-500)]/20 focus-visible:border-[var(--color-blue-500)]"
          >
            <option value="*">Every (*)</option>
            {DAYS_OF_MONTH.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label className="mb-2 block text-sm">Month</Label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="flex h-11 w-full rounded-[var(--radius-12)] bg-[var(--color-gray-0)] px-4 text-sm text-[var(--color-gray-950)] border border-[var(--color-gray-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue-500)]/20 focus-visible:border-[var(--color-blue-500)]"
          >
            <option value="*">Every (*)</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label className="mb-2 block text-sm">Day of Week</Label>
          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="flex h-11 w-full rounded-[var(--radius-12)] bg-[var(--color-gray-0)] px-4 text-sm text-[var(--color-gray-950)] border border-[var(--color-gray-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue-500)]/20 focus-visible:border-[var(--color-blue-500)]"
          >
            <option value="*">Every (*)</option>
            <option value="1-5">Weekdays (1-5)</option>
            <option value="0,6">Weekends (0,6)</option>
            {DAYS_OF_WEEK.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <Button onClick={handleReset} variant="secondary">
        Reset to Default
      </Button>

      {/* Output */}
      <div className="space-y-4">
        <Input
          label="Cron Expression"
          value={expression}
          readOnly
          showCopy
          className="font-mono text-lg bg-[var(--color-gray-0)]"
        />

        <div className="p-4 rounded-[12px] bg-[var(--color-blue-50)] border border-[var(--color-blue-200)]">
          <Label className="block text-sm text-[var(--color-blue-700)] mb-1">Human-Readable Description</Label>
          <p className="text-[var(--color-blue-900)] font-medium">{description}</p>
        </div>
      </div>

      {/* Format Reference */}
      <div className="p-4 rounded-[12px] bg-[var(--color-gray-50)] border border-[var(--color-gray-200)]">
        <Label className="block text-sm mb-2">Cron Format Reference</Label>
        <code className="text-xs font-mono text-[var(--color-gray-600)]">
          ┌───────────── minute (0-59)<br />
          │ ┌───────────── hour (0-23)<br />
          │ │ ┌───────────── day of month (1-31)<br />
          │ │ │ ┌───────────── month (1-12)<br />
          │ │ │ │ ┌───────────── day of week (0-6, Sun-Sat)<br />
          │ │ │ │ │<br />
          * * * * *
        </code>
      </div>
    </div>
  );
}

export const cronGeneratorConfig: ToolConfig = {
  id: "cron-generator",
  name: "Cron Expression Generator",
  description: "Build and understand cron expressions visually",
  category: "generators",
  component: CronGeneratorTool,
  seo: {
    keywords: [
      "cron generator",
      "cron expression builder",
      "cron maker",
      "crontab generator",
      "cron schedule",
      "cron job generator",
      "cron expression creator",
      "cron syntax",
      "schedule generator",
      "cron helper",
      "crontab builder",
      "cron job scheduler",
    ],
  },
  sections: [
    {
      title: "What is a Cron Expression?",
      content:
        "A cron expression is a string representing a schedule for running tasks at specific times. It consists of five fields: minute, hour, day of month, month, and day of week. Cron expressions are widely used in Unix-like systems, CI/CD pipelines, and scheduled job systems.",
    },
    {
      title: "How does it work?",
      content: (
        <>
          <h4 className="text-base font-semibold mb-2">Cron Fields</h4>
          <ul className="list-disc list-inside space-y-1 text-sm mb-4">
            <li><strong>Minute:</strong> 0-59</li>
            <li><strong>Hour:</strong> 0-23</li>
            <li><strong>Day of Month:</strong> 1-31</li>
            <li><strong>Month:</strong> 1-12</li>
            <li><strong>Day of Week:</strong> 0-6 (Sunday to Saturday)</li>
          </ul>

          <h4 className="text-base font-semibold mb-2">Special Characters</h4>
          <ul className="list-disc list-inside space-y-1 text-sm mb-4">
            <li><strong>*</strong> - Any value (every)</li>
            <li><strong>*/n</strong> - Every n units (e.g., */5 = every 5 minutes)</li>
            <li><strong>n-m</strong> - Range (e.g., 1-5 = Monday to Friday)</li>
            <li><strong>n,m</strong> - List (e.g., 0,6 = Sunday and Saturday)</li>
          </ul>
        </>
      ),
    },
  ],
  examples: [
    {
      title: "Every day at midnight",
      content: "0 0 * * *",
      type: "code",
    },
    {
      title: "Every Monday at 9 AM",
      content: "0 9 * * 1",
      type: "code",
    },
    {
      title: "Every 15 minutes",
      content: "*/15 * * * *",
      type: "code",
    },
    {
      title: "First day of every month at noon",
      content: "0 12 1 * *",
      type: "code",
    },
  ],
  codeSnippet: `// Cron expression parser and descriptor

interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

function parseCron(expression: string): CronParts | null {
  const parts = expression.trim().split(/\\s+/);
  if (parts.length !== 5) return null;

  return {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4]
  };
}

function describeCron(expression: string): string {
  const parts = parseCron(expression);
  if (!parts) return 'Invalid cron expression';

  const descriptions: string[] = [];

  // Minute
  if (parts.minute === '*') {
    descriptions.push('every minute');
  } else if (parts.minute.startsWith('*/')) {
    descriptions.push(\`every \${parts.minute.slice(2)} minutes\`);
  } else {
    descriptions.push(\`at minute \${parts.minute}\`);
  }

  // Hour
  if (parts.hour !== '*') {
    if (parts.hour.startsWith('*/')) {
      descriptions.push(\`every \${parts.hour.slice(2)} hours\`);
    } else {
      const hour = parseInt(parts.hour);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      descriptions.push(\`at \${hour12} \${ampm}\`);
    }
  }

  return descriptions.join(', ');
}

// Example usage
const expressions = [
  '* * * * *',      // Every minute
  '0 * * * *',      // Every hour
  '0 0 * * *',      // Every day at midnight
  '0 9 * * 1',      // Every Monday at 9 AM
  '*/15 * * * *',   // Every 15 minutes
  '0 12 1 * *'      // First day of month at noon
];

expressions.forEach(expr => {
  console.log(\`\${expr} => \${describeCron(expr)}\`);
});

// Output:
// * * * * * => every minute
// 0 * * * * => at minute 0
// 0 0 * * * => at minute 0, at 12 AM
// 0 9 * * 1 => at minute 0, at 9 AM
// */15 * * * * => every 15 minutes
// 0 12 1 * * => at minute 0, at 12 PM`,
  references: [
    {
      title: "Crontab.guru - Cron Expression Editor",
      url: "https://crontab.guru/",
    },
    {
      title: "Wikipedia - Cron",
      url: "https://en.wikipedia.org/wiki/Cron",
    },
  ],
};
