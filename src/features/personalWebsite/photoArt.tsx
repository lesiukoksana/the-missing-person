import type { ReactNode } from 'react';
import type { OwlFrame } from '../../data/website/photos';

/** Eleanor's photographs, drawn as SVG scenes. Film treatment is added in website.css. */

function Scene({ children, viewBox = '0 0 800 600' }: { children: ReactNode; viewBox?: string }) {
  return (
    <svg
      className="photo-art__svg"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function WeirBridge() {
  return (
    <Scene>
      <defs>
        <linearGradient id="wb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8c9aa3" />
          <stop offset="1" stopColor="#e3d2b0" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#wb-sky)" />
      <path d="M0 250 Q150 215 320 245 T800 225 V340 H0Z" fill="#5d6459" />
      <rect y="330" width="800" height="270" fill="#94988e" />
      <path d="M0 345H800M0 372H800M0 415H800" stroke="#c9c6b3" strokeWidth="2" opacity="0.5" />
      <path
        d="M120 330 V235 H680 V330 H590 C590 265 490 265 490 330 H310 C310 265 210 265 210 330Z"
        fill="#4c4a44"
      />
      <path d="M120 235 H680 V222 H120Z" fill="#37362f" />
      <path d="M0 500 H800 V530 H0Z" fill="#6c6f66" />
      <path d="M0 520 H800" stroke="#e8e5d3" strokeWidth="5" strokeDasharray="30 12" opacity="0.65" />
    </Scene>
  );
}

function YellowHouse() {
  const windows = [
    [340, 170],
    [340, 290],
    [450, 290],
    [450, 410],
  ];
  return (
    <Scene>
      <rect width="800" height="600" fill="#a9ada5" />
      <rect x="50" y="170" width="240" height="430" fill="#6e6b64" />
      <rect x="560" y="190" width="240" height="410" fill="#77736a" />
      <g transform="rotate(-1 420 350)">
        <path d="M275 130 L420 40 L575 130Z" fill="#3f3b36" />
        <rect x="290" y="130" width="270" height="480" fill="#c6a951" />
        <rect x="290" y="130" width="270" height="480" fill="#6a5a2c" opacity="0.15" />
        {windows.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="62" height="82" fill="#2b2d2e" />
            <path d={`M${x + 31} ${y}V${y + 82}M${x} ${y + 41}H${x + 62}`} stroke="#d8d3c2" strokeWidth="4" />
          </g>
        ))}
        <rect x="335" y="425" width="72" height="175" fill="#4a2b28" />
        <text x="371" y="470" fontSize="20" textAnchor="middle" fill="#d6c893">14</text>
        <path d="M545 130 V600" stroke="#4d4d48" strokeWidth="6" />
      </g>
      <rect y="572" width="800" height="28" fill="#3b3a36" />
    </Scene>
  );
}

function MillRoad() {
  const rows = [150, 215, 280, 345, 410];
  const columns = Array.from({ length: 11 }, (_, index) => 200 + index * 52);
  return (
    <Scene>
      <rect width="800" height="600" fill="#a7a69d" />
      <rect x="110" y="60" width="44" height="400" fill="#3c3631" />
      <rect x="170" y="125" width="630" height="345" fill="#4f4640" />
      <path d="M170 125 L280 90 L800 90 V125Z" fill="#2f2c28" />
      {rows.flatMap((y) =>
        columns.map((x, index) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="30" height="42" fill={(index + y) % 7 === 0 ? '#7f7d75' : '#1d1c1a'} />
        )),
      )}
      <rect y="470" width="800" height="130" fill="#57564f" />
      <rect y="462" width="800" height="16" fill="#3b3833" />
      <path d="M0 545 H800" stroke="#a5a498" strokeWidth="3" strokeDasharray="40 30" />
      <g>
        <rect x="70" y="382" width="52" height="128" fill="#6a2b2c" />
        <rect x="78" y="396" width="36" height="72" fill="#c9c8ba" />
        <path d="M78 420H114M78 444H114M96 396V468" stroke="#6a2b2c" strokeWidth="3" />
      </g>
    </Scene>
  );
}

