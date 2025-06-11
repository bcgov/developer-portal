import { useEffect } from 'react';
import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

const CODE_BLOCK_SELECTORS = [
  'pre code',
  '.codehilite',
  '.highlight pre',
  'div[class*="language-"] pre',
  '.highlight code',
  'pre[class*="language-"]',
  'code[class*="language-"]',
  '.md-typeset pre',
  '.md-typeset code',
];

const ACCESSIBILITY_STYLES = {
  backgroundColor: '#f8f8f8',
  color: '#2d3748',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '16px',
  fontSize: '14px',
  lineHeight: '1.5',
  fontFamily:
    'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',

  '--syntax-comment': '#718096',
  '--syntax-keyword': '#3182ce',
  '--syntax-string': '#38a169',
  '--syntax-number': '#d69e2e',
  '--syntax-function': '#805ad5',
  '--syntax-variable': '#2d3748',
  '--syntax-operator': '#4a5568',
  '--syntax-punctuation': '#4a5568',
};

const INLINE_CODE_STYLES = {
  backgroundColor: '#f7fafc',
  color: '#2d3748',
  border: '1px solid #e2e8f0',
  borderRadius: '3px',
  padding: '2px 4px',
  fontSize: '0.875em',
  lineHeight: '1.5',
  fontFamily:
    'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
};

export const AccessibilityStylesAddon = () => {
  const codeBlocks = useShadowRootElements<HTMLElement>(CODE_BLOCK_SELECTORS);

  const inlineCodeElements = useShadowRootElements<HTMLElement>([
    'code:not(pre code)',
    'p code',
    'li code',
    'td code',
    'th code',
  ]);

  useEffect(() => {
    codeBlocks.forEach(element => {
      Object.assign(element.style, ACCESSIBILITY_STYLES);

      element.style.userSelect = 'text';
      element.style.webkitUserSelect = 'text';

      element.style.outline = 'none';
      element.addEventListener('focus', () => {
        element.style.boxShadow = '0 0 0 2px #3182ce';
      });
      element.addEventListener('blur', () => {
        element.style.boxShadow = 'none';
      });

      const syntaxElements = element.querySelectorAll('.c, .c1, .cm');
      syntaxElements.forEach(syntaxElement => {
        (syntaxElement as HTMLElement).style.color =
          ACCESSIBILITY_STYLES['--syntax-comment'];
      });

      const keywordElements = element.querySelectorAll('.k, .kw, .keyword');
      keywordElements.forEach(keywordElement => {
        (keywordElement as HTMLElement).style.color =
          ACCESSIBILITY_STYLES['--syntax-keyword'];
      });

      const stringElements = element.querySelectorAll('.s, .s1, .s2, .string');
      stringElements.forEach(stringElement => {
        (stringElement as HTMLElement).style.color =
          ACCESSIBILITY_STYLES['--syntax-string'];
      });

      const numberElements = element.querySelectorAll('.m, .mi, .mf, .number');
      numberElements.forEach(numberElement => {
        (numberElement as HTMLElement).style.color =
          ACCESSIBILITY_STYLES['--syntax-number'];
      });

      const functionElements = element.querySelectorAll('.n, .nf, .function');
      functionElements.forEach(functionElement => {
        (functionElement as HTMLElement).style.color =
          ACCESSIBILITY_STYLES['--syntax-function'];
      });

      const variableElements = element.querySelectorAll('.nv, .variable');
      variableElements.forEach(variableElement => {
        (variableElement as HTMLElement).style.color =
          ACCESSIBILITY_STYLES['--syntax-variable'];
      });

      const operatorElements = element.querySelectorAll('.o, .operator');
      operatorElements.forEach(operatorElement => {
        (operatorElement as HTMLElement).style.color =
          ACCESSIBILITY_STYLES['--syntax-operator'];
      });
    });
  }, [codeBlocks]);

  useEffect(() => {
    inlineCodeElements.forEach(element => {
      Object.assign(element.style, INLINE_CODE_STYLES);

      element.style.fontWeight = '500';
      element.style.wordBreak = 'break-word';
    });
  }, [inlineCodeElements]);

  return null;
};
