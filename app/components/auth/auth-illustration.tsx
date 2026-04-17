type AuthIllustrationProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthIllustration({ mode }: AuthIllustrationProps) {
  const primaryBubble = mode === "sign-in" ? "Inbox" : "List a card";
  const secondaryBubble = mode === "sign-in" ? "Reply fast" : "Start selling";

  return (
    <svg viewBox="0 0 520 420" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="ptc-auth-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d8f7df" />
          <stop offset="100%" stopColor="#f2fcf3" />
        </linearGradient>
      </defs>

      <circle cx="260" cy="194" r="136" fill="url(#ptc-auth-glow)" />
      <circle
        cx="260"
        cy="194"
        r="146"
        fill="none"
        stroke="#c3efcb"
        strokeWidth="10"
      />

      <g
        fill="none"
        stroke="#1f2937"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      >
        <path d="M84 352h354" opacity="0.45" />

        <path d="M138 320l-16 32h52l-14-32z" fill="#1f2937" opacity="0.08" />
        <path d="M146 352h36" />
        <path d="M154 320v-30" />
        <path d="M154 302c-14-10-20-25-18-43" stroke="#6aac7b" />
        <path d="M154 302c8-16 20-28 36-34" stroke="#6aac7b" />
        <path d="M154 286c-10-7-16-18-16-31" stroke="#6aac7b" />

        <circle cx="166" cy="110" r="22" opacity="0.5" />
        <path d="M166 96v15l10 5" opacity="0.5" />

        <circle cx="370" cy="122" r="18" opacity="0.5" />
        <path d="M365 113l9 9-9 9" opacity="0.5" />

        <rect x="154" y="170" width="104" height="134" rx="10" fill="#ffffff" />
        <rect
          x="178"
          y="187"
          width="56"
          height="6"
          rx="3"
          fill="#1f2937"
          opacity="0.82"
          stroke="none"
        />
        <rect
          x="178"
          y="202"
          width="48"
          height="4"
          rx="2"
          fill="#94a3b8"
          stroke="none"
        />
        <rect
          x="178"
          y="220"
          width="56"
          height="6"
          rx="3"
          fill="#1f2937"
          opacity="0.82"
          stroke="none"
        />
        <rect
          x="178"
          y="235"
          width="44"
          height="4"
          rx="2"
          fill="#94a3b8"
          stroke="none"
        />
        <rect
          x="178"
          y="257"
          width="18"
          height="18"
          rx="4"
          fill="#dbfce7"
          stroke="#6aac7b"
        />
        <rect
          x="204"
          y="257"
          width="18"
          height="18"
          rx="4"
          fill="#dbfce7"
          stroke="#6aac7b"
        />
        <rect
          x="230"
          y="257"
          width="18"
          height="18"
          rx="4"
          fill="#dbfce7"
          stroke="#6aac7b"
        />

        <rect x="130" y="195" width="80" height="110" rx="10" fill="#ffffff" opacity="0.92" />
        <rect x="332" y="146" width="74" height="50" rx="12" fill="#ffffff" />
        <path d="M350 171h38" />
        <path d="M350 182h26" />
        <path d="M381 196l11 10 9-10" fill="#ffffff" />

        <path d="M296 246l11 76" />
        <path d="M342 244l-12 78" />
        <path
          d="M281 210c0-35 21-57 39-57s39 22 39 57v13h-78z"
          fill="#ffffff"
        />
        <circle cx="320" cy="148" r="24" fill="#ffffff" />
        <path d="M307 143c7-10 21-11 29 0" />
        <path d="M298 176c15 7 29 7 44 0" stroke="#6aac7b" />
        <path d="M284 223h72" />
        <rect
          x="311"
          y="223"
          width="18"
          height="22"
          rx="5"
          fill="#6fd08c"
          stroke="#6aac7b"
        />

        <rect
          x="346"
          y="286"
          width="52"
          height="49"
          rx="10"
          fill="#9fe1af"
          stroke="#6aac7b"
        />
        <path d="M353 301h38" />
        <path d="M372 286v-10" />
        <path d="M359 318l13 10 13-10" />

        <path d="M438 186l16 8-16 8z" opacity="0.42" />
        <path d="M389 258l10 10-10 10" opacity="0.4" />
        <path d="M206 90l12-16" opacity="0.38" />
        <path d="M325 88l11 12" opacity="0.38" />
      </g>

      <g>
        <circle cx="404" cy="84" r="28" fill="#ffffff" opacity="0.96" />
        <path
          d="M393 84h22M404 73v22"
          stroke="#6aac7b"
          strokeLinecap="round"
          strokeWidth="2.8"
        />
      </g>

      <g>
        <rect x="86" y="84" width="52" height="52" rx="16" fill="#ffffff" opacity="0.96" />
        <path
          d="M101 110h22M112 99v22"
          stroke="#6aac7b"
          strokeLinecap="round"
          strokeWidth="2.8"
        />
      </g>

      <g>
        <rect x="350" y="232" width="88" height="40" rx="18" fill="#ffffff" />
        <text
          x="394"
          y="257"
          fill="#1f2937"
          fontFamily="sans-serif"
          fontSize="16"
          textAnchor="middle"
        >
          {primaryBubble}
        </text>
      </g>

      <g>
        <rect x="102" y="142" width="96" height="40" rx="18" fill="#ffffff" />
        <text
          x="150"
          y="167"
          fill="#1f2937"
          fontFamily="sans-serif"
          fontSize="16"
          textAnchor="middle"
        >
          {secondaryBubble}
        </text>
      </g>
    </svg>
  );
}
