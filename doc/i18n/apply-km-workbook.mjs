/**
 * Apply km-translation-workbook.json into babel/<repo>/<repo>-strings_km.json
 * and patch babel/_generated_development_strings/<repo>_all.json so unbuilt ?locale=km works.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const ROOT = path.resolve( __dirname, '../../..' );
const WORKBOOK = path.join( __dirname, 'km-translation-workbook.json' );
const USER_ID = 0; // local KruMath apply; not a PhET website translator id
const NOW = Date.now();

const workbook = JSON.parse( fs.readFileSync( WORKBOOK, 'utf8' ) );

/** @type {Record<string, Record<string, string>>} */
const byRepo = {};

for ( const entry of Object.values( workbook.strings ) ) {
  const km = entry.km && String( entry.km ).trim();
  if ( !km ) {
    continue;
  }
  if ( !entry.repo || !entry.sourceKey ) {
    continue;
  }
  byRepo[ entry.repo ] = byRepo[ entry.repo ] || {};
  byRepo[ entry.repo ][ entry.sourceKey ] = km;
}

function loadJson( file ) {
  if ( !fs.existsSync( file ) ) {
    return {};
  }
  return JSON.parse( fs.readFileSync( file, 'utf8' ) );
}

function writeJson( file, obj ) {
  fs.mkdirSync( path.dirname( file ), { recursive: true } );
  fs.writeFileSync( file, `${JSON.stringify( obj, null, 2 )}\n`, 'utf8' );
}

const summary = {};

for ( const [ repo, translations ] of Object.entries( byRepo ) ) {
  const babelFile = path.join( ROOT, 'babel', repo, `${repo}-strings_km.json` );
  const existing = loadJson( babelFile );

  for ( const [ sourceKey, km ] of Object.entries( translations ) ) {
    const prev = existing[ sourceKey ];
    if ( prev && typeof prev === 'object' && prev.value === km ) {
      // keep existing history
      continue;
    }
    const history = Array.isArray( prev?.history ) ? [ ...prev.history ] : [];
    history.push( {
      userId: USER_ID,
      timestamp: NOW,
      oldValue: prev?.value ?? '',
      newValue: km
    } );
    existing[ sourceKey ] = { value: km, history };
  }

  // Stable key order for diffs
  const ordered = {};
  for ( const key of Object.keys( existing ).sort() ) {
    ordered[ key ] = existing[ key ];
  }
  writeJson( babelFile, ordered );

  // Patch development conglomerate used by unbuilt load-unbuilt-strings.js
  const allFile = path.join( ROOT, 'babel', '_generated_development_strings', `${repo}_all.json` );
  const all = loadJson( allFile );
  const kmLocale = { ...( all.km || {} ) };
  for ( const [ sourceKey, km ] of Object.entries( translations ) ) {
    kmLocale[ sourceKey ] = { value: km };
  }
  all.km = kmLocale;
  writeJson( allFile, all );

  summary[ repo ] = {
    babelFile: path.relative( ROOT, babelFile ).replace( /\\/g, '/' ),
    keysApplied: Object.keys( translations ).length,
    babelTotalKeys: Object.keys( ordered ).length
  };
}

console.log( JSON.stringify( { ok: true, summary }, null, 2 ) );
