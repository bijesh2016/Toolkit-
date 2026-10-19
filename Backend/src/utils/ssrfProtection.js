/**
 * Server-Side Request Forgery (SSRF) Protection Utility
 * Prevents tools from accessing localhost, internal LANs, cloud metadata endpoints (169.254.169.254), etc.
 */

import dns from 'dns';
import { promisify } from 'util';
import ipaddr from 'net';

const dnsLookup = promisify(dns.lookup);

const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'metadata.google.internal',
  'instance-data'
];

/**
 * Checks if an IPv4 is within private/reserved subnet
 */
function isPrivateIp(ip) {
  // Check if loopback, link-local, or private RFC1918
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return false;

  // 127.0.0.0/8 (Loopback)
  if (parts[0] === 127) return true;
  // 10.0.0.0/8 (Private)
  if (parts[0] === 10) return true;
  // 172.16.0.0/12 (Private)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16 (Private)
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 169.254.0.0/16 (Link Local / Cloud Metadata)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0
  if (parts[0] === 0) return true;

  return false;
}

/**
 * Validates whether a target URL is safe to fetch externally
 */
export async function validateSafeUrl(targetUrl) {
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch (err) {
    throw new Error('Invalid URL format');
  }

  // Only allow http: and https:
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Protocol not supported. Only HTTP and HTTPS are permitted.');
  }

  const hostname = parsed.hostname.toLowerCase();

  // Check against blacklisted hostnames
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    throw new Error('Access to local/private network hosts is forbidden (SSRF protection).');
  }

  // If already IP address, check directly
  if (ipaddr.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new Error('Access to private/internal IP address is forbidden (SSRF protection).');
    }
    return parsed.toString();
  }

  // Perform DNS lookup to resolve the actual target IP
  try {
    const lookupResult = await dnsLookup(hostname);
    if (isPrivateIp(lookupResult.address)) {
      throw new Error(`Hostname ${hostname} resolves to private IP (${lookupResult.address}) which is prohibited.`);
    }
  } catch (err) {
    if (err.message && err.message.includes('prohibited')) {
      throw err;
    }
    throw new Error(`DNS resolution failed for hostname: ${hostname}`);
  }

  return parsed.toString();
}
