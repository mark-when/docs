import { parse, Range } from "@markwhen/parser";

export function highlight(text: string) {
  const parsed = parse(text);
  return _highlight(text, parsed.ranges, 0, text.length);
}

function _highlight(
  text: string,
  ranges: Range[],
  from: number,
  to: number
): string {
  // Filter ranges that are within the current bounds
  const relevantRanges = ranges.filter((r) => r.from >= from && r.to <= to);

  // Sort ranges by start position, then by end position (longer ranges first for same start)
  relevantRanges.sort((a, b) => {
    if (a.from !== b.from) return a.from - b.from;
    return b.to - a.to; // Longer ranges first
  });

  let pointer = from;
  let result = "";
  let i = 0;

  while (i < relevantRanges.length) {
    const range = relevantRanges[i];

    // Add any text before this range
    if (range.from > pointer) {
      result += text.substring(pointer, range.from);
      pointer = range.from;
    }

    // Find all ranges that are nested within this range
    const nestedRanges = relevantRanges.filter(
      (r) => r.from >= range.from && r.to <= range.to && r !== range
    );

    // Add the opening span tag
    result += `<span class="${range.type}">`;

    // Add content before nested ranges, process nested ranges, then remaining content
    if (nestedRanges.length > 0) {
      result += _highlight(text, nestedRanges, range.from, range.to);
    } else {
      result += text.substring(range.from, range.to);
    }

    // Close the span tag
    result += "</span>";

    pointer = range.to;

    // Skip any ranges that were already processed as nested ranges
    while (
      i + 1 < relevantRanges.length &&
      relevantRanges[i + 1].from < range.to
    ) {
      i++;
    }
    i++;
  }

  // Add any remaining text
  if (pointer < to) {
    result += text.substring(pointer, to);
  }

  return result;
}
