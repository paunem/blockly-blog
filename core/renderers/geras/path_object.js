/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview An object that owns a block's rendering SVG elements.
 */

'use strict';

/**
 * An object that owns a block's rendering SVG elements.
 * @class
 */
goog.module('Blockly.geras.PathObject');

const colour = goog.require('Blockly.utils.colour');
const dom = goog.require('Blockly.utils.dom');
const object = goog.require('Blockly.utils.object');
/* eslint-disable-next-line no-unused-vars */
const {ConstantProvider} = goog.requireType('Blockly.geras.ConstantProvider');
const {PathObject: BasePathObject} = goog.require('Blockly.blockRendering.PathObject');
const {Svg} = goog.require('Blockly.utils.Svg');
/* eslint-disable-next-line no-unused-vars */
const {Theme} = goog.requireType('Blockly.Theme');


/**
 * An object that handles creating and setting each of the SVG elements
 * used by the renderer.
 * @param {!SVGElement} root The root SVG element.
 * @param {!Theme.BlockStyle} style The style object to use for
 *     colouring.
 * @param {!ConstantProvider} constants The renderer's constants.
 * @constructor
 * @extends {BasePathObject}
 * @package
 * @alias Blockly.geras.PathObject
 */
const PathObject = function(root, style, constants) {
  /**
   * The renderer's constant provider.
   * @type {!ConstantProvider}
   */
  this.constants = constants;

  this.svgRoot = root;

  // The order of creation for these next three matters, because that
  // effectively sets their z-indices.

  /**
   * The dark path of the block.
   * @type {SVGElement}
   * @package
   */
  this.svgPathDark = dom.createSvgElement(
      Svg.PATH, {'class': 'blocklyPathDark', 'transform': 'translate(1,1)'},
      this.svgRoot);

  /**
   * The primary path of the block.
   * @type {!SVGElement}
   * @package
   */
  this.svgPath =
      dom.createSvgElement(Svg.PATH, {'class': 'blocklyPath'}, this.svgRoot);

  /**
   * The light path of the block.
   * @type {SVGElement}
   * @package
   */
  this.svgPathLight = dom.createSvgElement(
      Svg.PATH, {'class': 'blocklyPathLight'}, this.svgRoot);

  /**
   * The colour of the dark path on the block in '#RRGGBB' format.
   * @type {string}
   * @package
   */
  this.colourDark = '#000000';

  /**
   * The style object to use when colouring block paths.
   * @type {!Theme.BlockStyle}
   * @package
   */
  this.style = style;
};
object.inherits(PathObject, BasePathObject);

/**
 * @override
 */
PathObject.prototype.setPath = function(mainPath) {
  this.svgPath.setAttribute('d', mainPath);
  this.svgPathDark.setAttribute('d', mainPath);
};

/**
 * Set the highlight path generated by the renderer onto the SVG element.
 * @param {string} highlightPath The highlight path.
 * @package
 */
PathObject.prototype.setHighlightPath = function(highlightPath) {
  this.svgPathLight.setAttribute('d', highlightPath);
};

/**
 * @override
 */
PathObject.prototype.flipRTL = function() {
  // Mirror the block's path.
  this.svgPath.setAttribute('transform', 'scale(-1 1)');
  this.svgPathLight.setAttribute('transform', 'scale(-1 1)');
  this.svgPathDark.setAttribute('transform', 'translate(1,1) scale(-1 1)');
};

/**
 * @override
 */
PathObject.prototype.applyColour = function(block) {
  this.svgPathLight.style.display = '';
  this.svgPathDark.style.display = '';
  this.svgPathLight.setAttribute('stroke', this.style.colourTertiary);
  this.svgPathDark.setAttribute('fill', this.colourDark);

  PathObject.superClass_.applyColour.call(this, block);

  this.svgPath.setAttribute('stroke', 'none');
};

/**
 * @override
 */
PathObject.prototype.setStyle = function(blockStyle) {
  this.style = blockStyle;
  this.colourDark =
      colour.blend('#000', this.style.colourPrimary, 0.2) || this.colourDark;
};

/**
 * @override
 */
PathObject.prototype.updateHighlighted = function(highlighted) {
  if (highlighted) {
    this.svgPath.setAttribute(
        'filter', 'url(#' + this.constants.embossFilterId + ')');
    this.svgPathLight.style.display = 'none';
  } else {
    this.svgPath.setAttribute('filter', 'none');
    this.svgPathLight.style.display = 'inline';
  }
};

/**
 * @override
 */
PathObject.prototype.updateShadow_ = function(shadow) {
  if (shadow) {
    this.svgPathLight.style.display = 'none';
    this.svgPathDark.setAttribute('fill', this.style.colourSecondary);
    this.svgPath.setAttribute('stroke', 'none');
    this.svgPath.setAttribute('fill', this.style.colourSecondary);
  }
};

/**
 * @override
 */
PathObject.prototype.updateDisabled_ = function(disabled) {
  PathObject.superClass_.updateDisabled_.call(this, disabled);
  if (disabled) {
    this.svgPath.setAttribute('stroke', 'none');
  }
};

exports.PathObject = PathObject;