function WheelHouse() {
  return (
    <Scene>
      <defs>
        <linearGradient id="wh-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e7dfc4" stopOpacity="0.8" />
          <stop offset="1" stopColor="#e7dfc4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="#2a2926" />
      <path d="M0 0H800V280H0Z" fill="#3a3833" />
      {Array.from({ length: 9 }, (_, row) => (
        <path key={row} d={`M0 ${row * 32}H800`} stroke="#2a2926" strokeWidth="2" />
      ))}
      <path d="M120 0 L260 0 L470 560 L250 560Z" fill="url(#wh-light)" />
      <rect y="470" width="800" height="130" fill="#0b0c0d" />
      <path d="M180 505H320M380 525H560M250 555H430" stroke="#5a6062" strokeWidth="2" opacity="0.7" />
      <path d="M0 240H530" stroke="#5a4633" strokeWidth="20" />
      <path d="M530 240 L780 262" stroke="#2c2219" strokeWidth="20" />
      <path d="M0 190H530" stroke="#50402f" strokeWidth="5" />
      <path d="M530 190 L780 205" stroke="#2c2219" strokeWidth="5" />
      {[60, 170, 280, 390, 500].map((x) => (
        <path key={x} d={`M${x} 190V240M${x} 250V470`} stroke="#463726" strokeWidth={x % 3 ? 6 : 8} />
      ))}
      <path d="M620 251 L600 470" stroke="#241c14" strokeWidth="7" />
      <path d="M340 480 H470 V535 C470 500 340 500 340 535Z" fill="#191918" />
      <path d="M340 535 C340 500 470 500 470 535" stroke="#3a3833" strokeWidth="5" fill="none" />
    </Scene>
  );
}

function Pellets() {
  const pellets = [
    [250, 310, 48, 24, -12],
    [370, 335, 56, 25, 8],
    [490, 300, 42, 21, 24],
    [420, 265, 36, 18, -18],
  ];
  return (
    <Scene>
      <rect width="800" height="600" fill="#3a2f25" />
      <rect y="150" width="800" height="330" fill="#7a6248" />
      {[190, 240, 305, 365, 410, 450].map((y) => (
        <path key={y} d={`M0 ${y} Q400 ${y + 16} 800 ${y - 6}`} stroke="#5b4835" strokeWidth="2" fill="none" />
      ))}
      {pellets.map(([x, y, rx, ry, angle]) => (
        <g key={`${x}-${y}`} transform={`rotate(${angle} ${x} ${y})`}>
          <ellipse cx={x} cy={y + 8} rx={rx} ry={ry} fill="#2e251c" opacity="0.6" />
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#23201c" />
          <path d={`M${x - rx / 2} ${y - 5}l18 8M${x} ${y - 10}l12 12`} stroke="#a79f8f" strokeWidth="2" />
        </g>
      ))}
      <circle cx="610" cy="370" r="30" fill="#8d8373" />
      <circle cx="610" cy="370" r="24" fill="none" stroke="#6c6355" strokeWidth="2" />
    </Scene>
  );
}

function BlueHour() {
  return (
    <Scene>
      <rect width="800" height="600" fill="#11212e" />
      <path d="M0 0H800V330L700 330V160H470V100H240V240H0Z" fill="#1c2f3e" />
      <path d="M0 240H240V100H470V160H700V330H800V380H0Z" fill="#0a151e" />
      {[260, 320, 380, 440].map((x) => (
        <rect key={x} x={x} y="150" width="30" height="50" fill="#1c2f3e" />
      ))}
      <rect y="380" width="800" height="220" fill="#274050" />
      <path d="M0 455H800M0 520H800" stroke="#1d3342" strokeWidth="3" />
      <path d="M430 395 L240 520 L700 520 L442 395Z" fill="#a9c6d4" opacity="0.2" />
      <g>
        <ellipse cx="404" cy="282" rx="13" ry="16" fill="#061018" />
        <path d="M384 306 Q404 288 424 306 L440 480 L370 480Z" fill="#061018" />
        <path d="M418 330 L444 382" stroke="#061018" strokeWidth="11" />
        <circle cx="446" cy="388" r="8" fill="#e8f3f4" />
        <circle cx="446" cy="388" r="20" fill="#e8f3f4" opacity="0.25" />
      </g>
      <g>
        <path d="M34 490 L60 435 H200 L240 475 L258 487 V522 H34Z" fill="#071019" />
        <rect x="70" y="445" width="50" height="30" fill="#1a2d3b" />
        <rect x="130" y="445" width="62" height="30" fill="#1a2d3b" />
        <circle cx="86" cy="526" r="18" fill="#02060a" />
        <circle cx="216" cy="526" r="18" fill="#02060a" />
        <circle cx="252" cy="498" r="8" fill="#dbeaf0" />
        <rect x="122" y="502" width="62" height="15" fill="#b9cdd6" />
        <text x="153" y="514" fontSize="11" fontFamily="monospace" fontWeight="700" textAnchor="middle" fill="#061018">
          FX09 R
        </text>
      </g>
    </Scene>
  );
}

