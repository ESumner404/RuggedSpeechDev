/** Prints the page. A phone or tablet shell has its own print sheet; everywhere else the browser's does. */
export function printPage(): void {
  const print = window.myWords?.print;
  if (print) void print();
  else window.print();
}
