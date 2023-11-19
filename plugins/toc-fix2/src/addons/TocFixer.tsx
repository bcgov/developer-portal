import { useEffect } from 'react';
import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

// This AddOn performs the very specific function of removing a hardcoded local navigation / ToC from documentation pages.
// Specifically, source markdown files for the Private Cloud platform include an "On This Page" section that provides anchor links
// to section within each page. This is redundant since the dynamic right-hand sidebar ToC provides this already.
// At some point, we can remove the "on thi page" content from the source documents and this AddOn no longer be needed, but for now, this
// approach saves us from maintaining different versions of the content.
export const TocFixer = () => {
	/**
	 * The content we are twiddling looks like:
	 * <h2 id="on-this-page">On this page</h2>
	 *
	 * <ul>
	 *     <li>blah</li>
	 *     <li>blah</li>
	 *     <li>blah</li>
	 * </ul>
	 */
	const onThisPageHeading = useShadowRootElements<HTMLImageElement>(['h2#on-this-page']);
	const onThisPageList = useShadowRootElements<HTMLImageElement>(['h2#on-this-page + ul']);
	// to test in browser, something like this can be used: document.querySelector("[data-testid='techdocs-native-shadowroot']").shadowRoot.querySelectorAll('div[data-md-type="toc"] a[href*="on-this-page"]')
	const onThisPageHeadingInToc = useShadowRootElements<HTMLImageElement>(['div[data-md-type="toc"] a[href*="on-this-page"]'] );

	useEffect(() => {
		onThisPageHeading.forEach(match => {
			match.hidden = true;
		});
	}, [onThisPageHeading]);

	useEffect(() => {
		onThisPageList.forEach(match => {
			while (match.firstChild) {
				match.removeChild(match.firstChild);
			}
		});
	}, [onThisPageList]);

	useEffect(() => {
		onThisPageHeadingInToc.forEach(match => {
			const tocList = match.parentNode;
			tocList?.removeChild(match);
		});
	}, [onThisPageHeadingInToc]);

	// Nothing to render directly, so we can just return null.
	return null;
};