export function BonfireScene({ uncropped = false }: { uncropped?: boolean }) {
  return (
    <Scene viewBox={uncropped ? '0 0 800 600' : '330 130 450 338'}>
      <rect width="800" height="600" fill="#0e0d10" />
      <circle cx="560" cy="350" r="240" fill="#6e2f1d" opacity="0.3" />
      <path d="M430 520 Q470 300 540 260 Q545 180 590 120 Q610 210 650 260 Q720 340 720 520Z" fill="#b65c22" />
      <path d="M480 520 Q510 370 565 310 Q590 240 610 230 Q625 320 660 370 Q690 440 680 520Z" fill="#dc9c3c" />
      <path d="M430 520 L730 480 M450 480 L740 530" stroke="#16100c" strokeWidth="15" />
      <rect y="515" width="800" height="85" fill="#121011" />
      <g fill="#060507">
        <ellipse cx="430" cy="312" rx="26" ry="31" />
        <path d="M392 355 Q430 335 468 355 L480 600 H382Z" />
      </g>
      <g fill="#060507">
        <ellipse cx="205" cy="270" rx="29" ry="33" />
        <path d="M160 320 Q205 300 250 320 L268 600 H145Z" />
        <path d="M245 335 L338 262 L350 278 L262 368Z" />
        <path d="M338 262 l18 -14 l6 10 l-12 18Z" />
      </g>
    </Scene>
  );
}

function LoftAfterwards() {
  const rafters = [95, 180, 255, 345, 430, 520, 590, 680];
  return (
    <Scene>
      <rect width="800" height="600" fill="#c9c9bc" />
      <rect y="440" width="800" height="160" fill="#26221f" />
      <path d="M0 440 V340 L40 390 L85 310 L90 440 H200 L220 370 L270 440 H480 L510 330 L560 440 H800V370 L750 400 L730 440Z" fill="#26221f" />
      {rafters.map((x, index) => (
        <path
          key={x}
          d={`M${x} 440 L${x + (index % 2 ? 28 : -16)} ${130 + (index * 47) % 180}`}
          stroke="#16130f"
          strokeWidth={index % 3 ? 11 : 15}
        />
      ))}
      <path d="M80 190 L330 240 M300 215 L620 210 M540 240 L760 170" stroke="#16130f" strokeWidth="9" />
    </Scene>
  );
}

function HeritageDay() {
  const flags = [90, 165, 240, 315, 390, 465, 540, 615, 690];
  return (
    <Scene>
      <rect width="800" height="600" fill="#c4d0cf" />
      <rect y="115" width="800" height="175" fill="#898a7d" />
      {[50, 180, 310, 440, 570, 700].map((x) => (
        <rect key={x} x={x} y="150" width="60" height="85" fill="#4d504c" />
      ))}
      <rect y="360" width="800" height="240" fill="#898679" />
      <path d="M20 60 Q400 150 780 60" stroke="#47443c" strokeWidth="2" fill="none" />
      {flags.map((x, index) => (
        <path
          key={x}
          d={`M${x - 16} ${72 + Math.sin((x / 800) * Math.PI) * 42} h32 l-16 34Z`}
          fill={index % 2 ? '#7b3a3b' : '#cfc8ae'}
        />
      ))}
      <g>
        <path d="M480 435 L515 362 H700 L748 410 L785 425 V480 H480Z" fill="#151d24" />
        <rect x="528" y="373" width="72" height="35" fill="#74858d" />
        <rect x="610" y="373" width="70" height="35" fill="#74858d" />
        <circle cx="540" cy="480" r="24" fill="#090b0d" />
        <circle cx="730" cy="480" r="24" fill="#090b0d" />
        <rect x="630" y="440" width="80" height="20" fill="#dbd9b6" />
        <text x="670" y="455" fontSize="14" fontFamily="monospace" fontWeight="700" textAnchor="middle" fill="#14161a">
          FX09 RDT
        </text>
      </g>
      <g>
        <rect x="60" y="300" width="430" height="175" rx="8" fill="#7b2622" />
        <rect x="350" y="240" width="145" height="115" rx="8" fill="#6d211d" />
        <rect x="372" y="258" width="98" height="68" fill="#b7c5c5" />
        <rect x="70" y="282" width="280" height="16" fill="#b0a067" />
        <path d="M70 330H330M70 360H330" stroke="#ba9b58" strokeWidth="5" />
        <circle cx="145" cy="482" r="39" fill="#101113" />
        <circle cx="145" cy="482" r="15" fill="#a68d4d" />
        <circle cx="410" cy="482" r="39" fill="#101113" />
        <circle cx="410" cy="482" r="15" fill="#a68d4d" />
      </g>
      <g fill="#29272b">
        <circle cx="210" cy="290" r="15" />
        <rect x="197" y="305" width="26" height="60" />
      </g>
    </Scene>
  );
}

