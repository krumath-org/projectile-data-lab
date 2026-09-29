// Copyright 2026, University of Colorado Boulder

/**
 * Early Khmer defaults — import this first from the sim main entry.
 * Sets locale=km (unless URL already has locale) and Kantumruy Pro font family
 * BEFORE any other sim module constructs PhetFont instances.
 *
 * @author KruMath
 */

import sceneryPhetQueryParameters from '../../../scenery-phet/js/sceneryPhetQueryParameters.js';

const KANTUMRUY_FONT_STACK = '"Kantumruy Pro", Arial';

// Must run before PDLConstants / other modules call `new PhetFont(...)`.
sceneryPhetQueryParameters.fontFamily = KANTUMRUY_FONT_STACK;

const query = new URLSearchParams( window.location.search );

if ( !query.has( 'locale' ) ) {
  window.phet.chipper.locale = 'km';
  query.set( 'locale', 'km' );
  const search = query.toString();
  window.history.replaceState( null, '', `${window.location.pathname}?${search}${window.location.hash}` );
}
