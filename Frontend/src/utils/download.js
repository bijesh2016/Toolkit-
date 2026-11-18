function createDownloadUrl(content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  return URL.createObjectURL(blob);
}

export function downloadText(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const url = createDownloadUrl(content, mimeType);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadJson(filename, value) {
  downloadText(filename, `${JSON.stringify(value, null, 2)}\n`, 'application/json;charset=utf-8');
}

export function downloadCsv(filename, rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('At least one row is required to create a CSV file.');
  }

  const headers = Object.keys(rows[0]);
  const escapeCell = (value) => {
    const cell = value === null || value === undefined ? '' : String(value);
    return `"${cell.replaceAll('"', '""')}"`;
  };
  const csv = [
    headers.map(escapeCell).join(','),
    ...rows.map(row => headers.map(header => escapeCell(row[header])).join(','))
  ].join('\r\n');

  downloadText(filename, `${csv}\r\n`, 'text/csv;charset=utf-8');
}
