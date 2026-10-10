import { geometry, regionsFor, type PartId, type Shape, type View } from './parts';
import { mix } from '../ui/theme';
import { coversHair, hasExtra, withDefaults, type BodyLook, type EquipmentId, type Headwear as HeadwearKind } from './look';

type Props = {
  look: BodyLook;
  view: View;
  selected?: ReadonlySet<PartId>;
  /** When given, the parts of the picture can be pressed. */
  onToggle?: (id: PartId) => void;
};

function ShapeEl({ shape }: { shape: Shape }) {
  return shape.k === 'e' ? (
    <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />
  ) : (
    <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.r ?? 0} />
  );
}

const OUTLINE = '#1a1a1a';
const METAL = '#9aa5b1';
const PLASTIC = '#e5e7eb';

/**
 * The chair, seen from the front: the big wheels are narrow ovals at the sides
 * (as wheels look head-on) with a push rim and spokes, then a seat, back posts
 * with handles, arm pads, a front frame down to the footplates, and two small
 * front wheels. The back of the chair is drawn behind the figure and the front
 * of it over the legs, so the child sits in it.
 */
function WheelchairBack({ frame }: { frame: string }) {
  const wheel = (cx: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy="306" rx="11" ry="64" fill="#6b7280" stroke={OUTLINE} stroke-width="3" />
      <ellipse cx={cx} cy="306" rx="6" ry="54" fill="none" stroke="#d1d5db" stroke-width="2.5" />
      {[-40, -20, 0, 20, 40].map((dy) => (
        <line key={dy} x1={cx - 5} y1={306 + dy} x2={cx + 5} y2={306 + dy * 0.9} stroke="#d1d5db" stroke-width="1.5" />
      ))}
      <circle cx={cx} cy="306" r="5" fill={OUTLINE} />
    </g>
  );
  return (
    <g stroke-linecap="round">
      {wheel(14)}
      {wheel(186)}
      <g stroke={frame} stroke-width="6" fill="none">
        <line x1="54" y1="256" x2="54" y2="118" />
        <line x1="146" y1="256" x2="146" y2="118" />
        <line x1="54" y1="118" x2="36" y2="112" />
        <line x1="146" y1="118" x2="164" y2="112" />
        <line x1="14" y1="268" x2="54" y2="268" />
        <line x1="186" y1="268" x2="146" y2="268" />
      </g>
      <rect x="26" y="106" width="16" height="9" rx="4" fill={OUTLINE} />
      <rect x="158" y="106" width="16" height="9" rx="4" fill={OUTLINE} />
    </g>
  );
}

function WheelchairFront({ frame }: { frame: string }) {
  return (
    <g stroke-linecap="round">
      {/* Seat edge across the front of the lap, and the arm pads */}
      <rect x="50" y="252" width="100" height="12" rx="6" fill="#475569" stroke={OUTLINE} stroke-width="2" />
      <rect x="38" y="188" width="22" height="9" rx="4" fill={OUTLINE} />
      <rect x="140" y="188" width="22" height="9" rx="4" fill={OUTLINE} />
      <line x1="48" y1="197" x2="52" y2="256" stroke={frame} stroke-width="5" />
      <line x1="152" y1="197" x2="148" y2="256" stroke={frame} stroke-width="5" />
      {/* Front frame, footplates and small wheels */}
      <g stroke={frame} stroke-width="6" fill="none">
        <path d="M58 264 L58 340 L78 356" />
        <path d="M142 264 L142 340 L122 356" />
      </g>
      <rect x="62" y="352" width="38" height="8" rx="3" fill="#9aa5b1" stroke={OUTLINE} stroke-width="1.5" />
      <rect x="100" y="352" width="38" height="8" rx="3" fill="#9aa5b1" stroke={OUTLINE} stroke-width="1.5" />
      <line x1="58" y1="340" x2="52" y2="384" stroke={frame} stroke-width="5" />
      <line x1="142" y1="340" x2="148" y2="384" stroke={frame} stroke-width="5" />
      <circle cx="50" cy="398" r="13" fill="#374151" stroke={OUTLINE} stroke-width="2" />
      <circle cx="150" cy="398" r="13" fill="#374151" stroke={OUTLINE} stroke-width="2" />
      <circle cx="50" cy="398" r="4" fill="#9aa5b1" />
      <circle cx="150" cy="398" r="4" fill="#9aa5b1" />
    </g>
  );
}

