import { CSSProperties } from 'react';

export default (reactCSS: CSSProperties) => {
  const css: Record<string, unknown> = {};

  for (const key of Object.keys(reactCSS)) {
    let newKey = '';

    for (const char of key) {
      if (char === char.toUpperCase()) {
        newKey += '-' + char.toLowerCase();
        continue;
      }

      newKey += char;
    }

    css[newKey] = (reactCSS as Record<string, unknown>)[key];
  }

  return css;
};
