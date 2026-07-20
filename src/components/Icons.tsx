// Simple SVG vector icons to replace emoji usage
// Each icon is 1em × 1em, inherits currentColor

function IconWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} style={{ width: '1.2em', height: '1.2em', verticalAlign: 'middle' }}>
      {children}
    </span>
  );
}

export function AtomIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-60 12 12)" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    </IconWrapper>
  );
}

export function MicroscopeIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h6l2 5H4z" />
        <circle cx="9" cy="14" r="5" />
        <path d="M9 9v10" />
        <path d="M4 22h10" />
        <circle cx="9" cy="14" r="1.5" fill="currentColor" />
      </svg>
    </IconWrapper>
  );
}

export function TargetIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    </IconWrapper>
  );
}

export function LeafIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19C5 19 10 8 21 3C18 14 10 19 5 19Z" />
        <path d="M5 19V12" />
      </svg>
    </IconWrapper>
  );
}

export function GlobeIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <ellipse cx="12" cy="12" rx="5" ry="10" />
        <path d="M2 12h20" />
      </svg>
    </IconWrapper>
  );
}

export function ClipboardIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      </svg>
    </IconWrapper>
  );
}

export function PalmTreeIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12" />
        <path d="M12 12C8 8 4 10 4 10C4 10 6 5 12 4C18 5 20 10 20 10C20 10 16 8 12 12Z" />
        <path d="M12 4C10 1 8 2 8 2C8 2 10 4 12 7C14 4 16 2 16 2C16 2 14 1 12 4Z" />
      </svg>
    </IconWrapper>
  );
}

export function FishIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12C20 12 17 6 12 6C6 6 4 12 4 12C4 12 6 18 12 18C17 18 20 12 20 12Z" />
        <circle cx="14" cy="12" r="1" fill="currentColor" />
        <path d="M18 6L21 3M18 10L22 8" />
      </svg>
    </IconWrapper>
  );
}

export function DnaIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M6 2C6 2 14 8 14 12C14 16 6 22 6 22" />
        <path d="M18 2C18 2 10 8 10 12C10 16 18 22 18 22" />
        <path d="M4 6h16M4 18h16" />
      </svg>
    </IconWrapper>
  );
}

export function PackageIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12L3 7l9-5 9 5-9 5z" />
        <path d="M3 7v10l9 5 9-5V7" />
        <path d="M12 12v10" />
      </svg>
    </IconWrapper>
  );
}

export function FlaskIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6" />
        <path d="M10 3v6.5L4 20h16L14 9.5V3" />
        <circle cx="10" cy="16" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="13" cy="18" r="1" fill="currentColor" opacity="0.4" />
      </svg>
    </IconWrapper>
  );
}

export function SyringeIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20L17 7" />
        <path d="M7 4l4 4" />
        <path d="M17 7l3 3-4 4-3-3" />
        <path d="M10 10L7 13" />
        <path d="M3 22l4-4" />
      </svg>
    </IconWrapper>
  );
}

export function HospitalIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="18" rx="2" />
        <path d="M9 10h6M12 7v6" />
        <circle cx="12" cy="16" r="0.5" fill="currentColor" />
      </svg>
    </IconWrapper>
  );
}

export function LightningIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h7l-3 8 13-12h-7l4-8z" />
      </svg>
    </IconWrapper>
  );
}

export function RockIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 18L3 14l4-2 2 4z" />
        <path d="M11 18l5-8 4 3-4 5z" />
        <path d="M8 13l5-4 3 5z" />
      </svg>
    </IconWrapper>
  );
}

export function ChartIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="14" width="4" height="6" rx="1" />
        <rect x="10" y="8" width="4" height="12" rx="1" />
        <rect x="17" y="4" width="4" height="16" rx="1" />
      </svg>
    </IconWrapper>
  );
}

export function VRIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="9" height="12" rx="3" />
        <rect x="13" y="6" width="9" height="12" rx="3" />
        <path d="M11 12h2" />
      </svg>
    </IconWrapper>
  );
}

export function ScaleIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v4H3z" />
        <path d="M12 7v14" />
        <path d="M5 21h14" />
        <circle cx="8" cy="14" r="3" />
        <circle cx="16" cy="12" r="5" />
      </svg>
    </IconWrapper>
  );
}

export function PartyIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
      </svg>
    </IconWrapper>
  );
}

export function BookIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v18H4z" />
        <path d="M8 2v20" />
        <path d="M4 7h16M4 11h16M4 15h16M4 19h16" />
      </svg>
    </IconWrapper>
  );
}

export function FireIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C8 22 5 19 5 15C5 9 12 2 12 2C12 2 19 9 19 15C19 19 16 22 12 22Z" />
        <path d="M12 18C10.5 18 9.5 17 9.5 15C9.5 12 12 9 12 9C12 9 14.5 12 14.5 15C14.5 17 13.5 18 12 18Z" fill="currentColor" opacity="0.3" />
      </svg>
    </IconWrapper>
  );
}

export function MouseIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="3" width="10" height="18" rx="5" />
        <path d="M12 7v4" />
        <rect x="9" y="3" width="6" height="3" rx="1.5" />
      </svg>
    </IconWrapper>
  );
}

export function ShieldIcon({ className }: { className?: string }) {
  return (
    <IconWrapper className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 7v5c0 4.5 3.5 9 9 11 5.5-2 9-6.5 9-11V7l-9-5z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </IconWrapper>
  );
}
