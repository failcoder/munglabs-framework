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
 * Class constructor for Skins component.
 * Implements component design pattern defined at:
 * https://github.com/jasonmayes/component-design-pattern
 * @param {HTMLElement} element The element that will be upgraded.
 */
function ffSkins(element) {
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
ffSkins.prototype.Constant_ = {
  FLAG: 'skinned',
  CONTAINER: 'layout-content'
};

/**
 * Store strings for class names defined by this component that are used in
 * JavaScript. This allows us to simply change it in one place should we
 * decide to modify at a later date.
 * @enum {string}
 * @private
 */
ffSkins.prototype.CssClasses_ = {
  PAGE: 'skinned-page',
  CONTENT: 'skinned-content'
};

/**
 * Placeholder method
 * @private
 */
ffSkins.prototype.placeHolder_ = function(arg) {
  'use strict';
  //DO STUFF
};

/**
 * Initialize element.
 */
ffSkins.prototype.init = function() {
  'use strict';

  if (this.element_) {
    var directChildren = this.element_.childNodes;
    for (var c = 0; c < directChildren.length; c++) {
      var child = directChildren[c];
      if (child.classList && child.classList.contains(this.CssClasses_.PAGE)) {
        this.pageskin_ = child;
      }
      if (child.classList && child.classList.contains(this.Constant_.CONTAINER)) {
        this.container_ = child;
      }
    }

    if (!this.pageskin_) {
      var firstChild = document.body.firstChild;
      var pageSkin = document.createElement('div');
      pageSkin.classList.add(this.CssClasses_.PAGE);
      document.body.insertBefore(pageSkin, firstChild);
    }

    if (this.container_) {
      var containerChildren = this.container_.childNodes;
      for (var c = 0; c < containerChildren.length; c++) {
        var child = containerChildren[c];
        if (child.classList && child.classList.contains(this.Constant_.FLAG) && !child.classList.contains(this.CssClasses_.CONTENT)) {
          child.classList.add(this.CssClasses_.CONTENT);
        }
      }
    }
  }
};

// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
  constructor: ffSkins,
  classAsString: 'ffSkins',
  cssClass: 'js-skins'
});
