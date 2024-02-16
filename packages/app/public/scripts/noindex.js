function shouldNotIndex() {
  return window.location.host !== 'developer.gov.bc.ca';
}

function addMetaTag() {
  const metaTag = document.createElement('meta');
  metaTag.setAttribute('name', 'robots');
  metaTag.setAttribute('content', 'noindex');
  document.head.appendChild(metaTag);
}

function addNoIndexMetaTag() {
  if (shouldNotIndex()) {
    addMetaTag();
  }
}

document.addEventListener('DOMContentLoaded', addNoIndexMetaTag);
