// Copyright 2023-2026, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Range from '../../../dot/js/Range.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';

const MAX_FIELD_DISTANCE = 100;
const FIELD_WIDTH = 850;
const PIXELS_TO_DISTANCE = FIELD_WIDTH / MAX_FIELD_DISTANCE;

const minAngleStandardDeviation = 0.2; // degrees
const maxAngleStandardDeviation = 5; // degrees

const PDLConstants = {

  MAX_PROJECTILES_VSM_FIELD_DEFAULT: 500,

  SCREEN_VIEW_X_MARGIN: 8,
  SCREEN_VIEW_Y_MARGIN: 8,
  BOTTOM_UI_HEIGHT: 55,
  INTER_PANEL_SPACING: 5,
  BOTTOM_UI_SPACING: 20,
  TIME_CONTROL_MARGIN_TOP: 5,

  MINIMUM_TIME_BETWEEN_LAUNCHES: 0.7, // seconds

  ANGLE_STANDARD_DEVIATION_RANGE: new Range( minAngleStandardDeviation, maxAngleStandardDeviation ),

  // In field units
  MAX_FIELD_DISTANCE: MAX_FIELD_DISTANCE,
  RAISED_LAUNCHER_HEIGHT: 12,
  FREEFALL_ACCELERATION: 9.81,
  FIELD_LABEL_INCREMENT: 10,

  // In view units
  FIELD_CENTER_OFFSET_X: 44,
  FIELD_CENTER_Y: 510,
  FIELD_HEIGHT: 35,
  FIELD_WIDTH: FIELD_WIDTH,
  FIELD_BORDER_LINE_WIDTH: 2,
  FIELD_CENTER_LINE_WIDTH: 2,
  FIELD_LINE_WIDTH: 1.5,
  FIELD_LINE_NUMBERED_WIDTH: 2,
  FIELD_LABEL_TOP_MARGIN: 1,
  VSM_FIELD_SIGN_X: 88,
  SAMPLING_FIELD_SIGN_X: 88,
  FIELD_SIGN_CENTER_Y: 458,
  FIELD_SIGN_PROJECTILE_SELECTOR_SEPARATION: 8,
  HISTOGRAM_PANEL_MARGIN: 5,

  // Horizontal scaling controls the amount of x-offset applied to each point for the perspective transformation.
  // FIELD_SCALING_FACTOR_HORIZONTAL can be any value between 0-Number.POSITIVE_INFINITY.
  // 0 would mean the left and right edges are parallel.
  // The larger the value, the more the left and right edges angle inward.
  // The value represents the maximum x-offset of points furthest from the center.
  FIELD_SCALING_FACTOR_HORIZONTAL: 18,

  // Vertical scaling controls the amount of "squishing" for the perspective transformation.
  // FIELD_SCALING_FACTOR_VERTICAL must be between 0-1.
  // 0 means the top and bottom halves of the same field have the same height.
  // 1 means the entire field is shown below the center line.
  FIELD_SCALING_FACTOR_VERTICAL: 0.2,

  PIXELS_TO_DISTANCE: PIXELS_TO_DISTANCE,

  // The factor multiple for time speed in 'Fast' mode
  TIME_SPEED_FAST: 6,

  // The projectile source images are scaled by this factor when drawing them on the canvas
  PROJECTILE_IMAGE_SCALE_FACTOR: 0.15,

  HEATMAP_TOOL_LABEL_FONT: new PhetFont( { size: 11 } ),
  PRIMARY_FONT: new PhetFont( { size: 14 } ),
  LAUNCH_MODE_FONT: new PhetFont( { size: 15 } ),
  HISTOGRAM_AXIS_LABEL_FONT: new PhetFont( { size: 15 } ),
  FIELD_LABEL_FONT: new PhetFont( { size: 15 } ),
  VSM_FIELD_SIGN_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  SAMPLING_FIELD_SIGN_FONT: new PhetFont( { size: 14, weight: 'bold' } ),
  LAUNCH_CONTROL_FONT: new PhetFont( { size: 15 } ),
  NO_AIR_RESISTANCE_FONT: new PhetFont( { size: 15 } ),
  MEASURING_TAPE_FONT: new PhetFont( { size: 13, weight: 'bold' } ),
  INTERVAL_TOOL_FONT: new PhetFont( { size: 13 } ),
  SELECTOR_FONT: new PhetFont( { size: 14 } ),
  HISTOGRAM_PANEL_FONT: new PhetFont( { size: 12 } ),
  SAMPLING_HISTOGRAM_PANEL_FONT: new PhetFont( { size: 13 } ),

  // Allow the top content to go above the dev bounds, but not too far
  ABOVE_DEV_BOUNDS_TOP: -200,

  VERTICAL_CHECKBOX_GROUP_CHECKBOX_WIDTH: 14
} as const;

// Implementation detail about AUTO_GENERATE_DATA_PROPERTY to get a performance boost by avoiding unnecessary intermediate work
const IS_CURRENTLY_AUTO_GENERATING_DATA_PROPERTY = new BooleanProperty( false );
export { IS_CURRENTLY_AUTO_GENERATING_DATA_PROPERTY };

export default PDLConstants;
