import { geometry, regionsFor, type PartId, type Shape, type View } from './parts';
import { hasExtra, withDefaults, type BodyLook, type EquipmentId } from './look';

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

// A simple, friendly figure, always clothed, drawn from a few shapes and
// never moving. It can be made to look like the child (Parent Mode, My body):
// a boy, a girl or a non-binary figure, with the child's skin, hair and
// clothes, a wheelchair, and the equipment and aids they use. The pictures of
// the parts are only hit areas over the clothed figure.
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

  return (
    <svg class="body-figure" viewBox="0 0 200 420" role="img" aria-label={`A figure, seen from the ${view}`}>
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
      {look.hairStyle === 'long' && <rect x="66" y="30" width="68" height="104" rx="30" fill={look.hair} />}
      {look.hairStyle === 'curly' &&
        [[72, 30], [88, 20], [104, 18], [120, 24], [130, 38], [68, 46], [132, 52]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="14" fill={look.hair} />
        ))}
      {look.hairStyle === 'tied' && <circle cx="100" cy="14" r="13" fill={look.hair} />}

      {/* Arms: sleeves in the top's colour, then skin */}
      {[armLeft, armRight].map((x, index) => {
        const isProsthetic = extra('prostheticArm') && x === prostheticSide('arm');
        return (
          <g key={x}>
            <rect x={x} y="98" width="24" height="88" rx="10" fill={isProsthetic ? METAL : skin} stroke={OUTLINE} stroke-width="2" />
            <rect x={x} y="98" width="24" height="34" rx="10" fill={look.top} stroke={OUTLINE} stroke-width="2" />
            {isProsthetic ? (
              <g>
                <rect x={x + 4} y="150" width="16" height="6" rx="3" fill={PLASTIC} stroke={OUTLINE} stroke-width="1" />
                <path d={`M${x + 4} 192 q8 18 16 0`} fill={METAL} stroke={OUTLINE} stroke-width="2" />
              </g>
            ) : (
              <ellipse cx={x + 12} cy="197" rx="12" ry="12" fill={skin} stroke={OUTLINE} stroke-width="2" />
            )}
            {extra('sensor') && !back && index === 1 && <circle cx={x + 12} cy="126" r="7" fill="#f8fafc" stroke={OUTLINE} stroke-width="2" />}
            {extra('sensor') && !back && index === 1 && <circle cx={x + 12} cy="126" r="2.5" fill="#22a559" />}
          </g>
        );
      })}

      {/* Legs and feet */}
      {([70, 102] as const).map((x) => {
        const isProsthetic = extra('prostheticLeg') && x === prostheticSide('leg');
        return (
          <g key={x}>
            <rect x={x} y={hipBottom - 4} width="28" height={legBottom - hipBottom + 4} rx="10" fill={isProsthetic ? METAL : bottomOnLegs ? look.bottom : skin} stroke={OUTLINE} stroke-width="2" />
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
        <ellipse key={cx} cx={cx} cy={legEnd} rx="17" ry="10" fill="#4b5563" stroke={OUTLINE} stroke-width="2" />
      ))}

      {look.wheelchair && <WheelchairFront frame={chairFrame} />}

      {/* Top, and the clothes over the hips */}
      <rect x={torso.x} y="94" width={torso.w} height="116" rx="16" fill={look.top} stroke={OUTLINE} stroke-width="2" />
      {dress ? (
        <path d={`M${torso.x} ${hipTop - 16} L${torso.x + torso.w} ${hipTop - 16} L${torso.x + torso.w + 16} ${hipBottom + 36} L${torso.x - 16} ${hipBottom + 36} Z`} fill={look.bottom} stroke={OUTLINE} stroke-width="2" />
      ) : skirt ? (
        <path d={`M62 ${hipTop} L138 ${hipTop} L152 ${hipBottom + 24} L48 ${hipBottom + 24} Z`} fill={look.bottom} stroke={OUTLINE} stroke-width="2" />
      ) : (
        <rect x="64" y={hipTop} width="72" height={hipBottom - hipTop + (trousers ? 8 : 4)} rx="10" fill={look.bottom} stroke={OUTLINE} stroke-width="2" />
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

      {/* Neck and head */}
      <rect x="90" y="78" width="20" height="18" fill={skin} />
      {extra('trach') && !back && (
        <g>
          <rect x="93" y="84" width="14" height="9" rx="3" fill="#f8fafc" stroke={OUTLINE} stroke-width="1.5" />
          <circle cx="100" cy="88.5" r="2" fill={OUTLINE} />
        </g>
      )}
      {look.hairStyle !== 'none' && !back && look.hairStyle !== 'curly' && <circle cx="100" cy="44" r="33" fill={look.hair} />}
      <circle cx="100" cy="50" r="30" fill={skin} stroke={OUTLINE} stroke-width="2" />
      {look.hairStyle !== 'none' && !back && <path d="M70 46 Q100 8 130 46 Q100 30 70 46 Z" fill={look.hair} />}
      {back && look.hairStyle !== 'none' && <circle cx="100" cy="50" r="30" fill={look.hair} />}
      {extra('helmet') && (
        <g>
          <path d="M68 52 Q68 12 100 12 Q132 12 132 52 Q100 40 68 52 Z" fill="#60a5fa" stroke={OUTLINE} stroke-width="2" />
          <line x1="68" y1="52" x2="64" y2="64" stroke={OUTLINE} stroke-width="2" />
          <line x1="132" y1="52" x2="136" y2="64" stroke={OUTLINE} stroke-width="2" />
        </g>
      )}
      {!back && (
        <>
          <circle cx="88" cy="48" r="3.5" fill={OUTLINE} />
          <circle cx="112" cy="48" r="3.5" fill={OUTLINE} />
          <path d="M90 68 Q100 76 110 68" fill="none" stroke={OUTLINE} stroke-width="2.5" stroke-linecap="round" />
          {extra('eyePatch') && (
            <g>
              <ellipse cx="112" cy="48" rx="9" ry="8" fill="#1f2937" />
              <line x1="104" y1="42" x2="132" y2="34" stroke={OUTLINE} stroke-width="2" />
            </g>
          )}
          {look.glasses && (
            <g fill="none" stroke={OUTLINE} stroke-width="2.5">
              <circle cx="88" cy="48" r="10" />
              <circle cx="112" cy="48" r="10" />
              <line x1="98" y1="48" x2="102" y2="48" />
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
      {back && look.glasses && <line x1="70" y1="48" x2="130" y2="48" stroke={OUTLINE} stroke-width="2.5" />}
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

      {/* Parts that can be pressed: see-through, lit when chosen */}
      <g class="body-figure__parts">
        {regionsFor(view, look).map((region) => {
          const on = selected.has(region.id);
          return (
            <g
              key={region.id}
              class={`body-figure__part${on ? ' body-figure__part--on' : ''}${onToggle ? ' body-figure__part--press' : ''}`}
              data-part={region.id}
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
