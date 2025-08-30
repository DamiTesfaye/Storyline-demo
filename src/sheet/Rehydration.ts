import { IS_BROWSER, SC_ATTR, SC_VERSION_ATTR } from '../constants';
import { Sheet } from '../types';
import { getGroupForId } from './GroupIDAllocator';

const SELECTOR = `style[${SC_ATTR}]`;

/**
 * Gets all styled-components style tags from the DOM
 */
const getStyleTags = (): HTMLStyleElement[] => {
  const list = document.querySelectorAll<HTMLStyleElement>(SELECTOR);
  return Array.from(list);
};

/**
 * Outputs the current sheet as a string of HTML style tags for SSR
 */
export function outputSheet(sheet: Sheet): string {
  const { names } = sheet;
  const tag = sheet.getTag();
  let html = '';

  names.forEach((groupNames, id) => {
    const group = getGroupForId(id);
    const css = tag.getGroup(group);

    if (groupNames.size > 0 && css) {
      const namesAttr = Array.from(groupNames).join(' ');
      const version = typeof process !== 'undefined' && process.env.SC_VERSION ? process.env.SC_VERSION : '5';
      html += `<style ${SC_ATTR}="${id}" ${SC_VERSION_ATTR}="${version}" data-styled-names="${namesAttr}">${css}</style>\n`;
    }
  });

  return html;
}

/**
 * Rehydrates the sheet from the DOM on the client
 */
export function rehydrateSheet(sheet: Sheet): void {
  if (!IS_BROWSER) return;

  const styleTags = getStyleTags();

  for (const styleTag of styleTags) {
    const id = styleTag.getAttribute(SC_ATTR);
    const names = (styleTag.getAttribute('data-styled-names') || '').trim().split(' ');

    if (id) {
      for (const name of names) {
        if (name) sheet.registerName(id, name);
      }
    }
  }
}