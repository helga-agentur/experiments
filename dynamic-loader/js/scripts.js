import compareDocument from './compareDocs.js';
import handleNavigation from './handleNavigation.js';
// Make publicly available as modules can only be imported once – while we need the init
// method to fire on every load
window.compareDocument = compareDocument;
window.handleNavigation = handleNavigation;