/**
 * A head covering, drawn over the head. The face is left clear: a hijab has an
 * opening for it, a turban sits above the forehead, and a kippah is a small
 * cap on the crown.
 */
function Headwear({ kind, colour, back }: { kind: Exclude<HeadwearKind, 'none'>; colour: string; back: boolean }) {
  const fold = { fill: 'none', stroke: OUTLINE, 'stroke-width': 1.5, 'stroke-linecap': 'round' } as const;
  if (kind === 'hijab') {
    return (
      <g>
        {back ? (
          <path d="M64 52 C60 10 140 10 136 52 C140 76 142 94 134 104 Q100 118 66 104 C58 94 60 76 64 52 Z" fill={colour} stroke={OUTLINE} stroke-width="2" />
        ) : (
          <path
            fill-rule="evenodd"
            d="M64 52 C60 10 140 10 136 52 C140 76 142 94 134 104 Q100 118 66 104 C58 94 60 76 64 52 Z M100 26 C86 26 77 38 77 52 C77 68 87 79 100 79 C113 79 123 68 123 52 C123 38 114 26 100 26 Z"
            fill={colour}
            stroke={OUTLINE}
            stroke-width="2"
          />
        )}
      </g>
    );
  }
  if (kind === 'turban') {
    return (
      <g>
        <path d="M67 46 C62 4 138 4 133 46 Q100 32 67 46 Z" fill={colour} stroke={OUTLINE} stroke-width="2" />
        <path d="M70 36 Q100 14 132 34" {...fold} />
        <path d="M68 42 Q100 20 133 40" {...fold} />
        {back && <ellipse cx="100" cy="50" rx="30" ry="14" fill={colour} stroke={OUTLINE} stroke-width="2" />}
      </g>
    );
  }
  return <path d="M79 22 A21 14 0 0 1 121 22 Q100 27 79 22 Z" fill={colour} stroke={OUTLINE} stroke-width="2" />;
}

/** A darker shade of a colour, for seams, cuffs, hems and soles. */
const shade = (colour: string, amount = 0.2): string => mix(colour, '#000000', amount);

// The head is drawn a little larger than the body's own scale, as a child's is.
// Everything on the head sits in one group scaled about the neck, and the parts
// of the head that can be pressed are scaled the same way, so the picture and
// what it points to always agree.
export const HEAD_TRANSFORM = 'translate(100 90) scale(1.2) translate(-100 -90)';

/** The hair that sits behind the head and shoulders. */
function HairBehind({ look }: { look: BodyLook }) {
  const stroke = { stroke: OUTLINE, 'stroke-width': 2, 'stroke-linejoin': 'round' } as const;
  if (coversHair(look.headwear)) return null;
  return (
    <g>
      {look.hairStyle === 'long' && (
        <g>
          <path d="M65 48 C57 76 59 104 68 126 Q100 138 132 126 C141 104 143 76 135 48 Z" fill={look.hair} />
          <path d="M65 48 C57 76 59 104 68 126 Q100 138 132 126 C141 104 143 76 135 48" fill="none" {...stroke} />
        </g>
      )}
      {look.hairStyle === 'curly' &&
        [[70, 34], [84, 18], [100, 12], [116, 18], [130, 34], [65, 54], [135, 54]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="14" fill={look.hair} {...stroke} />
        ))}
      {look.hairStyle === 'tied' && (
        <g>
          <circle cx="100" cy="6" r="12" fill={look.hair} {...stroke} />
          <rect x="91" y="13" width="18" height="5" rx="2.5" fill={shade(look.hair, 0.45)} stroke={OUTLINE} stroke-width="1.5" />
        </g>
      )}
    </g>
  );
}

