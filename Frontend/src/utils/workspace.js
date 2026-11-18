const WORKSPACE_KEY = 'toolshub_workspace_v1';

function readWorkspace() {
  if (typeof window === 'undefined') return {};
  try {
    const value = localStorage.getItem(WORKSPACE_KEY);
    const parsed = value ? JSON.parse(value) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeWorkspace(workspace) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
  window.dispatchEvent(new Event('toolshub_workspace_updated'));
}

export function getToolDraft(toolId, fallback = null) {
  if (!toolId) return fallback;
  const workspace = readWorkspace();
  return Object.prototype.hasOwnProperty.call(workspace, toolId)
    ? workspace[toolId]
    : fallback;
}

export function saveToolDraft(toolId, draft) {
  if (!toolId) return;
  const workspace = readWorkspace();
  workspace[toolId] = draft;
  writeWorkspace(workspace);
}

export function removeToolDraft(toolId) {
  if (!toolId) return;
  const workspace = readWorkspace();
  delete workspace[toolId];
  writeWorkspace(workspace);
}

export function clearWorkspace() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(WORKSPACE_KEY);
  window.dispatchEvent(new Event('toolshub_workspace_updated'));
}
