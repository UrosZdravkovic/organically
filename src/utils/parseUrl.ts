import { parse } from 'tldts';

export type UrlType = 'root domain' | 'subdomain' | 'subfolder' | 'invalid';

export interface ParsedUrl {
  type: UrlType;
  rootDomain: string | null;
  subdomain: string | null;
  fullUrl: string | null;
  path: string | null;
  message?: string;
}

export default function parseUrl(input: string): ParsedUrl {
  try {
    // Dodaj https:// ako nije unet
    const fullUrl = input.startsWith('http') ? input : `https://${input}`;

    // Kreiraj URL objekat (može baciti grešku ako je invalid)
    const urlObj = new URL(fullUrl);

    // Parsiraj pomoću tldts
    const info = parse(fullUrl);

    if (!info.domain) {
      return {
        type: 'invalid',
        rootDomain: null,
        subdomain: null,
        fullUrl: null,
        path: null,
        message: 'Invalid URL format',
      };
    }

    let type: UrlType;

    if (info.subdomain && urlObj.pathname === '/') {
      type = 'subdomain';
    } else if (urlObj.pathname && urlObj.pathname !== '/') {
      type = 'subfolder';
    } else {
      type = 'root domain';
    }

    return {
      type,
      rootDomain: info.domain || null,
      subdomain: info.subdomain || null,
      fullUrl,
      path: urlObj.pathname,
    };
  } catch {
    return {
      type: 'invalid',
      rootDomain: null,
      subdomain: null,
      fullUrl: null,
      path: null,
      message: 'Invalid URL',
    };
  }
}
