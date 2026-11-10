/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  displayMode = false,
  className = '',
}) => {
  const html = useMemo(() => {
    if (!math) return '';
    try {
      // Normalize common math symbols
      let formula = math
        .replace(/×/g, '\\times ')
        .replace(/÷/g, '\\div ')
        .replace(/≤/g, '\\le ')
        .replace(/≥/g, '\\ge ')
        .replace(/≠/g, '\\ne ')
        .replace(/²/g, '^2')
        .replace(/³/g, '^3')
        .replace(/√/g, '\\sqrt');

      return katex.renderToString(formula, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return '';
    }
  }, [math, displayMode]);

  if (!html) {
    return <span className={`font-mono ${className}`}>{math}</span>;
  }

  return (
    <span
      className={`katex-math-wrapper inline-block align-middle avoid-break ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
