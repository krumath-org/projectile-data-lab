/**
 * Generates a VISUAL-UI-ONLY Khmer translation workbook for Projectile Data Lab.
 * Excludes screen-reader (a11y) strings, unused library demos/units, and backend-only text.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const ROOT = path.resolve( __dirname, '../../..' );
const OUT_DIR = __dirname;
const PSD_WB = path.resolve(
  ROOT,
  '../projectile-sampling-distributions/projectile-sampling-distributions/doc/i18n/km-translation-workbook.json'
);

function flatten( obj, prefix = '', out = {} ) {
  for ( const [ k, v ] of Object.entries( obj ) ) {
    const key = prefix ? `${prefix}.${k}` : k;
    if ( v && typeof v === 'object' && typeof v.value === 'string' ) {
      out[ key ] = v.value;
    }
    else if ( v && typeof v === 'object' && !Array.isArray( v ) ) {
      flatten( v, key, out );
    }
  }
  return out;
}

function loadFlat( file ) {
  return flatten( JSON.parse( fs.readFileSync( file, 'utf8' ) ) );
}

function loadKmBabel( repo ) {
  const p = path.join( ROOT, `babel/${repo}/${repo}-strings_km.json` );
  if ( !fs.existsSync( p ) ) {
    return {};
  }
  return flatten( JSON.parse( fs.readFileSync( p, 'utf8' ) ) );
}

const pdl = loadFlat( path.join( ROOT, 'projectile-data-lab/projectile-data-lab-strings_en.json' ) );
const joist = loadFlat( path.join( ROOT, 'joist/joist-strings_en.json' ) );
const sceneryPhet = loadFlat( path.join( ROOT, 'scenery-phet/scenery-phet-strings_en.json' ) );

// Prefill from PSD workbook + babel
const psdByKey = {};
const psdByEn = {};
if ( fs.existsSync( PSD_WB ) ) {
  const psd = JSON.parse( fs.readFileSync( PSD_WB, 'utf8' ) );
  for ( const [ k, v ] of Object.entries( psd.strings || {} ) ) {
    if ( v && typeof v.km === 'string' && v.km.trim() ) {
      psdByKey[ k ] = v.km;
      if ( v.en ) {
        psdByEn[ v.en ] = v.km;
      }
    }
  }
}

/** @type {{ workbookKey: string, sourceKey: string, en: string, group: string, repo: string }[]} */
const include = [];

// 1) All sim strings — students see these on every screen / Preferences Simulation+Audio tabs
for ( const [ sourceKey, en ] of Object.entries( pdl ) ) {
  include.push( {
    workbookKey: sourceKey,
    sourceKey,
    en,
    group: 'sim-content',
    repo: 'projectile-data-lab'
  } );
}

// 2) Joist chrome students can open: Preferences, Keyboard Shortcuts title, PhET menu, About/Credits
const JOIST_VISIBLE = [
  'keyboardShortcuts.title',
  'preferences.title',
  'preferences.tabs.overview.title',
  'preferences.tabs.general.accessibilityIntro',
  'preferences.tabs.general.moreAccessibility',
  'preferences.tabs.simulation.title',
  'preferences.tabs.visual.title',
  'preferences.tabs.visual.interactiveHighlights',
  'preferences.tabs.visual.interactiveHighlightsDescription',
  'preferences.tabs.audio.title',
  'preferences.tabs.audio.sounds.title',
  'preferences.tabs.audio.audioFeatures.title',
  'preferences.tabs.audio.sounds.description',
  'preferences.tabs.localization.title',
  'preferences.tabs.localization.languageSelection.title',
  'preferences.tabs.localization.languageSelection.description',
  'done',
  'menuItem.options',
  'menuItem.about',
  'menuItem.outputLog',
  'menuItem.phetWebsite',
  'menuItem.reportAProblem',
  'menuItem.screenshot',
  'menuItem.fullscreen',
  'menuItem.getUpdate',
  'menuItem.enhancedSound',
  'title.settings',
  'showPointers',
  'termsPrivacyAndLicensing',
  'privacyPolicy',
  'donateToPhet',
  'options.title',
  'license.title',
  'credits.title',
  'credits.leadDesign',
  'credits.softwareDevelopment',
  'credits.team',
  'credits.contributors',
  'credits.qualityAssurance',
  'credits.graphicArts',
  'credits.soundDesign',
  'credits.translation',
  'credits.thanks',
  'versionPattern',
  'updates.upToDate',
  'updates.outOfDate',
  'updates.checking',
  'updates.offline',
  'updates.newVersionAvailable',
  'updates.yourCurrentVersion',
  'updates.getUpdate',
  'updates.noThanks',
  'translation.credits.link',
  'thirdParty.credits.link'
];

for ( const sourceKey of JOIST_VISIBLE ) {
  if ( !( sourceKey in joist ) ) {
    console.warn( `Missing joist key: ${sourceKey}` );
    continue;
  }
  const isPrefsOrKeyboard =
    sourceKey.startsWith( 'preferences' ) || sourceKey === 'keyboardShortcuts.title';
  include.push( {
    workbookKey: sourceKey,
    sourceKey,
    en: joist[ sourceKey ],
    group: isPrefsOrKeyboard ? 'framework-visible' : 'framework-dialogs',
    repo: 'joist'
  } );
}

