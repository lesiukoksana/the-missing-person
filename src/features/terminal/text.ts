import type { ArchiveDocument, Block } from '../../data/archive';

/** Plain-text versions of game records, for `read` and `search`. */

function unmark(text: string, doc: ArchiveDocument) {
  return text.replace(/\[\[([a-z0-9-]+)\]\]/g, (_, id: string) => {
    const mark = doc.marks[id];
    if (!mark) return '';
    return mark.kind === 'redaction' ? '█'.repeat(mark.text.length) : `[struck through: ${mark.text}]`;
  });
}

function blockLines(block: Block, doc: ArchiveDocument): string[] {
  switch (block.kind) {
    case 'heading':
      return ['', block.text.toUpperCase()];
    case 'fields':
      return block.rows.map(([label, value]) => `${label}: ${unmark(value, doc)}`);
    case 'para':
      return [unmark(block.text, doc)];
    case 'transcript':
      return block.lines.map(([speaker, line]) => `${speaker}: ${unmark(line, doc)}`);
    case 'table':
      return [block.columns.join(' | '), ...block.rows.map((row) => row.map((cell) => unmark(cell, doc)).join(' | '))];
    case 'handwritten':
      return [`[handwritten] ${block.text}`];
    case 'signature':
      return block.lines;
  }
}

export function documentText(doc: ArchiveDocument) {
  const lines = [`${doc.id}  ${doc.title.toUpperCase()}`, `${doc.date} · ${doc.author} · ${doc.classification}`];
  doc.pages.forEach((page, index) => {
    lines.push('', `--- page ${index + 1} of ${doc.pages.length}${page.stamp ? '' : ' (no registry stamp)'} ---`);
    page.blocks.forEach((block) => lines.push(...blockLines(block, doc)));
  });
  return lines;
}