/**
 * The head and face. The fringe sits well up the forehead, clear of the
 * eyebrows, so the face is open.
 */
function HeadArt({ look, back, helmet }: { look: BodyLook; back: boolean; helmet: boolean }) {
  const skin = look.skin;
  const skinShade = shade(skin, 0.22);
  const covered = coversHair(look.headwear);
  const hairy = !covered && look.hairStyle !== 'none';
  const stroke = { stroke: OUTLINE, 'stroke-width': 2, 'stroke-linejoin': 'round' } as const;
  const brow = look.hairStyle === 'none' || covered ? shade(skin, 0.5) : shade(look.hair, 0.3);
  return (
    <g>
      {/* In the back view, long hair falls over the shoulders */}
      {back && hairy && look.hairStyle === 'long' && (
        <g>
          <path d="M67 58 C60 84 62 110 70 130 Q100 142 130 130 C138 110 140 84 133 58 Q100 82 67 58 Z" fill={look.hair} />
          <path d="M67 58 C60 84 62 110 70 130 Q100 142 130 130 C138 110 140 84 133 58" fill="none" {...stroke} />
        </g>
      )}
      {/* Ears, half behind the head */}
      <ellipse cx="70" cy="53" rx="6.5" ry="9" fill={skin} {...stroke} />
      <ellipse cx="130" cy="53" rx="6.5" ry="9" fill={skin} {...stroke} />
      <path d="M68 49 q3 4 0 8 M132 49 q-3 4 0 8" fill="none" stroke={skinShade} stroke-width="1.5" stroke-linecap="round" />
      <circle cx="100" cy="50" r="30" fill={skin} {...stroke} />

      {hairy && !back && look.hairStyle !== 'curly' && (
        <path d="M69 42 C58 -2 142 -2 131 42 Q120 24 100 27 Q82 24 69 42 Z" fill={look.hair} {...stroke} />
      )}
      {hairy && !back && look.hairStyle === 'curly' &&
        [[78, 27], [89, 22], [100, 20], [111, 22], [122, 27]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" fill={look.hair} {...stroke} />
        ))}
      {hairy && back && <path d="M69 46 C56 -2 144 -2 131 46 C134 66 122 80 100 81 C78 80 66 66 69 46 Z" fill={look.hair} {...stroke} />}

      {look.headwear !== 'none' && <Headwear kind={look.headwear} colour={look.headwearColour} back={back} />}
      {helmet && (
        <g>
          <path d="M68 52 Q68 12 100 12 Q132 12 132 52 Q100 40 68 52 Z" fill="#60a5fa" stroke={OUTLINE} stroke-width="2" />
          <line x1="68" y1="52" x2="64" y2="64" stroke={OUTLINE} stroke-width="2" />
          <line x1="132" y1="52" x2="136" y2="64" stroke={OUTLINE} stroke-width="2" />
        </g>
      )}

      {!back && (
        <g>
          <circle cx="79" cy="62" r="5.5" fill="#f472b6" opacity="0.28" />
          <circle cx="121" cy="62" r="5.5" fill="#f472b6" opacity="0.28" />
          <path d="M80.5 41.5 Q88 36.5 95.5 40" fill="none" stroke={brow} stroke-width="2.6" stroke-linecap="round" />
          <path d="M104.5 40 Q112 36.5 119.5 41.5" fill="none" stroke={brow} stroke-width="2.6" stroke-linecap="round" />
          <ellipse cx="88" cy="49" rx="3.7" ry="4.6" fill={OUTLINE} />
          <ellipse cx="112" cy="49" rx="3.7" ry="4.6" fill={OUTLINE} />
          <circle cx="89.3" cy="47.4" r="1.3" fill="#ffffff" />
          <circle cx="113.3" cy="47.4" r="1.3" fill="#ffffff" />
          <path d="M97.5 57.5 Q100 61 102.5 57.5" fill="none" stroke={skinShade} stroke-width="2" stroke-linecap="round" />
          <path d="M90 67 Q100 76 110 67" fill="none" stroke={OUTLINE} stroke-width="2.6" stroke-linecap="round" />
        </g>
      )}
    </g>
  );
}

