import { useEffect } from 'react';
import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

// It looks like there's a MkDocs bug that doesn't parse React code blocks corrently, specifically the closing tags, example:
// https://developer.gov.bc.ca/docs/default/component/citz-imb-sso-react-npm-package/getting-started/quick-start-guide/

// Google Codelabs inspired WCAG-compliant color palette
const SYNTAX_COLORS = {
  comment: '#5f6368',    // Muted gray
  keyword: '#186ddc', //'#1a73e8',    // Google Blue
  string: '#188038', //'#137333',     // Google Green
  number: '#ea4335',     // Google Red
  function: '#9334e6',   // Purple
  variable: '#202124',   // Dark gray
  operator: '#5f6368',   // Muted gray
  punctuation: '#202124', // Dark gray
};

const CODE_BLOCK_SELECTORS = [
  'pre code',
  '.codehilite pre',
  '.highlight pre code',
  'div[class*="language-"] pre code',
  'pre[class*="language-"] code',
  '.md-typeset .codehilite code',
  '.md-typeset .highlight code',
];

export const AccessibilityStylesAddon = () => {
  const codeBlocks = useShadowRootElements<HTMLElement>(CODE_BLOCK_SELECTORS);
  
  // Target copy buttons - since they're the only buttons in code blocks, we can use simple selectors
  const copyButtons = useShadowRootElements<HTMLButtonElement>([
    '.highlight button',
    '.codehilite button', 
    'pre button',
    'div[class*="language-"] button'
  ]);

  // Apply accessibility improvements to copy buttons
  useEffect(() => {
    copyButtons.forEach(button => {
      // Add aria-label if missing
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', 'Copy code to clipboard');
      }
      
      // Ensure proper button semantics
      if (!button.getAttribute('role')) {
        button.setAttribute('role', 'button');
      }
      
      // Ensure keyboard accessibility
      if (!button.getAttribute('tabindex') && button.tabIndex < 0) {
        button.setAttribute('tabindex', '0');
      }
      
      // Add consistent focus styling to match other buttons/links
      button.style.outline = 'none'; // Remove default outline
      button.addEventListener('focus', () => {
        button.style.border = '2px solid #013366';
        button.style.borderRadius = '4px';
      });
      
      button.addEventListener('blur', () => {
        button.style.border = '';
        button.style.borderRadius = '';
      });
    });
  }, [copyButtons]);

  useEffect(() => {
    codeBlocks.forEach(element => {
      // Skip if this is a line number element or inside one
      if (element.closest('.linenos') || element.closest('td.linenos') || 
          element.classList.contains('linenos') || element.classList.contains('lineno')) {
        return;
      }
      
      // Skip if this is an H4 or other heading element
      if (element.tagName.match(/^H[1-6]$/)) {
        return;
      }
      
      // Add background and border radius for better readability
      element.style.backgroundColor = '#f8f9fa';
      element.style.borderRadius = '8px';

      // Apply systematic syntax highlighting colors
      
      // Comments
      const commentElements = element.querySelectorAll('.c, .c1, .cm, .cp, .cs');
      commentElements.forEach(el => {
        (el as HTMLElement).style.color = SYNTAX_COLORS.comment;
      });

      // Keywords  
      const keywordElements = element.querySelectorAll('.k, .kw, .keyword, .kc, .kd, .kn, .kp, .kr, .kt');
      keywordElements.forEach(el => {
        (el as HTMLElement).style.color = SYNTAX_COLORS.keyword;
      });

      // Strings
      const stringElements = element.querySelectorAll('.s, .s1, .s2, .string, .sb, .sc, .sd, .se, .sh, .si, .sx');
      stringElements.forEach(el => {
        (el as HTMLElement).style.color = SYNTAX_COLORS.string;
      });

      // Numbers
      const numberElements = element.querySelectorAll('.m, .mi, .mf, .number, .mh, .mo');
      numberElements.forEach(el => {
        (el as HTMLElement).style.color = SYNTAX_COLORS.number;
      });

      // Functions
      const functionElements = element.querySelectorAll('.n, .nf, .function, .nc, .nd, .ne, .ni, .nl, .nx');
      functionElements.forEach(el => {
        (el as HTMLElement).style.color = SYNTAX_COLORS.function;
      });

      // Variables
      const variableElements = element.querySelectorAll('.nv, .variable, .nb, .bp');
      variableElements.forEach(el => {
        (el as HTMLElement).style.color = SYNTAX_COLORS.variable;
      });

      // Operators
      const operatorElements = element.querySelectorAll('.o, .operator, .ow');
      operatorElements.forEach(el => {
        (el as HTMLElement).style.color = SYNTAX_COLORS.operator;
      });

      // Punctuation
      const punctuationElements = element.querySelectorAll('.p, .punctuation');
      punctuationElements.forEach(el => {
        (el as HTMLElement).style.color = SYNTAX_COLORS.punctuation;
      });
    });
  }, [codeBlocks]);

  return null;
};
