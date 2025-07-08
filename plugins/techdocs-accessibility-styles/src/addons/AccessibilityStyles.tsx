import { useEffect } from 'react';
import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

// It looks like there's a MkDocs bug that doesn't parse React code blocks corrently, specifically the closing tags, example:
// https://developer.gov.bc.ca/docs/default/component/citz-imb-sso-react-npm-package/getting-started/quick-start-guide/

const SYNTAX_COLORS = {
  JSName: '#d4396d' // Accessibility Insights for Web recommended color for minimal difference
};

const CODE_BLOCK_SELECTORS = [
  'div[class*="language-"] pre code',
];

export const AccessibilityStylesAddon = () => {
  const codeBlocks = useShadowRootElements<HTMLElement>(CODE_BLOCK_SELECTORS);
  
  useEffect(() => {
    codeBlocks.forEach(element => {

      // Variables - Name.Other: 'nx'
      const variableElements = element.querySelectorAll('.nx');
      variableElements.forEach(el => {
        (el as HTMLElement).style.color = SYNTAX_COLORS.JSName;
      });

    });
  }, [codeBlocks]);

  // Target copy buttons - since they're the only buttons in code blocks, we can use simple selectors
  const copyButtons = useShadowRootElements<HTMLButtonElement>([
    'div[class*="language-"] button'
  ]);

  // Apply accessibility improvements to copy buttons
  useEffect(() => {
    const focusHandler = (event: Event) => {
      const button = event.target as HTMLButtonElement;
      button.style.border = '2px solid #013366';
      button.style.borderRadius = '4px';
    };
    
    const blurHandler = (event: Event) => {
      const button = event.target as HTMLButtonElement;
      button.style.border = '';
      button.style.borderRadius = '';
    };

    copyButtons.forEach(button => {
      // Add aria-label if missing
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', 'Copy code to clipboard');
      }
      
      // Add consistent focus styling to match other buttons/links
      button.addEventListener('focus', focusHandler);
      button.addEventListener('blur', blurHandler);
    });

    // Cleanup function to remove event listeners
    return () => {
      copyButtons.forEach(button => {
        button.removeEventListener('focus', focusHandler);
        button.removeEventListener('blur', blurHandler);
      });
    };
  }, [copyButtons]);

  return null;
};