/**
 * A head on its own, for choosing a hair style or a head covering. It is the
 * same drawing as on the figure.
 */
export function HeadPreview({ look: given, size = 56 }: { look: BodyLook; size?: number }) {
  const look = withDefaults(given);
  return (
    <svg viewBox="40 -14 120 118" width={size} height={size} aria-hidden="true" focusable="false" class="head-preview">
      <HairBehind look={look} />
      <HeadArt look={look} back={false} helmet={false} />
    </svg>
  );
}

const HEAD_PARTS: ReadonlySet<PartId> = new Set<PartId>(['head', 'eyes', 'ears', 'nose', 'mouth', 'hearing', 'cochlear', 'oxygen']);

// A simple, friendly figure, always clothed, drawn from a few shapes and
// never moving. It can be made to look like the child (Parent Mode, My body):
// a boy, a girl or a non-binary figure, with the child's skin, hair and
// clothes, a head covering, a wheelchair, and the equipment and aids they use.
// The pictures of the parts are only hit areas over the clothed figure.
export function BodyFigure({ look: given, view, selected = new Set<PartId>(), onToggle }: Props) {
  const look = withDefaults(given);
  const { legEnd, hipTop, hipBottom, kneeY } = geometry(look.wheelchair);
  const back = view === 'back';
  const skin = look.skin;
  const trousers = look.outfit === 'trousers';
  const skirt = look.outfit === 'skirt';
  const dress = look.outfit === 'dress';
  const bottomOnLegs = trousers;
  const extra = (id: EquipmentId) => hasExtra(look, id);
  // The shape of the body: slightly different for each figure.
  const torso = look.figure === 'girl' ? { x: 65, w: 70 } : look.figure === 'boy' ? { x: 61, w: 78 } : { x: 63, w: 74 };
  const armLeft = torso.x - 25;
  const armRight = torso.x + torso.w + 1;
  const legBottom = look.wheelchair ? legEnd - 8 : legEnd - 6;
  const chairFrame = look.bottom === '#1a1a1a' ? '#374151' : look.bottom;
  const prostheticSide = (side: 'arm' | 'leg') => (side === 'arm' ? armRight : 102);
  const topShade = shade(look.top, 0.2);
  const bottomShade = shade(look.bottom, 0.22);
  const socks = !trousers;

  return (
    <svg class="body-figure" viewBox="0 -34 200 454" role="img" aria-label={`A figure, seen from the ${view}`}>
      {look.wheelchair && <WheelchairBack frame={chairFrame} />}

      {/* Crutches and frame, when standing */}
      {!look.wheelchair && extra('crutches') && (
        <g stroke="#6b7280" stroke-width="5" stroke-linecap="round" fill="none">
          <path d="M34 120 L16 388" />
          <path d="M166 120 L184 388" />
          <path d="M28 150 L52 150" />
          <path d="M148 150 L172 150" />
        </g>
      )}
      {!look.wheelchair && extra('frame') && (
        <g stroke="#6b7280" stroke-width="5" stroke-linecap="round" fill="none">
          <path d="M30 210 L30 392" />
          <path d="M170 210 L170 392" />
          <path d="M30 210 L170 210" />
          <path d="M30 300 L170 300" />
        </g>
      )}

      {/* Hair behind the head */}
      <g transform={HEAD_TRANSFORM}>
        <HairBehind look={look} />
      </g>

      {/* Arms: sleeves in the top's colour with a cuff, then skin, then a hand with a thumb */}
      {[armLeft, armRight].map((x, index) => {
        const isProsthetic = extra('prostheticArm') && x === prostheticSide('arm');
        return (
          <g key={x}>
            <rect x={x} y="98" width="24" height="88" rx="10" fill={isProsthetic ? METAL : skin} stroke={OUTLINE} stroke-width="2" />
            <rect x={x} y="98" width="24" height="34" rx="10" fill={look.top} stroke={OUTLINE} stroke-width="2" />
            <rect x={x + 1} y="124" width="22" height="7" fill={topShade} />
            <line x1={x + 1} y1="124" x2={x + 23} y2="124" stroke={OUTLINE} stroke-width="1.5" />
            {isProsthetic ? (
              <g>
                <rect x={x + 4} y="150" width="16" height="6" rx="3" fill={PLASTIC} stroke={OUTLINE} stroke-width="1" />
                <path d={`M${x + 4} 192 q8 18 16 0`} fill={METAL} stroke={OUTLINE} stroke-width="2" />
              </g>
            ) : (
              <g>
                <ellipse cx={x + 12} cy="197" rx="12" ry="12" fill={skin} stroke={OUTLINE} stroke-width="2" />
              </g>
            )}
            {extra('sensor') && !back && index === 1 && <circle cx={x + 12} cy="126" r="7" fill="#f8fafc" stroke={OUTLINE} stroke-width="2" />}
            {extra('sensor') && !back && index === 1 && <circle cx={x + 12} cy="126" r="2.5" fill="#22a559" />}
          </g>
        );
      })}

      {/* Legs, with socks or trouser hems, and shoes */}
      {([70, 102] as const).map((x) => {
        const isProsthetic = extra('prostheticLeg') && x === prostheticSide('leg');
        return (
          <g key={x}>
            <rect x={x} y={hipBottom - 4} width="28" height={legBottom - hipBottom + 4} rx="10" fill={isProsthetic ? METAL : bottomOnLegs ? look.bottom : skin} stroke={OUTLINE} stroke-width="2" />
            {!isProsthetic && trousers && (
              <g>
                <line x1={x + 14} y1={hipBottom + 8} x2={x + 14} y2={legBottom - 14} stroke={bottomShade} stroke-width="1.5" stroke-linecap="round" />
                <rect x={x + 1} y={legBottom - 11} width="26" height="9" rx="3" fill={bottomShade} />
              </g>
            )}
            {!isProsthetic && socks && (
              <g>
                <rect x={x + 1} y={legBottom - 26} width="26" height="24" rx="5" fill="#f8fafc" stroke={OUTLINE} stroke-width="1.5" />
                <rect x={x + 1.5} y={legBottom - 26} width="25" height="5" rx="2" fill={bottomShade} />
              </g>
            )}
            {isProsthetic && (
              <g>
                <rect x={x + 8} y={kneeY - 6} width="12" height="10" rx="4" fill={PLASTIC} stroke={OUTLINE} stroke-width="1.5" />
                <rect x={x + 10} y={kneeY + 10} width="8" height={legBottom - kneeY - 18} fill="#6b7280" />
              </g>
            )}
            {extra('braces') && (
              <g fill="none" stroke="#f8fafc" stroke-width="5">
                <rect x={x - 1} y={kneeY + 14} width="30" height={legBottom - kneeY - 28} rx="6" stroke={OUTLINE} stroke-width="2" fill="#cbd5e1" fill-opacity="0.55" />
                <line x1={x + 2} y1={kneeY + 30} x2={x + 26} y2={kneeY + 30} stroke={OUTLINE} stroke-width="2" />
                <line x1={x + 2} y1={kneeY + 50} x2={x + 26} y2={kneeY + 50} stroke={OUTLINE} stroke-width="2" />
              </g>
            )}
          </g>
        );
      })}
      {([82, 118] as const).map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={legEnd} rx="17" ry="10" fill="#4b5563" stroke={OUTLINE} stroke-width="2" />
          <path d={`M${cx - 15} ${legEnd + 3.5} Q${cx} ${legEnd + 11} ${cx + 15} ${legEnd + 3.5}`} fill="none" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" />
          <ellipse cx={cx} cy={legEnd - 3} rx="7" ry="3.5" fill="#ffffff" opacity="0.22" />
          <path d={`M${cx - 4} ${legEnd - 7} l8 0 M${cx - 4} ${legEnd - 3} l8 0`} stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" />
        </g>
      ))}

      {look.wheelchair && <WheelchairFront frame={chairFrame} />}

      {/* Top, and the clothes over the hips */}
      <rect x={torso.x} y="94" width={torso.w} height="116" rx="16" fill={look.top} stroke={OUTLINE} stroke-width="2" />
      <line x1={torso.x + 8} y1="198" x2={torso.x + torso.w - 8} y2="198" stroke={topShade} stroke-width="3" stroke-linecap="round" />
      {dress ? (
        <g>
          <path d={`M${torso.x} ${hipTop - 16} L${torso.x + torso.w} ${hipTop - 16} L${torso.x + torso.w + 16} ${hipBottom + 36} L${torso.x - 16} ${hipBottom + 36} Z`} fill={look.bottom} stroke={OUTLINE} stroke-width="2" />
          <path d={`M${torso.x - 14} ${hipBottom + 30} L${torso.x + torso.w + 14} ${hipBottom + 30}`} stroke={bottomShade} stroke-width="5" />
          <path d={`M${100 - 22} ${hipTop - 4} L${100 - 28} ${hipBottom + 28} M100 ${hipTop - 4} L100 ${hipBottom + 28} M${100 + 22} ${hipTop - 4} L${100 + 28} ${hipBottom + 28}`} stroke={bottomShade} stroke-width="1.5" stroke-linecap="round" />
        </g>
      ) : skirt ? (
        <g>
          <path d={`M62 ${hipTop} L138 ${hipTop} L152 ${hipBottom + 24} L48 ${hipBottom + 24} Z`} fill={look.bottom} stroke={OUTLINE} stroke-width="2" />
          <path d={`M49 ${hipBottom + 18} L151 ${hipBottom + 18}`} stroke={bottomShade} stroke-width="5" />
          <path d={`M${100 - 20} ${hipTop + 6} L${100 - 26} ${hipBottom + 16} M100 ${hipTop + 6} L100 ${hipBottom + 16} M${100 + 20} ${hipTop + 6} L${100 + 26} ${hipBottom + 16}`} stroke={bottomShade} stroke-width="1.5" stroke-linecap="round" />
        </g>
      ) : (
        <g>
          <rect x="64" y={hipTop} width="72" height={hipBottom - hipTop + (trousers ? 8 : 4)} rx="10" fill={look.bottom} stroke={OUTLINE} stroke-width="2" />
          <rect x="65" y={hipTop + 1} width="70" height="8" rx="4" fill={bottomShade} />
          {!back && <circle cx="100" cy={hipTop + 5} r="2" fill="#f8fafc" />}
          {!trousers && <rect x="65" y={hipBottom - 6} width="70" height="8" rx="4" fill={bottomShade} />}
        </g>
      )}
      {extra('pump') && (
        <g>
          <rect x="118" y="208" width="18" height="24" rx="4" fill="#f8fafc" stroke={OUTLINE} stroke-width="2" />
          <rect x="122" y="213" width="10" height="7" rx="1" fill="#22a559" />
          <path d="M118 220 C104 222 104 190 100 180" fill="none" stroke="#6b7280" stroke-width="1.5" />
        </g>
      )}
      {extra('feedingTube') && !back && (
        <g>
          <circle cx="100" cy="178" r="7" fill="#f8fafc" stroke={OUTLINE} stroke-width="2" />
          <path d="M100 185 C100 205 118 205 118 224" fill="none" stroke="#9ca3af" stroke-width="3" />
        </g>
      )}

      {/* Neck, and the collar */}
      <rect x="89" y="76" width="22" height="22" fill={skin} stroke={OUTLINE} stroke-width="2" />
      <rect x="91" y="76" width="18" height="20" fill={skin} />
      {!back ? (
        <path d="M86 94 Q100 112 114 94" fill={skin} stroke={OUTLINE} stroke-width="2" stroke-linejoin="round" />
      ) : (
        <path d="M86 94 Q100 102 114 94" fill="none" stroke={topShade} stroke-width="4" stroke-linecap="round" />
      )}
      {extra('trach') && !back && (
        <g>
          <rect x="93" y="84" width="14" height="9" rx="3" fill="#f8fafc" stroke={OUTLINE} stroke-width="1.5" />
          <circle cx="100" cy="88.5" r="2" fill={OUTLINE} />
        </g>
      )}

      {/* The head, a little larger as a child's is, and what is worn on it */}
      <g transform={HEAD_TRANSFORM}>
        <HeadArt look={look} back={back} helmet={extra('helmet')} />
        {!back && (
          <>
            {extra('eyePatch') && (
              <g>
                <ellipse cx="112" cy="49" rx="9" ry="8" fill="#1f2937" />
                <line x1="104" y1="42" x2="132" y2="34" stroke={OUTLINE} stroke-width="2" />
              </g>
            )}
            {look.glasses && (
              <g fill="rgba(255,255,255,0.18)" stroke={OUTLINE} stroke-width="2.5">
                <circle cx="88" cy="49" r="10.5" />
                <circle cx="112" cy="49" r="10.5" />
                <line x1="98.5" y1="48" x2="101.5" y2="48" fill="none" />
                <line x1="77.5" y1="47" x2="71" y2="45" fill="none" />
                <line x1="122.5" y1="47" x2="129" y2="45" fill="none" />
              </g>
            )}
            {extra('oxygen') && (
              <g fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round">
                <path d="M94 62 L94 58 M106 62 L106 58" />
                <path d="M94 62 C80 68 72 60 66 58" />
                <path d="M106 62 C120 68 128 60 134 58" />
                <path d="M70 60 C60 90 70 120 80 150" />
              </g>
            )}
          </>
        )}
        {back && look.glasses && <line x1="70" y1="49" x2="130" y2="49" stroke={OUTLINE} stroke-width="2.5" />}
        {extra('hearingAids') && (
          <g fill="#e8c9a0" stroke={OUTLINE} stroke-width="1.5">
            <path d="M66 48 q-10 8 -2 22 q6 -6 4 -22" />
            <path d="M134 48 q10 8 2 22 q-6 -6 -4 -22" />
          </g>
        )}
        {extra('cochlear') && (
          <g stroke={OUTLINE} stroke-width="1.5">
            <path d="M134 46 q10 8 2 22 q-6 -6 -4 -22" fill="#d1d5db" />
            <circle cx="142" cy="44" r="5" fill="#9ca3af" />
            <path d="M138 44 L132 40" fill="none" />
          </g>
        )}
      </g>

      {/* Parts that can be pressed: see-through, lit when chosen. The parts of the head are scaled with the head. */}
      <g class="body-figure__parts">
        {regionsFor(view, look).map((region) => {
          const on = selected.has(region.id);
          return (
            <g
              key={region.id}
              class={`body-figure__part${on ? ' body-figure__part--on' : ''}${onToggle ? ' body-figure__part--press' : ''}`}
              data-part={region.id}
              {...(HEAD_PARTS.has(region.id) ? { transform: HEAD_TRANSFORM } : {})}
              onClick={onToggle ? () => onToggle(region.id) : undefined}
            >
              {region.shapes.map((shape, index) => (
                <ShapeEl key={index} shape={shape} />
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
