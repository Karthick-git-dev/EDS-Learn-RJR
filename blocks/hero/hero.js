// blocks/hero/hero.js
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const row = block.children[0];
  const [desktopCell, mobileCell, textCell] = [...row.children];

  const desktopImg = desktopCell.querySelector('img');
  const mobileImg = mobileCell.querySelector('img');

  // build optimized picture for each
  const desktopPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt, true, [{ width: '1200' }]);
  const mobilePicture = createOptimizedPicture(mobileImg.src, mobileImg.alt, true, [{ width: '600' }]);

  desktopPicture.classList.add('hero-desktop-image');
  mobilePicture.classList.add('hero-mobile-image');

  desktopCell.replaceChildren(desktopPicture);
  mobileCell.replaceChildren(mobilePicture);
  mobileCell.classList.add('hero-mobile-cell');
  desktopCell.classList.add('hero-desktop-cell');
}
