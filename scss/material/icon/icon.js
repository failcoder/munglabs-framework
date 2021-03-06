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
 * Class constructor for icon toggle component.
 * Implements component design pattern defined at:
 * https://github.com/jasonmayes/component-design-pattern
 * @param {HTMLElement} element The element that will be upgraded.
 */
function ffIconToggle(element) {
  'use strict';

  this.element_ = element;

  // Initialize instance.
  this.init();
}

/**
 * Store constants in one place so they can be updated easily.
 * @enum {string | number}
 * @private
 */
ffIconToggle.prototype.Constant_ = {
  TINY_TIMEOUT: 0.001
};

/**
 * Store strings for class names defined by this component that are used in
 * JavaScript. This allows us to simply change it in one place should we
 * decide to modify at a later date.
 * @enum {string}
 * @private
 */
ffIconToggle.prototype.CssClasses_ = {
  INPUT: 'icon-input',
  JS_RIPPLE_EFFECT: 'js-ripple-effect',
  RIPPLE_IGNORE_EVENTS: 'js-ripple-effect--ignore-events',
  RIPPLE_CONTAINER: 'icon-ripple',
  RIPPLE_CENTER: 'ripple--center',
  RIPPLE: 'ripple',
  IS_FOCUSED: 'is-focused',
  IS_DISABLED: 'is-disabled',
  IS_CHECKED: 'is-checked'
};

/**
 * Handle change of state.
 * @param {Event} event The event that fired.
 * @private
 */
ffIconToggle.prototype.onChange_ = function(event) {
  'use strict';

  this.updateClasses_();
};

/**
 * Handle focus of element.
 * @param {Event} event The event that fired.
 * @private
 */
ffIconToggle.prototype.onFocus_ = function(event) {
  'use strict';

  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};

/**
 * Handle lost focus of element.
 * @param {Event} event The event that fired.
 * @private
 */
ffIconToggle.prototype.onBlur_ = function(event) {
  'use strict';

  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};

/**
 * Handle mouseup.
 * @param {Event} event The event that fired.
 * @private
 */
ffIconToggle.prototype.onMouseUp_ = function(event) {
  'use strict';

  this.blur_();
};

/**
 * Handle class updates.
 * @param {HTMLElement} button The button whose classes we should update.
 * @param {HTMLElement} label The label whose classes we should update.
 * @private
 */
ffIconToggle.prototype.updateClasses_ = function() {
  'use strict';
  this.checkDisabled();
  this.checkToggleState();
};

/**
 * Add blur.
 * @private
 */
ffIconToggle.prototype.blur_ = function(event) {
  'use strict';

  // TODO: figure out why there's a focus event being fired after our blur,
  // so that we can avoid this hack.
  window.setTimeout(function() {
    this.inputElement_.blur();
  }.bind(this), this.Constant_.TINY_TIMEOUT);
};

// Public methods.

/**
* Check the inputs toggle state and update display.
* @public
*/
ffIconToggle.prototype.checkToggleState = function() {
  'use strict';
  if (this.inputElement_.checked) {
    this.element_.classList.add(this.CssClasses_.IS_CHECKED);
  } else {
    this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
  }
};

/**
* Check the inputs disabled state and update display.
* @public
*/
ffIconToggle.prototype.checkDisabled = function() {
  'use strict';
  if (this.inputElement_.disabled) {
    this.element_.classList.add(this.CssClasses_.IS_DISABLED);
  } else {
    this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
  }
};

/**
 * Disable icon toggle.
 * @public
 */
ffIconToggle.prototype.disable = function() {
  'use strict';

  this.inputElement_.disabled = true;
  this.updateClasses_();
};

/**
 * Enable icon toggle.
 * @public
 */
ffIconToggle.prototype.enable = function() {
  'use strict';

  this.inputElement_.disabled = false;
  this.updateClasses_();
};

/**
 * Check icon toggle.
 * @public
 */
ffIconToggle.prototype.check = function() {
  'use strict';

  this.inputElement_.checked = true;
  this.updateClasses_();
};

/**
 * Uncheck icon toggle.
 * @public
 */
ffIconToggle.prototype.uncheck = function() {
  'use strict';

  this.inputElement_.checked = false;
  this.updateClasses_();
};

/**
 * Initialize element.
 */
ffIconToggle.prototype.init = function() {
  'use strict';

  if (this.element_) {
    this.inputElement_ =
        this.element_.querySelector('.' + this.CssClasses_.INPUT);

    if (this.element_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
      this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
      this.rippleContainerElement_ = document.createElement('span');
      this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
      this.rippleContainerElement_.classList.add(this.CssClasses_.JS_RIPPLE_EFFECT);
      this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
      this.boundRippleMouseUp = this.onMouseUp_.bind(this);
      this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);

      var ripple = document.createElement('span');
      ripple.classList.add(this.CssClasses_.RIPPLE);

      this.rippleContainerElement_.appendChild(ripple);
      this.element_.appendChild(this.rippleContainerElement_);
    }

    this.boundInputOnChange = this.onChange_.bind(this);
    this.boundInputOnFocus = this.onFocus_.bind(this);
    this.boundInputOnBlur = this.onBlur_.bind(this);
    this.boundElementOnMouseUp = this.onMouseUp_.bind(this);
    this.inputElement_.addEventListener('change', this.boundInputOnChange);
    this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
    this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
    this.element_.addEventListener('mouseup', this.boundElementOnMouseUp);

    this.updateClasses_();
    this.element_.classList.add('is-upgraded');
  }
};

/*
* Downgrade the component
*/
ffIconToggle.prototype.coreDowngrade_ = function() {
  'use strict';
  if (this.rippleContainerElement_) {
    this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp);
  }
  this.inputElement_.removeEventListener('change', this.boundInputOnChange);
  this.inputElement_.removeEventListener('focus', this.boundInputOnFocus);
  this.inputElement_.removeEventListener('blur', this.boundInputOnBlur);
  this.element_.removeEventListener('mouseup', this.boundElementOnMouseUp);
};

// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
  constructor: ffIconToggle,
  classAsString: 'ffIconToggle',
  cssClass: 'js-icon-toggle',
  widget: true
});