// 3) Scenery-phet: speed labels + keyboard-help text that appears in the Shortcuts dialog
//    Exclude faucet/heat-cool (not in this sim). Skip Latin letter/digit key glyphs (A–Z, 0–9).
const SP_SPEED = [ 'speed.normal', 'speed.slow', 'speed.fast' ];
const SP_KEY_NAMES = [
  'key.tab', 'key.shift', 'key.alt', 'key.option', 'key.capsLock', 'key.enter', 'key.return',
  'key.backspace', 'key.delete', 'key.space', 'key.esc', 'key.fn', 'key.pageUp', 'key.pageDown',
  'key.home', 'key.end', 'key.toGrabOrRelease'
];

const SP_KEYBOARD_HELP_EXCLUDE_PREFIXES = [
  'keyboardHelpDialog.faucetControls.',
  'keyboardHelpDialog.heatCoolControls'
];

for ( const sourceKey of [ ...SP_SPEED, ...SP_KEY_NAMES ] ) {
  if ( !( sourceKey in sceneryPhet ) ) {
    console.warn( `Missing scenery-phet key: ${sourceKey}` );
    continue;
  }
  include.push( {
    workbookKey: sourceKey,
    sourceKey,
    en: sceneryPhet[ sourceKey ],
    group: 'framework-visible',
    repo: 'scenery-phet'
  } );
}

for ( const [ sourceKey, en ] of Object.entries( sceneryPhet ) ) {
  if ( !sourceKey.startsWith( 'keyboardHelpDialog.' ) ) {
    continue;
  }
  if ( SP_KEYBOARD_HELP_EXCLUDE_PREFIXES.some( p => sourceKey.startsWith( p ) || sourceKey === p ) ) {
    continue;
  }
  include.push( {
    workbookKey: sourceKey,
    sourceKey,
    en,
    group: 'framework-visible',
    repo: 'scenery-phet'
  } );
}

// Build workbook entries
const babelCache = {
  'projectile-data-lab': loadKmBabel( 'projectile-data-lab' ),
  joist: loadKmBabel( 'joist' ),
  'scenery-phet': loadKmBabel( 'scenery-phet' )
};

const strings = {};
const byRepo = {};
const byGroup = {};

for ( const item of include ) {
  const babelKm = babelCache[ item.repo ]?.[ item.sourceKey ] || '';
  let km = babelKm || psdByKey[ item.sourceKey ] || '';
  if ( !km && item.en.length > 12 && psdByEn[ item.en ] ) {
    km = psdByEn[ item.en ];
  }

  const entry = {
    en: item.en,
    km,
    group: item.group,
    repo: item.repo,
    sourceKey: item.sourceKey,
    babelTargetFile: `babel/${item.repo}/${item.repo}-strings_km.json`
  };
  if ( babelKm ) {
    entry.kmExists = true;
  }

  strings[ item.workbookKey ] = entry;
  byRepo[ item.repo ] = ( byRepo[ item.repo ] || 0 ) + 1;
  byGroup[ item.group ] = ( byGroup[ item.group ] || 0 ) + 1;
}

const totalStrings = Object.keys( strings ).length;
const withKm = Object.values( strings ).filter( s => s.km && String( s.km ).trim() ).length;

const workbook = {
  _README: [
    'Khmer (km) translation workbook — "Projectile Data Lab" PhET simulation.',
    '',
    'SCOPE: ONLY on-screen UI text Cambodian students can see:',
    '  - Sim screens, controls, and Simulation/Audio Preferences',
    '  - Preferences / Settings tabs (Visual, Audio, Localization, …)',
    '  - PhET menu, About / Credits / License / Updates dialogs',
    '  - Keyboard Shortcuts dialog headings and labels',
    '  - Speed labels (Normal / Slow / Fast)',
    '',
    'REMOVED (not translated here):',
    '  - Screen-reader / a11y-only strings (not visible on screen)',
    '  - Unused shared-library demos, unit catalogs, backend/PhET-iO text',
    '  - Hardcoded accessible names that never appear as visible labels',
    '',
    'HOW TO USE:',
    '  1. Read the "en" (English) value.',
    '  2. Type the Khmer translation into the "km" field.',
    '  3. Leaving "km" empty keeps that string in English.',
    '  4. Send this file back and the translations get applied into the codebase.',
    '',
    'IMPORTANT — placeholders:',
    '  Keep every {{...}} and {0}/{1}/... token exactly as-is.',
    '',
    'NOTES:',
    '  - Do NOT rename any keys.',
    '  - Some "km" values are prefilled from your Projectile Sampling Distributions workbook — please review.',
    '  - On return, non-empty km values go to babel/<repo>/<repo>-strings_km.json',
    '  - Full inventory (including unused) is kept separately as km-full-string-inventory-reference.json'
  ],
  _meta: {
    project: 'Projectile Data Lab',
    locale: 'km',
    localeName: 'Khmer',
    generated: '2026-09-29',
    scope: 'visual-ui-only',
    totalStrings,
    alreadyTranslated: withKm,
    remaining: totalStrings - withKm,
    byGroup,
    byRepo
  },
  strings
};

fs.mkdirSync( OUT_DIR, { recursive: true } );
fs.writeFileSync(
  path.join( OUT_DIR, 'km-translation-workbook.json' ),
  `${JSON.stringify( workbook, null, 2 )}\n`,
  'utf8'
);

console.log( JSON.stringify( {
  totalStrings,
  withKm,
  remaining: totalStrings - withKm,
  byGroup,
  byRepo
}, null, 2 ) );
