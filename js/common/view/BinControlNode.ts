// Copyright 2023-2026, University of Colorado Boulder

/**
 * BinControlNode toggles between showing the bin width combo box and the total bins combo boxes, based on the user's
 * preference.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLPreferences from '../PDLPreferences.js';
import PDLText from './PDLText.js';

type SelfOptions = EmptySelfOptions;
type BinControlNodeOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

export default class BinControlNode extends HBox {
  public constructor( comboBoxParent: Node,
                      selectedBinWidthProperty: Property<number>,
                      selectedTotalBinsProperty: Property<number>,
                      providedOptions: BinControlNodeOptions ) {

    const margin = 8;

    // The bin width and total bins combo boxes are created here since they require a listParent, and hence cannot
    // be constructed in HistogramNode (which must be constructed before the listParent is created).
    class BinWidthComboBox extends ComboBox<number> {
      public constructor() {
        const validBinWidths = selectedBinWidthProperty.validValues ?? [];
        const comboBoxItems = validBinWidths.map( binWidth => {

          const binWidthName = binWidth === 0.5 ? 'half' : binWidth;
          return {
            value: binWidth,
            createNode: () => new PDLText( new PatternStringProperty( ProjectileDataLabStrings.binWidthMPatternStringProperty, {
              binWidth: binWidth
            } ), {
              maxWidth: 70
            } ),
            tandemName: `binWidth${binWidthName}Item`
          };
        } );
        super( selectedBinWidthProperty, comboBoxItems, comboBoxParent, {
          listPosition: 'below',
          tandem: providedOptions.tandem.createTandem( 'binWidthComboBox' ),
          phetioVisiblePropertyInstrumented: false
        } );
      }
    }

    class TotalBinsComboBox extends ComboBox<number> {
      public constructor() {
        const comboBoxItems = ( selectedTotalBinsProperty.validValues ?? [] ).map( totalBins => {
          return {
            value: totalBins,
            createNode: () => new PDLText( Utils.toFixed( totalBins, 0 ), {
              maxWidth: 70
            } ),
            tandemName: `totalBins${totalBins}Item`
          };
        } );
        super( selectedTotalBinsProperty, comboBoxItems, comboBoxParent, {
          listPosition: 'below',
          tandem: selectedTotalBinsProperty.isPhetioInstrumented() ? providedOptions.tandem.createTandem( 'totalBinsComboBox' ) : Tandem.OPT_OUT,
          phetioVisiblePropertyInstrumented: false
        } );
      }
    }

    const options = optionize<BinControlNodeOptions, SelfOptions, HBoxOptions>()( {
      align: 'center',
      children: [

        // Use a separate ToggleNode for each one, so they don't change position on the screen when changing between
        // strategies

        // The label: 'Bin width' or 'Total bins'
        // Khmer strings are much longer than English; a tight maxWidth scales the text down.
        // Only widen these labels — do not change shared PDLConstants fonts.
        new ToggleNode( PDLPreferences.binStrategyProperty, [ {
          value: 'binWidth',
          createNode: () => new PDLText( ProjectileDataLabStrings.binWidthStringProperty, {
            maxWidth: 150
          } )
        }, {
          value: 'totalBins',
          createNode: () => new PDLText( ProjectileDataLabStrings.totalBinsStringProperty, {
            maxWidth: 150
          } )
        } ], {
          alignChildren: ToggleNode.RIGHT,
          layoutOptions: {
            rightMargin: margin
          }
        } ),

        // The combo box
        new ToggleNode( PDLPreferences.binStrategyProperty, [ {
          value: 'binWidth',
          createNode: () => new BinWidthComboBox()
        }, {
          value: 'totalBins',
          createNode: () => new TotalBinsComboBox()
        } ], {
          alignChildren: ToggleNode.LEFT,
          layoutOptions: {
            rightMargin: margin
          }
        } )
      ]
    }, providedOptions );

    super( options );
  }
}
