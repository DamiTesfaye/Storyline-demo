import { SC_ATTR, SC_VERSION_ATTR } from '../constants';

/**
 * Creates a <style> element and injects it into the DOM.
 */
export function makeStyleTag(target?: HTMLElement): HTMLStyleElement {
  const tag = document.createElement('style');
  tag.setAttribute(SC_ATTR, '');

  const version = typeof process !== 'undefined' && process.env.SC_VERSION ? process.env.SC_VERSION : '5';
  tag.setAttribute(SC_VERSION_ATTR, version);

  const parent = target || document.head;
  parent.insertBefore(tag, parent.firstChild);

  return tag;
}

/**
 * Returns the CSSStyleSheet object for a given <style> element.
 */
export function getSheet(tag: HTMLStyleElement): CSSStyleSheet {
  return tag.sheet as CSSStyleSheet;
}