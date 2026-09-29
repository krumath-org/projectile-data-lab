// Copyright 2023-2026, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * KruMath localization: Kantumruy Pro for Khmer, home-screen EN/KM toggle, default locale km.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import './common/KhmerLocalizationSetup.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import HomeScreenView from '../../joist/js/HomeScreenView.js';
import localeProperty from '../../joist/js/i18n/localeProperty.js';
import Sim, { type SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import { combineOptions } from '../../phet-core/js/optionize.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import sceneryPhetQueryParameters from '../../scenery-phet/js/sceneryPhetQueryParameters.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import AudioPreferencesContentNode from './common/view/AudioPreferencesContentNode.js';
import SimulationPreferencesContentNode from './common/view/SimulationPreferencesContentNode.js';
import MeasuresScreen from './measures/MeasuresScreen.js';
import ProjectileDataLabStrings from './ProjectileDataLabStrings.js';
import './common/PDLQueryParameters.js';
import SamplingScreen from './sampling/SamplingScreen.js';
import SourcesScreen from './sources/SourcesScreen.js';
import VariabilityScreen from './variability/VariabilityScreen.js';

const KANTUMRUY = 'Kantumruy Pro';
const FONT_STACK = `"${KANTUMRUY}", Arial, sans-serif`;

const syncLocaleQueryParam = ( locale: string ): void => {
  const url = new URL( window.location.href );
  url.searchParams.set( 'locale', locale );
  window.history.replaceState( null, '', url.toString() );
};

const createLanguageSwitch = (): HBox => {
  const createLanguageButton = ( label: string, locale: 'km' | 'en', segment: 'left' | 'right' ): TextPushButton => {
    const isLeftSegment = segment === 'left';

    return new TextPushButton( label, {
      font: new PhetFont( { family: KANTUMRUY, size: 16, weight: 'bold' } ),
      textFill: 'white',
      minWidth: 84,
      minHeight: 40,
      xMargin: 14,
      yMargin: 8,
      baseColor: localeProperty.value === locale ? '#0a8f82' : '#3a4a4e',
      stroke: '#b7cbcb',
      lineWidth: 1.25,
      cornerRadius: 0,
      leftTopCornerRadius: isLeftSegment ? 20 : 0,
      leftBottomCornerRadius: isLeftSegment ? 20 : 0,
      rightTopCornerRadius: isLeftSegment ? 0 : 20,
      rightBottomCornerRadius: isLeftSegment ? 0 : 20,
      listener: () => {
        localeProperty.value = locale;
        syncLocaleQueryParam( locale );
      },
      tandem: Tandem.ROOT.createTandem( `languageSwitch${locale === 'km' ? 'Khmer' : 'English'}` )
    } );
  };

  const khmerButton = createLanguageButton( 'ខ្មែរ', 'km', 'left' );
  const englishButton = createLanguageButton( 'English', 'en', 'right' );

  localeProperty.link( locale => {
    khmerButton.baseColor = locale === 'km' ? '#0a8f82' : '#3a4a4e';
    englishButton.baseColor = locale === 'en' ? '#0a8f82' : '#3a4a4e';
  } );

  return new HBox( {
    children: [ khmerButton, englishButton ],
    spacing: 0
  } );
};

const launchSimulation = (): void => {
  sceneryPhetQueryParameters.fontFamily = FONT_STACK;
  ( HomeScreenView as { TITLE_FONT_FAMILY: string } ).TITLE_FONT_FAMILY = KANTUMRUY;

  // Default to Khmer unless the URL already requested another locale.
  const queryLocale = new URLSearchParams( window.location.search ).get( 'locale' );
  if ( !queryLocale ) {
    localeProperty.value = 'km';
    syncLocaleQueryParam( 'km' );
  }
  else if ( queryLocale === 'km' || queryLocale === 'en' ) {
    localeProperty.value = queryLocale;
  }

  const titleStringProperty = ProjectileDataLabStrings[ 'projectile-data-lab' ].titleStringProperty;

  const preferencesModel = new PreferencesModel( {
    simulationOptions: {
      customPreferences: [ {
        createContent: tandem => new SimulationPreferencesContentNode( tandem )
      } ]
    },
    audioOptions: {
      customPreferences: [
        {
          createContent: () => new Node()
        },
        {
          createContent: tandem => new AudioPreferencesContentNode( tandem )
        }
      ]
    }
  } );

  const screens = [
    new VariabilityScreen( { tandem: Tandem.ROOT.createTandem( 'variabilityScreen' ) } ),
    new SourcesScreen( { tandem: Tandem.ROOT.createTandem( 'sourcesScreen' ) } ),
    new MeasuresScreen( { tandem: Tandem.ROOT.createTandem( 'measuresScreen' ) } ),
    new SamplingScreen( { tandem: Tandem.ROOT.createTandem( 'samplingScreen' ) } )
  ];

  const simOptions: SimOptions = {
    credits: {
      leadDesign: 'Matthew Blackman',
      softwareDevelopment: 'Matthew Blackman, Sam Reid',
      team: 'Cathy Carter, Ariel Paul, Kathy Perkins, Amy Rouinfar',
      contributors: 'Kelly Findley',
      qualityAssurance: 'Kathryn Woessner, Nancy Salpepi, Jaron Droder, Clifford Hardin, Luisa Vargas',
      graphicArts: 'Mariah Hermsmeyer',
      soundDesign: 'Ashton Morris',
      thanks: 'Bill Finzer, Gayle Geschwind, Heather Lewandowski, Joey Liu'
    },
    preferencesModel: preferencesModel,
    phetioDesigned: true,
    homeScreenWarningNode: createLanguageSwitch()
  };

  const sim = new Sim( titleStringProperty, screens, combineOptions<SimOptions>( {}, simOptions ) );
  sim.start();
};

const kantumruyFont = new FontFace(
  KANTUMRUY,
  `url(${new URL( 'images/KantumruyProKhmer.woff2', window.location.href )})`,
  { weight: '100 900', unicodeRange: 'U+1780-17FF, U+19E0-19FF, U+200C-200D, U+25CC' }
);

kantumruyFont.load().then( loadedFont => {
  document.fonts.add( loadedFont );
  simLauncher.launch( launchSimulation );
} ).catch( error => {
  console.error( 'Unable to load Kantumruy Pro; launching with the default font.', error );
  simLauncher.launch( launchSimulation );
} );
