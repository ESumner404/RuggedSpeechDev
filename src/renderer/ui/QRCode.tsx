import qrcode from 'qrcode-generator';

type Props = {
  text: string;
  class?: string;
};

/**
 * Renders a QR code entirely offline — qrcode-generator is a pure,
 * dependency-free JS encoder (CLAUDE.md §3: "every added dependency is a
 * liability"; this one adds none of its own, and never touches the
 * network — no lookup, no remote rendering service).
 */
export function QRCode({ text, class: className }: Props) {
  // Type 0 = automatic sizing for whatever text length is given; 'M' is a
  // reasonable balance between error tolerance and how dense the code gets.
  const code = qrcode(0, 'M');
  code.addData(text);
  code.make();
  const svg = code.createSvgTag({ scalable: true });

  return <div class={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
