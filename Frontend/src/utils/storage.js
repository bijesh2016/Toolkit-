/**
 * Local Persistence & History Utility
 * Tracks Recent Tools and Starred Favorites
 */

const RECENT_KEY = 'toolshub_recent_tools';
const FAVORITES_KEY = 'toolshub_favorite_tools';

export function getRecentTools() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addRecentTool(toolId) {
  if (typeof window === 'undefined' || !toolId) return;
  try {
    const list = getRecentTools().filter(id => id !== toolId);
    list.unshift(toolId);
    const trimmed = list.slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new Event('toolshub_storage_updated'));
  } catch (e) {}
}

export function getFavorites() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : ['bs-ad-converter', 'json-formatter', 'image-to-pdf'];
  } catch (e) {
    return [];
  }
}

export function toggleFavorite(toolId) {
  if (typeof window === 'undefined' || !toolId) return false;
  try {
    let list = getFavorites();
    let isFav = false;
    if (list.includes(toolId)) {
      list = list.filter(id => id !== toolId);
      isFav = false;
    } else {
      list.push(toolId);
      isFav = true;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('toolshub_storage_updated'));
    return isFav;
  } catch (e) {
    return false;
  }
}

export function isFavorite(toolId) {
  return getFavorites().includes(toolId);
}

// ==========================================
// PRO MEMBERSHIP & EMAIL QUOTA PERSISTENCE
// ==========================================
const PRO_STATUS_KEY = 'toolshub_is_pro';
const EMAIL_COUNT_KEY = 'toolshub_temp_email_count';

export function isProMember() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(PRO_STATUS_KEY) === 'true';
}

export function setProMember(status = true) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRO_STATUS_KEY, status ? 'true' : 'false');
  window.dispatchEvent(new Event('toolshub_pro_updated'));
}

export function getEmailGenerationCount() {
  if (typeof window === 'undefined') return 0;
  try {
    const val = localStorage.getItem(EMAIL_COUNT_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch (e) {
    return 0;
  }
}

export function incrementEmailGenerationCount() {
  if (typeof window === 'undefined') return 1;
  const current = getEmailGenerationCount();
  const next = current + 1;
  localStorage.setItem(EMAIL_COUNT_KEY, next.toString());
  return next;
}

export function canGenerateEmail() {
  if (isProMember()) return true;
  return getEmailGenerationCount() < 2;
}

