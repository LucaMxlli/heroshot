import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const UploadIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </Base>
)

export const DownloadIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 4v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M4 20h16" />
  </Base>
)

export const UndoIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 9h11a5 5 0 0 1 0 10H8" />
    <path d="m8 5-4 4 4 4" />
  </Base>
)

export const RedoIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M20 9H9a5 5 0 0 0 0 10h7" />
    <path d="m16 5 4 4-4 4" />
  </Base>
)

export const ResetIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </Base>
)

export const LaptopIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="4" y="5" width="16" height="11" rx="2" />
    <path d="M2 19h20" />
  </Base>
)

export const PhoneIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.6" />
    <path d="M11 5.6h2" />
  </Base>
)

export const DisplayIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
    <path d="M12 16.5V20M8.5 20h7" />
  </Base>
)

export const ImacIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
    <path d="M12 16.5V20M8 20h8" />
    <path d="M2.5 13.5h19" />
  </Base>
)

export const WatchIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="7" y="6" width="10" height="12" rx="3.4" />
    <path d="M9 6V3.5h6V6M9 18v2.5h6V18M18.4 10v2.4" />
  </Base>
)

export const BookmarkIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M6 3.5h12v17l-6-4.2-6 4.2v-17Z" />
  </Base>
)

export const ImportIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 15V3" />
    <path d="m7 10 5 5 5-5" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </Base>
)

export const CloseIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Base>
)

export const KeyboardIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <path d="M7 10h.01M11 10h.01M15 10h.01M8 14h8" />
  </Base>
)

export const SlidersIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </Base>
)

export const ChevronIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="m6 9 6 6 6-6" />
  </Base>
)

export const CheckIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="m4 12 5 5L20 6" />
  </Base>
)

export const ImageIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <circle cx="8.5" cy="9.5" r="1.5" />
    <path d="m4 17 5-5 4 4 3-2 4 3" />
  </Base>
)

export const TrashIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </Base>
)

export const SunIcon = (props: IconProps) => (
  <Base {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Base>
)

export const LayersIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 14 9 5 9-5" />
  </Base>
)

export const SparkIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    <path d="m6.5 6.5 2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" />
  </Base>
)

export const PanelIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M9.5 4v16" />
  </Base>
)