function WeirInSpate() {
  return (
    <Scene>
      <rect width="800" height="600" fill="#61675f" />
      <path d="M0 190 Q200 170 400 190 T800 175 V270 H0Z" fill="#30352e" />
      <rect y="255" width="800" height="345" fill="#6d5336" />
      <path d="M0 340 C200 325 600 355 800 330 V430 C600 460 200 425 0 445Z" fill="#a39a7f" />
      {Array.from({ length: 13 }, (_, index) => (
        <path
          key={index}
          d={`M${index * 66} 335 q24 55 -2 112`}
          stroke="#d9d3b8"
          strokeWidth="5"
          fill="none"
          opacity="0.55"
        />
      ))}
      {Array.from({ length: 34 }, (_, index) => (
        <path
          key={index}
          d={`M${(index * 97) % 800} ${(index * 61) % 540} l-9 42`}
          stroke="#cfd4cb"
          strokeWidth="2"
          opacity="0.45"
        />
      ))}
    </Scene>
  );
}

export const PHOTO_ART: Record<string, () => ReactNode> = {
  'weir-bridge': WeirBridge,
  'yellow-house': YellowHouse,
  'mill-road': MillRoad,
  'wheel-house': WheelHouse,
  pellets: Pellets,
  'blue-hour': BlueHour,
  bonfire: () => <BonfireScene />,
  'loft-afterwards': LoftAfterwards,
  'heritage-day': HeritageDay,
  'weir-in-spate': WeirInSpate,
};

function Owl({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M-42 190 Q0 110 42 190 L36 320 Q0 345 -36 320Z" fill="#d6d6d1" />
      <path d="M-38 205 Q-54 250 -32 310 L-20 240Z M38 205 Q54 250 32 310 L20 240Z" fill="#8d8d88" />
      <path d="M0 196 C-16 170 -48 178 -38 214 C-30 242 -12 250 0 266 C12 250 30 242 38 214 C48 178 16 170 0 196Z" fill="#f2f2ee" />
      <circle cx="-14" cy="214" r="6" fill="#050505" />
      <circle cx="14" cy="214" r="6" fill="#050505" />
    </g>
  );
}

export function OwlFrameArt({ frame }: { frame: OwlFrame }) {
  const isHidden = frame.id === 'TE_0917';

  return (
    <Scene>
      <rect width="800" height="600" fill={isHidden ? '#1b1b1a' : '#282827'} />
      {isHidden ? (
        <>
          <rect y="370" width="800" height="230" fill="#383836" />
          <path d="M520 370 H800 V300 H600 C550 300 520 330 520 370Z" fill="#050505" />
          <path d="M0 230 H440 V370 H0Z" fill="#111110" />
          <path d="M520 370 C530 330 560 305 600 300" stroke="#55554f" strokeWidth="9" fill="none" />
          <path d="M520 440 Q430 455 270 530" stroke="#545450" strokeWidth="18" fill="none" opacity="0.7" />
          <g fill="#b9b9b3" opacity="0.8" style={{ filter: 'blur(2.5px)' }}>
            <ellipse cx="303" cy="440" rx="10" ry="13" />
            <path d="M289 458 Q303 450 317 458 L319 508 L311 548 H304 L302 515 L298 548 H291 L287 508Z" />
          </g>
        </>
      ) : (
        <>
          <rect y="40" width="800" height="150" fill="#3a3a38" />
          <path d="M0 40H800M0 76H800M0 115H800M0 152H800" stroke="#242423" strokeWidth="3" />
          <rect y="318" width="800" height="52" fill="#585854" />
          <path d="M0 332 Q400 345 800 330M0 352 Q400 340 800 355" stroke="#2f2f2d" strokeWidth="3" fill="none" />
          <path d="M60 370 H210 V600 H60Z M590 370 H740 V600 H590Z" fill="#1a1a19" />
          {frame.owlCount >= 1 && <Owl x={frame.owlX} />}
          {frame.owlCount === 2 && <Owl x={frame.owlX + 125} />}
        </>
      )}
      <rect y="566" width="800" height="34" fill="#000" />
      <text x="14" y="589" fontFamily="monospace" fontSize="17" fill="#e6e6e0">{`${frame.id}   TC-12`}</text>
      <text x="786" y="589" fontFamily="monospace" fontSize="17" textAnchor="end" fill="#e6e6e0">{frame.stamp}</text>
    </Scene>
  );
}
