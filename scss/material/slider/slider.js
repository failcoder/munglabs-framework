/**
 * @license
 * Copyright 2015 failcoder Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Class constructor for Slider component.
 * Implements component design pattern defined at:
 * https://github.com/jasonmayes/component-design-pattern
 * @param {HTMLElement} element The element that will be upgraded.
 */
function ffSlider(element) {
  'use strict';

  this.element_ = element;
  // Browser feature detection.
  this.isIE_ = window.navigator.msPointerEnabled;
  // Initialize instance.
  this.init();
}

/**
 * Store constants in one place so they can be updated easily.
 * @enum {string | number}
 * @private
 */
ffSlider.prototype.Constant_ = {
  // None for now.
};

/**
 * Store strings for class names defined by this component that are used in
 * JavaScript. This allows us to simply change it in one place should we
 * decide to modify at a later date.
 * @enum {string}
 * @private
 */
ffSlider.prototype.CssClasses_ = {
  IE_CONTAINER: 'slider__ie-container',
  SLIDER_CONTAINER: 'slider__container',
  BACKGROUND_FLEX: 'slider__background-flex',
  BACKGROUND_LOWER: 'slider__background-lower',
  BACKGROUND_UPPER: 'slider__background-upper',
  IS_LOWEST_VALUE: 'is-lowest-value',
  IS_UPGRADED: 'is-upgraded'
};

/**
 * Handle input on element.
 * @param {Event} event The event that fired.
 * @private
 */
ffSlider.prototype.onInput_ = function(event) {
  'use strict';

  this.updateValueStyles_();
};

/**
 * Handle change on element.
 * @param {Event} event The event that fired.
 * @private
 */
ffSlider.prototype.onChange_ = function(event) {
  'use strict';

  this.updateValueStyles_();
};

/**
 * Handle mouseup on element.
 * @param {Event} event The event that fired.
 * @private
 */
ffSlider.prototype.onMouseUp_ = function(event) {
  'use strict';

  event.target.blur();
};

/**
 * Handle mousedown on container element.
 * This handler is purpose is to not require the use to click
 * exactly on the 2px slider element, as FireFox seems to be very
 * strict about this.
 * @param {Event} event The event that fired.
 * @private
 */
ffSlider.prototype.onContainerMouseDown_ = function(event) {
  'use strict';

  // If this click is not on the parent element (but rather some child)
  // ignore. It may still bubble up.
  if (event.target !== this.element_.parentElement) {
    return;
  }

  // Discard the original event and create a new event that
  // is on the slider element.
  event.preventDefault();
  var newEvent = new MouseEvent('mousedown', {
    target: event.target,
    buttons: event.buttons,
    clientX: event.clientX,
    clientY: this.element_.getBoundingClientRect().y
  });
  this.element_.dispatchEvent(newEvent);
};

/**
 * Handle updating of values.
 * @param {Event} event The event that fired.
 * @private
 */
ffSlider.prototype.updateValueStyles_ = function(event) {
  'use strict';

  // Calculate and apply percentages to div structure behind slider.
  var fraction = (this.element_.value - this.element_.min) /
      (this.element_.max - this.element_.min);

  if (fraction === 0) {
    this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
  } else {
    this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
  }

  if (!this.isIE_) {
    this.backgroundLower_.style.flex = fraction;
    this.backgroundLower_.style.webkitFlex = fraction;
    this.backgroundUpper_.style.flex = 1 - fraction;
    this.backgroundUpper_.style.webkitFlex = 1 - fraction;
  }
};

// Public methods.

/**
 * Disable slider.
 * @public
 */
ffSlider.prototype.disable = function() {
  'use strict';

  this.element_.disabled = true;
};

/**
 * Enable slider.
 * @public
 */
ffSlider.prototype.enable = function() {
  'use strict';

  this.element_.disabled = false;
};

/**
 * Update slider value.
 * @param {Number} value The value to which to set the control (optional).
 * @public
 */
ffSlider.prototype.change = function(value) {
  'use strict';

  if (typeof value !== 'undefined') {
    this.element_.value = value;
  }
  this.updateValueStyles_();
};

/**
 * Initialize element.
 */
ffSlider.prototype.init = function() {
  'use strict';

  if (this.element_) {
    if (this.isIE_) {
      // Since we need to specify a very large height in IE due to
      // implementation limitations, we add a parent here that trims it down to
      // a reasonable size.
      var containerIE = document.createElement('div');
      containerIE.classList.add(this.CssClasses_.IE_CONTAINER);
      this.element_.parentElement.insertBefore(containerIE, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      containerIE.appendChild(this.element_);
    } else {
      // For non-IE browsers, we need a div structure that sits behind the
      // slider and allows us to style the left and right sides of it with
      // different colors.
      var container = document.createElement('div');
      container.classList.add(this.CssClasses_.SLIDER_CONTAINER);
      this.element_.parentElement.insertBefore(container, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      container.appendChild(this.element_);
      var backgroundFlex = document.createElement('div');
      backgroundFlex.classList.add(this.CssClasses_.BACKGROUND_FLEX);
      container.appendChild(backgroundFlex);
      this.backgroundLower_ = document.createElement('div');
      this.backgroundLower_.classList.add(this.CssClasses_.BACKGROUND_LOWER);
      backgroundFlex.appendChild(this.backgroundLower_);
      this.backgroundUpper_ = document.createElement('div');
      this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER);
      backgroundFlex.appendChild(this.backgroundUpper_);
    }

    this.boundInputHandler = this.onInput_.bind(this);
    this.boundChangeHandler = this.onChange_.bind(this);
    this.boundMouseUpHandler = this.onMouseUp_.bind(this);
    this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
    this.element_.addEventListener('input', this.boundInputHandler);
    this.element_.addEventListener('change', this.boundChangeHandler);
    this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
    this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler);

    this.updateValueStyles_();
    this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
  }
};

/*
* Downgrade the component
*/
ffSlider.prototype.coreDowngrade_ = function() {
  'use strict';
  this.element_.removeEventListener('input', this.boundInputHandler);
  this.element_.removeEventListener('change', this.boundChangeHandler);
  this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
  this.element_.parentElement.removeEventListener('mousedown', this.boundContainerMouseDownHandler);
};

// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
  constructor: ffSlider,
  classAsString: 'ffSlider',
  cssClass: 'js-slider',
  widget: true
});
