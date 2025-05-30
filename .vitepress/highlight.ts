import { parse, Range } from "@markwhen/parser";

export function highlight(
  text: string,
  withLines: boolean = true,
  highlighted: number[] = []
) {
  if (withLines) {
    return highlightWithLines(text, highlighted);
  }
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

// Alternative approach: Process line by line to preserve span boundaries
export function highlightWithLines(text: string, highlight: number[]) {
  const parsed = parse(text);
  const lines = text.split("\n");
  let result = "";
  let currentOffset = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineStart = currentOffset;
    const lineEnd = currentOffset + line.length;

    // Get ranges that intersect with this line
    const lineRanges = parsed.ranges
      .filter((range) => range.from < lineEnd && range.to > lineStart)
      .map((range) => ({
        ...range,
        from: Math.max(range.from - lineStart, 0),
        to: Math.min(range.to - lineStart, line.length),
      }));

    const highlightedLine = _highlight2(line, lineRanges, 0, line.length);
    result += `<span class="line${
      highlight.includes(i + 1) ? " highlighted" : ""
    }" data-line="${i + 1}">${
      highlightedLine || (i === lines.length - 1 ? "" : "&nbsp;")
    }</span>`;

    if (i < lines.length - 1) {
      result += "\n";
      currentOffset = lineEnd + 1; // +1 for the newline character
    }
  }

  return result;
}

function _highlight2(
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
