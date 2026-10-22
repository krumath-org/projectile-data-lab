// Copyright 2023-2026, University of Colorado Boulder

/**
 * The SamplingScreen represents the Sampling Screen for the Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import ComboBoxKeyboardHelpSection from '../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import Node from '../../../scenery/js/nodes/Node.js';
import PDLKeyboardHelpNode from '../common/view/PDLKeyboardHelpNode.js';
import PDLScreenIconFactory from '../common/view/PDLScreenIconFactory.js';
import ProjectileDataLabStrings from '../ProjectileDataLabStrings.js';
import SamplingModel from './model/SamplingModel.js';
import SamplingScreenView from './view/SamplingScreenView.js';

type SelfOptions = {

  // Optional node shown in the top-right corner of the screen view, see SamplingScreenView
  languageSwitchNode?: Node | null;

  // Horizontal alignment of the pause/speed controls below the histogram
  timeControlAlignment?: 'left' | 'right';
};

type SamplingScreenOptions = SelfOptions & ScreenOptions;

export default class SamplingScreen extends Screen<SamplingModel, SamplingScreenView> {

  public constructor( providedOptions: SamplingScreenOptions ) {

    const options = optionize<SamplingScreenOptions, SelfOptions, ScreenOptions>()( {
      name: ProjectileDataLabStrings.screen.samplingStringProperty,
      homeScreenIcon: PDLScreenIconFactory.createSamplingScreenIcon(),
      createKeyboardHelpNode: () => new PDLKeyboardHelpNode( false, false, [ new ComboBoxKeyboardHelpSection( {
        headingString: ProjectileDataLabStrings.keyboardHelpDialog.histogramBinControlsStringProperty
      } ) ], { hasShowField1Through6Shortcut: false } ),
      languageSwitchNode: null,
      timeControlAlignment: 'right'
    }, providedOptions );

    super(
      () => new SamplingModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new SamplingScreenView( model, {
        tandem: options.tandem.createTandem( 'view' ),
        languageSwitchNode: options.languageSwitchNode,
        timeControlAlignment: options.timeControlAlignment
      } ),
      options
    );
  }
}
