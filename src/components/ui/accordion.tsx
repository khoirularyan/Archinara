import * as React from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  header: React.ReactNode;
  content: React.ReactNode;
};

export function Accordion({
  items,
  type = "single",
  className,
}: {
  items: AccordionItem[];
  type?: "single" | "multiple";
  className?: string;
}) {
  const [openIds, setOpenIds] = React.useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (type === "single") return isOpen ? [] : [id];
      return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((it) => {
        const isOpen = openIds.includes(it.id);
        return (
          <div key={it.id} className={cn("rounded-xl ring-1 ring-slate-200 bg-white shadow-sm overflow-hidden")}> 
            <button
              type="button"
              onClick={() => toggle(it.id)}
              className={cn(
                "w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              )}
            >
              <div className="text-lg font-semibold text-navy">{it.header}</div>
              <svg
                className={cn("w-5 h-5 text-navy transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={cn(
                "px-6 transition-[grid-template-rows] duration-300",
                isOpen ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-4 text-gray-600">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
