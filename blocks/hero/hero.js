import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero block — supports two different images (desktop + mobile) authored
 * as the first two cells, with the text/content in the third cell.
 *
 * Authoring order expected:
 *   Row 1: [ desktop image ] [ mobile image ] [ text content ]
 *
 * Only ONE image is actually downloaded by the browser, based on the
 * matching media query — not both, so there's no wasted bandwidth.
 */
export default function decorate(block) {
  const row = block.children[0];
  const [desktopCell, mobileCell, textCell] = [...row.children];

  const desktopImg = desktopCell?.querySelector('img');
  const mobileImg = mobileCell?.querySelector('img');

  // Guard: if authors haven't filled in both images yet, fall back
  // gracefully to whichever single image exists.
  if (!desktopImg && !mobileImg) return;

  const picture = document.createElement('picture');

  if (mobileImg) {
    // mobile-optimized rendition, shown below 600px
    const mobilePicture = createOptimizedPicture(mobileImg.src, mobileImg.alt || '', false, [{ width: '750' }]);
    const mobileSource = mobilePicture.querySelector('source');
    if (mobileSource) {
      mobileSource.media = '(max-width: 599px)';
      picture.append(mobileSource);
    }
  }

  if (desktopImg) {
    // desktop-optimized rendition, the default/fallback <img>
    const desktopPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt || '', true, [{ width: '2000' }]);
    const desktopSource = desktopPicture.querySelector('source');
    const finalImg = desktopPicture.querySelector('img');

    if (desktopSource) {
      desktopSource.media = '(min-width: 600px)';
      picture.append(desktopSource);
    }
    picture.append(finalImg);
  } else if (mobileImg) {
    // no desktop image authored — reuse mobile image as the fallback <img>
    const fallbackImg = document.createElement('img');
    fallbackImg.src = mobileImg.src;
    fallbackImg.alt = mobileImg.alt || '';
    fallbackImg.loading = 'eager';
    picture.append(fallbackImg);
  }

  // Build the final hero markup: one <picture>, wrapped in a media div,
  // plus the text content cell as an overlay/content area.
  const mediaWrapper = document.createElement('div');
  mediaWrapper.className = 'hero-media';
  mediaWrapper.append(picture);

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-content';
  if (textCell) {
    contentWrapper.append(...textCell.childNodes);
  }

  block.replaceChildren(mediaWrapper, contentWrapper);
}
