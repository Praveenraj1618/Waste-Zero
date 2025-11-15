import { Leaf, Recycle } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-primary rounded-lg rotate-45"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Leaf className="w-6 h-6 text-white z-10" fill="currentColor" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-primary leading-none">WasteZero</span>
        <span className="text-xs text-muted-foreground leading-none">Green Future</span>
      </div>
    </div>
  );
}

export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-10 h-10 ${className}`}>
      <div className="absolute inset-0 bg-primary rounded-lg rotate-45"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Leaf className="w-6 h-6 text-white z-10" fill="currentColor" />
      </div>
    </div>
  );
}
