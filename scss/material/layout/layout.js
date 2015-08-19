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
 * Class constructor for Layout component.
 * Implements component design pattern defined at:
 * https://github.com/jasonmayes/component-design-pattern
 * @param {HTMLElement} element The element that will be upgraded.
 */
function ffLayout(element) {
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
ffLayout.prototype.Constant_ = {
  MAX_WIDTH: '(max-width: 1024px)',
  TAB_SCROLL_PIXELS: 100,

  MENU_ICON: 'menu',
  CHEVRON_LEFT: 'chevron_left',
  CHEVRON_RIGHT: 'chevron_right'
};

/**
 * Modes.
 * @enum {number}
 * @private
 */
ffLayout.prototype.Mode_ = {
  STANDARD: 0,
  SEAMED: 1,
  WATERFALL: 2,
  SCROLL: 3
};

/**
 * Store strings for class names defined by this component that are used in
 * JavaScript. This allows us to simply change it in one place should we
 * decide to modify at a later date.
 * @enum {string}
 * @private
 */
ffLayout.prototype.CssClasses_ = {
  CONTAINER: 'layout-container',
  HEADER: 'layout-header',
  DRAWER: 'layout-drawer',
  CONTENT: 'layout-content',
  DRAWER_BTN: 'layout-drawer-button',
  DRAWER_BTN_ICON: 'layout-drawer-button-icon',

  MENU_ICON: 'material-icons',
  ICON: 'material-icons',

  JS_RIPPLE_EFFECT: 'js-ripple-effect',
  RIPPLE_CONTAINER: 'layout-tab-ripple-container',
  RIPPLE: 'ripple',
  RIPPLE_IGNORE_EVENTS: 'js-ripple-effect--ignore-events',

  HEADER_SEAMED: 'layout-header--seamed',
  HEADER_WATERFALL: 'layout-header--waterfall',
  HEADER_SCROLL: 'layout-header--scroll',

  FIXED_HEADER: 'layout-fixed-header',
  OBFUSCATOR: 'layout-obfuscator',

  TAB_BAR: 'layout-tab-bar',
  TAB_CONTAINER: 'layout-tab-bar-container',
  TAB: 'layout-tab',
  TAB_BAR_BUTTON: 'layout-tab-bar-button',
  TAB_BAR_LEFT_BUTTON: 'layout-tab-bar-left-button',
  TAB_BAR_RIGHT_BUTTON: 'layout-tab-bar-right-button',
  PANEL: 'layout-tab-panel',

  HAS_DRAWER: 'has-drawer',
  HAS_TABS: 'has-tabs',
  HAS_SCROLLING_HEADER: 'has-scrolling-header',
  CASTING_SHADOW: 'is-casting-shadow',
  IS_COMPACT: 'is-compact',
  IS_SMALL_SCREEN: 'is-small-screen',
  IS_DRAWER_OPEN: 'is-visible',
  IS_ACTIVE: 'is-active',
  IS_UPGRADED: 'is-upgraded',
  IS_ANIMATING: 'is-animating',

  ON_LARGE_SCREEN : 'layout-large-screen-only',
  ON_SMALL_SCREEN  : 'layout-small-screen-only'

};

/**
 * Handles scrolling on the content.
 * @private
 */
ffLayout.prototype.contentScrollHandler_ = function() {
  'use strict';

  if (this.header_.classList.contains(this.CssClasses_.IS_ANIMATING)) {
    return;
  }

  if (this.content_.scrollTop > 0 &&
      !this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
    this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
    this.header_.classList.add(this.CssClasses_.IS_COMPACT);
    this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
  } else if (this.content_.scrollTop <= 0 &&
      this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
    this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
    this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
    this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
  }
};

/**
 * Handles changes in screen size.
 * @private
 */
ffLayout.prototype.screenSizeHandler_ = function() {
  'use strict';

  if (this.screenSizeMediaQuery_.matches) {
    this.element_.classList.add(this.CssClasses_.IS_SMALL_SCREEN);
  } else {
    this.element_.classList.remove(this.CssClasses_.IS_SMALL_SCREEN);
    // Collapse drawer (if any) when moving to a large screen size.
    if (this.drawer_) {
      this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
    }
  }
};

/**
 * Handles toggling of the drawer.
 * @param {Element} drawer The drawer container element.
 * @private
 */
ffLayout.prototype.drawerToggleHandler_ = function() {
  'use strict';

  this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
};

/**
 * Handles (un)setting the `is-animating` class
 */
ffLayout.prototype.headerTransitionEndHandler = function() {
  'use strict';

  this.header_.classList.remove(this.CssClasses_.IS_ANIMATING);
};

/**
 * Handles expanding the header on click
 */
ffLayout.prototype.headerClickHandler = function() {
  'use strict';

  if (this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
    this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
    this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
  }
};

/**
 * Reset tab state, dropping active classes
 * @private
 */
ffLayout.prototype.resetTabState_ = function(tabBar) {
  'use strict';

  for (var k = 0; k < tabBar.length; k++) {
    tabBar[k].classList.remove(this.CssClasses_.IS_ACTIVE);
  }
};

/**
 * Reset panel state, droping active classes
 * @private
 */
ffLayout.prototype.resetPanelState_ = function(panels) {
  'use strict';

  for (var j = 0; j < panels.length; j++) {
    panels[j].classList.remove(this.CssClasses_.IS_ACTIVE);
  }
};

/**
 * Initialize element.
 */
ffLayout.prototype.init = function() {
  'use strict';

  if (this.element_) {
    var container = document.createElement('div');
    container.classList.add(this.CssClasses_.CONTAINER);
    this.element_.parentElement.insertBefore(container, this.element_);
    this.element_.parentElement.removeChild(this.element_);
    container.appendChild(this.element_);

    var directChildren = this.element_.childNodes;
    for (var c = 0; c < directChildren.length; c++) {
      var child = directChildren[c];
      if (child.classList &&
          child.classList.contains(this.CssClasses_.HEADER)) {
        this.header_ = child;
      }

      if (child.classList &&
          child.classList.contains(this.CssClasses_.DRAWER)) {
        this.drawer_ = child;
      }

      if (child.classList &&
          child.classList.contains(this.CssClasses_.DRAWER_BTN)) {
        this.drawerButton_ = child;
      }

      if (child.classList &&
          child.classList.contains(this.CssClasses_.CONTENT)) {
        this.content_ = child;
      }
    }

    if (this.header_) {
      this.tabBar_ = this.header_.querySelector('.' + this.CssClasses_.TAB_BAR);
    }

    var mode = this.Mode_.STANDARD;

    // Keep an eye on screen size, and add/remove auxiliary class for styling
    // of small screens.
    this.screenSizeMediaQuery_ = window.matchMedia(this.Constant_.MAX_WIDTH);
    this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));
    this.screenSizeHandler_();

    if (this.header_) {
      if (this.header_.classList.contains(this.CssClasses_.HEADER_SEAMED)) {
        mode = this.Mode_.SEAMED;
      } else if (this.header_.classList.contains(
          this.CssClasses_.HEADER_WATERFALL)) {
        mode = this.Mode_.WATERFALL;
        this.header_.addEventListener('transitionend',
          this.headerTransitionEndHandler.bind(this));
        this.header_.addEventListener('click',
          this.headerClickHandler.bind(this));
      } else if (this.header_.classList.contains(
          this.CssClasses_.HEADER_SCROLL)) {
        mode = this.Mode_.SCROLL;
        container.classList.add(this.CssClasses_.HAS_SCROLLING_HEADER);
      }

      if (mode === this.Mode_.STANDARD) {
        this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
        if (this.tabBar_) {
          this.tabBar_.classList.add(this.CssClasses_.CASTING_SHADOW);
        }
      } else if (mode === this.Mode_.SEAMED || mode === this.Mode_.SCROLL) {
        this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
        if (this.tabBar_) {
          this.tabBar_.classList.remove(this.CssClasses_.CASTING_SHADOW);
        }
      } else if (mode === this.Mode_.WATERFALL) {
        // Add and remove shadows depending on scroll position.
        // Also add/remove auxiliary class for styling of the compact version of
        // the header.
        this.content_.addEventListener('scroll',
            this.contentScrollHandler_.bind(this));
        this.contentScrollHandler_();
      }
    }

    // Add drawer toggling button to our layout, if we have an openable drawer.
    if (this.drawer_) {
      if (!this.drawerButton_) {
        this.drawerButton_ = document.createElement('div');
        this.drawerButton_.classList.add(this.CssClasses_.DRAWER_BTN);
      }

      if (this.drawer_.classList.contains(this.CssClasses_.ON_LARGE_SCREEN)) {
        //If drawer has ON_LARGE_SCREEN class then add it to the drawer toggle button as well.
        this.drawerButton_.classList.add(this.CssClasses_.ON_LARGE_SCREEN);
      } else if (this.drawer_.classList.contains(this.CssClasses_.ON_SMALL_SCREEN)) {
        //If drawer has ON_SMALL_SCREEN class then add it to the drawer toggle button as well.
        this.drawerButton_.classList.add(this.CssClasses_.ON_SMALL_SCREEN);
      }

      var drawerChildren = this.drawerButton_.childNodes;
      for (var c = 0; c < drawerChildren.length; c++) {
        var drawerChild = drawerChildren[c];
        console.log(drawerChild);
        if (drawerChild.classList && drawerChild.classList.contains(this.CssClasses_.DRAWER_BTN_ICON)) {
          this.drawerButtonIcon_ = drawerChild;
        }
      }

      if (!this.drawerButtonIcon_) {
        var drawerButtonIcon = document.createElement('i');
        drawerButtonIcon.classList.add(this.CssClasses_.MENU_ICON);
        drawerButtonIcon.textContent = this.Constant_.MENU_ICON;
        this.drawerButton_.appendChild(drawerButtonIcon);
      }
      this.drawerButton_.addEventListener('click',
          this.drawerToggleHandler_.bind(this));

      // Add a class if the layout has a drawer, for altering the left padding.
      // Adds the HAS_DRAWER to the elements since this.header_ may or may
      // not be present.
      this.element_.classList.add(this.CssClasses_.HAS_DRAWER);

      // If we have a fixed header, add the button to the header rather than
      // the layout.
      if (this.element_.classList.contains(this.CssClasses_.FIXED_HEADER)) {
        this.header_.insertBefore(this.drawerButton_, this.header_.firstChild);
      } else {
        this.element_.insertBefore(this.drawerButton_, this.content_);
      }

      var obfuscator = document.createElement('div');
      obfuscator.classList.add(this.CssClasses_.OBFUSCATOR);
      this.element_.appendChild(obfuscator);
      obfuscator.addEventListener('click',
          this.drawerToggleHandler_.bind(this));
    }

    // Initialize tabs, if any.
    if (this.header_ && this.tabBar_) {
      this.element_.classList.add(this.CssClasses_.HAS_TABS);

      var tabContainer = document.createElement('div');
      tabContainer.classList.add(this.CssClasses_.TAB_CONTAINER);
      this.header_.insertBefore(tabContainer, this.tabBar_);
      this.header_.removeChild(this.tabBar_);

      var leftButton = document.createElement('div');
      leftButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
      leftButton.classList.add(this.CssClasses_.TAB_BAR_LEFT_BUTTON);
      var leftButtonIcon = document.createElement('i');
      leftButtonIcon.classList.add(this.CssClasses_.ICON);
      leftButtonIcon.textContent = this.Constant_.CHEVRON_LEFT;
      leftButton.appendChild(leftButtonIcon);
      leftButton.addEventListener('click', function() {
        this.tabBar_.scrollLeft -= this.Constant_.TAB_SCROLL_PIXELS;
      }.bind(this));

      var rightButton = document.createElement('div');
      rightButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
      rightButton.classList.add(this.CssClasses_.TAB_BAR_RIGHT_BUTTON);
      var rightButtonIcon = document.createElement('i');
      rightButtonIcon.classList.add(this.CssClasses_.ICON);
      rightButtonIcon.textContent = this.Constant_.CHEVRON_RIGHT;
      rightButton.appendChild(rightButtonIcon);
      rightButton.addEventListener('click', function() {
        this.tabBar_.scrollLeft += this.Constant_.TAB_SCROLL_PIXELS;
      }.bind(this));

      tabContainer.appendChild(leftButton);
      tabContainer.appendChild(this.tabBar_);
      tabContainer.appendChild(rightButton);

      // Add and remove buttons depending on scroll position.
      var tabScrollHandler = function() {
        if (this.tabBar_.scrollLeft > 0) {
          leftButton.classList.add(this.CssClasses_.IS_ACTIVE);
        } else {
          leftButton.classList.remove(this.CssClasses_.IS_ACTIVE);
        }

        if (this.tabBar_.scrollLeft <
            this.tabBar_.scrollWidth - this.tabBar_.offsetWidth) {
          rightButton.classList.add(this.CssClasses_.IS_ACTIVE);
        } else {
          rightButton.classList.remove(this.CssClasses_.IS_ACTIVE);
        }
      }.bind(this);

      this.tabBar_.addEventListener('scroll', tabScrollHandler);
      tabScrollHandler();

      if (this.tabBar_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
        this.tabBar_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
      }

      // Select element tabs, document panels
      var tabs = this.tabBar_.querySelectorAll('.' + this.CssClasses_.TAB);
      var panels = this.content_.querySelectorAll('.' + this.CssClasses_.PANEL);

      // Create new tabs for each tab element
      for (var i = 0; i < tabs.length; i++) {
        new ffLayoutTab(tabs[i], tabs, panels, this);
      }
    }

    this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
  }
};

function ffLayoutTab(tab, tabs, panels, layout) {
  'use strict';

  if (tab) {
    if (layout.tabBar_.classList.contains(
        layout.CssClasses_.JS_RIPPLE_EFFECT)) {
      var rippleContainer = document.createElement('span');
      rippleContainer.classList.add(layout.CssClasses_.RIPPLE_CONTAINER);
      rippleContainer.classList.add(layout.CssClasses_.JS_RIPPLE_EFFECT);
      var ripple = document.createElement('span');
      ripple.classList.add(layout.CssClasses_.RIPPLE);
      rippleContainer.appendChild(ripple);
      tab.appendChild(rippleContainer);
    }

    tab.addEventListener('click', function(e) {
      e.preventDefault();
      var href = tab.href.split('#')[1];
      var panel = layout.content_.querySelector('#' + href);
      layout.resetTabState_(tabs);
      layout.resetPanelState_(panels);
      tab.classList.add(layout.CssClasses_.IS_ACTIVE);
      panel.classList.add(layout.CssClasses_.IS_ACTIVE);
    });

  }
}

// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
  constructor: ffLayout,
  classAsString: 'ffLayout',
  cssClass: 'js-layout'
});
