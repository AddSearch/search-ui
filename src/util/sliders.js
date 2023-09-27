// const OmRangeSliderInputValueStyles = {
//   DEFAULT_COMMA_SEPARATED: 0,
//   PHP_ARRAY: 1,
//   ASP_ARRAY: 2
// }

function OmRangeSlider(inputElement, inputValueStyle, buttonReleaseCallback, containerId) {
  const config = {
    buttonReleaseCallback: buttonReleaseCallback,
    containerId: containerId
  };
  const that = this;

  let input = inputElement;
  let inputValueEnd = undefined;
  let elementRange = undefined;
  let buttonStart = undefined;
  let buttonEnd = undefined;
  let rangeIndicator = undefined;
  let displayValueStart = undefined;
  let displayValueEnd = undefined;

  let rangeValue = undefined;

  let debug = false;

  let settings = {
    min: 0,
    max: 10,
    inputValueStyle: inputValueStyle
  };

  this.setRange = function (range) {
    displayValueStart = document.querySelector('#' + config.containerId + ' [data-id=adds-slider-display-start]') || displayValueStart;
    displayValueEnd = document.querySelector('#' + config.containerId + ' [data-id=adds-slider-display-end]') || displayValueEnd;

    if (that.sliderEventHelper && that.sliderEventHelper.activeRange) {
      that.sliderEventHelper.activeRange = range.slice();
    }
    rangeValue = range;
    displayValueStart.textContent = range[0];
    displayValueEnd.textContent = range[1];
    triggerRangeChangeEvent(range);

    // switch (settings.inputValueStyle) {
    //   default:
    //   case OmRangeSliderInputValueStyles.DEFAULT_COMMA_SEPARATED:
    //     input.value = rangeValue.join(',');
    //     break;
    //   case OmRangeSliderInputValueStyles.PHP_ARRAY:
    //   case OmRangeSliderInputValueStyles.ASP_ARRAY:
    //     input.value = rangeValue[0];
    //     inputValueEnd.value = rangeValue[1];
    //     break;
    // }
    return that;
  };

  this.setDebug = function (enabled) {
    debug = !!enabled;
    return that;
  }

  function initEventSubscriptions() {
    let previousWindowWidth = document.documentElement.clientWidth;

    window.addEventListener('resize', (e) => {
      if (sliderEventHelper.getActiveButton() === undefined || previousWindowWidth !== document.documentElement.clientWidth.toFixed()) {
        previousWindowWidth = document.documentElement.clientWidth.toFixed();
        refreshButtonPositions();
        refreshRangeIndicator();
      }
    }, {passive: false});

    const sliderEventHelper = new SliderEventHelper(buttonStart, buttonEnd, config);
    that.sliderEventHelper = sliderEventHelper;

    sliderEventHelper.validateNewPosition = (button, positionX) => {
      return getValidX(button, positionX)
    };
    sliderEventHelper.onButtonPositionChanged = (button) => {
      updateValues();
      refreshRangeIndicator();
    };
  }

  function initVisuals() {

    const visualSliderContainer = document.createElement('div');
    visualSliderContainer.className = input.className;

    if (!visualSliderContainer.style.height) {
      // window.console.log('+++ height', input.offsetHeight);
      // visualSliderContainer.style.height = input.offsetHeight + 'px';
    }

    visualSliderContainer.classList.add('om-sliderrange');
    const visualSliderRange = document.createElement('div');
    visualSliderRange.classList.add('om-sliderrange-range');
    const visualSliderRangeIndicator = document.createElement('div');
    visualSliderRangeIndicator.classList.add('om-sliderrange-range-indicator');
    const visualSliderButtonStart = document.createElement('div');
    visualSliderButtonStart.role = 'button';
    visualSliderButtonStart.setAttribute('tabindex', '0');
    visualSliderButtonStart.classList.add('om-sliderrange-button-start');
    visualSliderButtonStart.innerHTML = '<div style="position: relative; height: 100%; width: 100%;"><div style="position: absolute; height: 48px; width: 48px; top: 50%; left: 50%; transform: translateY(-50%) translateX(-50%);' + (debug ? ' background: rgba(71,178,71,0.6);' : '') + '"></div></div>';
    const visualSliderButtonEnd = document.createElement('div');
    visualSliderButtonEnd.role = 'button';
    visualSliderButtonEnd.setAttribute('tabindex', '0');
    visualSliderButtonEnd.classList.add('om-sliderrange-button-end');
    visualSliderButtonEnd.innerHTML = '<div style="position: relative; height: 100%; width: 100%;"><div style="position: absolute; height: 48px; width: 48px; top: 50%; left: 50%; transform: translateY(-50%) translateX(-50%);' + (debug ? '  background: rgba(178,71,71,0.6);' : '') + '"></div></div>';

    visualSliderRange.appendChild(visualSliderRangeIndicator);
    visualSliderRange.appendChild(visualSliderButtonStart);
    visualSliderRange.appendChild(visualSliderButtonEnd);

    visualSliderContainer.appendChild(visualSliderRange);

    // const visualDisplayContainer = document.createElement('div');
    // visualDisplayContainer.className = 'om-sliderrange-display';
    //
    // const visualDisplayValueStart = document.createElement('span');
    // visualDisplayValueStart.textContent = '0';
    // const visualDisplayValueEnd = document.createElement('span');
    // visualDisplayValueEnd.textContent = '10';
    // const visualDisplaySeparator = document.createElement('span');
    // visualDisplaySeparator.textContent = '-';
    // visualDisplayContainer.appendChild(visualDisplayValueStart);
    // visualDisplayContainer.appendChild(visualDisplaySeparator);
    // visualDisplayContainer.appendChild(visualDisplayValueEnd);
    //
    // visualSliderContainer.appendChild(visualDisplayContainer);

    input.parentNode.insertBefore(visualSliderContainer, input.nextSibling);

    visualSliderButtonEnd.style.left = (visualSliderRange.getBoundingClientRect().width - visualSliderButtonEnd.getBoundingClientRect().width) + 'px';

    elementRange = visualSliderRange;
    buttonStart = visualSliderButtonStart;
    buttonEnd = visualSliderButtonEnd;
    rangeIndicator = visualSliderRangeIndicator;
    // displayValueStart = visualDisplayValueStart;
    // displayValueEnd = visualDisplayValueEnd;
    settings.min = input.getAttribute('min')
      ? input.getAttribute('min') : 0;
    settings.max = input.getAttribute('max')
      ? input.getAttribute('max') : 10;

    input.type = 'hidden';

    const range = input.value ? input.value.split(',').map(x => +x.trim()) : [settings.min, settings.max];

    // switch (settings.inputValueStyle) {
    //   default:
    //   case OmRangeSliderInputValueStyles.DEFAULT_COMMA_SEPARATED:
    //     break;
    //   case OmRangeSliderInputValueStyles.PHP_ARRAY:
    //     inputValueEnd = document.createElement('input');
    //     inputValueEnd.hidden = true;
    //     inputValueEnd.name = input.name + '[]';
    //     input.parentNode.insertBefore(inputValueEnd, input.nextSibling);
    //     input.name = input.name + '[]';
    //     break;
    //   case OmRangeSliderInputValueStyles.ASP_ARRAY:
    //     inputValueEnd = document.createElement('input');
    //     inputValueEnd.hidden = true;
    //     inputValueEnd.name = input.name;
    //     input.parentNode.insertBefore(inputValueEnd, input.nextSibling);
    //     break;
    // }

    const rangeStart = range[0] && range[0] >= settings.min && range[0] <= settings.max
      ? range[0] : settings.min;
    const rangeEnd = range[1] && range[1] >= settings.min && range[1] <= settings.max
      ? range[1] : settings.max;
    that.setRange([rangeStart, rangeEnd]);
    refreshButtonPositions();
    refreshRangeIndicator();
  }

  function refreshButtonPositions() {
    const elementRangeWidth = elementRange.getBoundingClientRect().width;
    const buttonStartWidth = buttonStart.getBoundingClientRect().width;
    const buttonEndWidth = buttonEnd.getBoundingClientRect().width;

    const range = settings.max - settings.min;
    const factor = (elementRangeWidth - buttonStartWidth - buttonEndWidth) / range;

    const valueStart = rangeValue[0] - settings.min;
    const valueEnd = rangeValue[1] - settings.min;

    const buttonStartLeft = Math.floor(valueStart * factor);
    const buttonEndLeft = buttonStartWidth + Math.floor(valueEnd * factor);

    buttonStart.style.left = buttonStartLeft + 'px';
    buttonEnd.style.left = buttonEndLeft + 'px';
  }

  function refreshRangeIndicator() {
    const elementRangeWidth = elementRange.getBoundingClientRect().width;
    const buttonStartWidth = buttonStart.getBoundingClientRect().width;
    const buttonEndWidth = buttonEnd.getBoundingClientRect().width;

    const buttonStartMiddle = Math.round(parseInt(buttonStart.style.left) + (buttonStartWidth / 2));
    const buttonEndMiddle = Math.round(elementRangeWidth - (parseInt(buttonEnd.style.left) + (buttonEndWidth / 2)));
    rangeIndicator.style.left = buttonStartMiddle + 'px';
    rangeIndicator.style.right = buttonEndMiddle + 'px';
  }

  function triggerRangeChangeEvent(range) {
    const event = new CustomEvent('rangechange', {detail: rangeValue});
    input.value = range ? range.join(',') : '';
    input.dispatchEvent(event);
  }

  function updateValues() {
    const rangePx = elementRange.offsetWidth - buttonStart.offsetWidth - buttonEnd.offsetWidth - 1;
    const startPx = parseInt(buttonStart.style.left);
    const endPx = parseInt(buttonEnd.style.left) - buttonEnd.offsetWidth;

    const isFloat = parseFloat(settings.min) % 1 !== 0 || parseFloat(settings.max) % 1 !== 0;

    const diffRange = settings.max - settings.min;
    let resultStart = (diffRange / rangePx * startPx) + parseFloat(settings.min);
    let resultEnd = (diffRange / rangePx * endPx) + parseFloat(settings.min);

    if (!isFloat) {
      resultStart = +Math.ceil(resultStart);
      resultEnd = +Math.ceil(resultEnd);
    }

    refreshRangeIndicator();

    that.setRange([resultStart, resultEnd]);
  }

  function getValidX(button, positionX) {
    let newX = positionX;

    if (button === buttonStart) {
      if (newX <= 0) {
        newX = 0;
      } else if (newX + buttonStart.getBoundingClientRect().width >= parseInt(buttonEnd.style.left)) {
        newX = parseInt(buttonEnd.style.left) - buttonStart.getBoundingClientRect().width;
      }
    } else if (button === buttonEnd) {
      if (newX >= elementRange.getBoundingClientRect().width - buttonEnd.getBoundingClientRect().width) {
        newX = elementRange.getBoundingClientRect().width - buttonEnd.getBoundingClientRect().width;
      } else if (newX <= buttonStart.getBoundingClientRect().width + parseInt(buttonStart.style.left)) {
        newX = buttonStart.getBoundingClientRect().width + parseInt(buttonStart.style.left);
      }
    }
    return parseInt(newX);
  }

  this.initialize = function () {
    initVisuals();
    initEventSubscriptions();
  };
}

function SliderEventHelper(buttonStart, buttonEnd, config) {

  const that = this;

  let x = 0;
  let activeButton = null;
  let isMouseButtonDown = false;

  this.getActiveButton = function () {
    return activeButton;
  }

  this.activeRange = [];

  /**
   * Callback that needs to be implemented to check if the position of the currently moved button is within allowed range.
   *
   * @callback validateNewPosition
   * @param {HtmlButtonElement} button The button the position should be checked of
   * @param {int} positionX The new position of the button
   * @returns {int} The new validated position
   */
  this.validateNewPosition = undefined;
  /**
   * Event callback that gets called when the position of the button has been changed.
   *
   * @callback onButtonPositionChanged
   * @param {HtmlButtonElement} button The button of which the position changed
   */
  this.onButtonPositionChanged = undefined;

  function handleButtonGrabbed(e) {
    e.preventDefault();
    isMouseButtonDown = true;
    // The touch area of the buttons are bigger than they are visually. Because of that, the touch area overlaps, in case that the buttons are positioned
    // for a small range. Do determine, which button on touch/click should be moved, we check, if the X is behind the starting of the endbutton.
    // The end button touch area always overlaps the start button, because of the Z-index (it is the latter added button).
    const buttonStartPosStart = buttonStart.getBoundingClientRect()?.left ?? undefined;
    const buttonEndPosStart = buttonEnd.getBoundingClientRect()?.left ?? undefined;
    let buttonStartPosEnd = undefined;
    let halfDistanceBetweenButtons = undefined;
    if (buttonStartPosStart && buttonEndPosStart) {
      buttonStartPosEnd = buttonStartPosStart + buttonStart.getBoundingClientRect().width;
      halfDistanceBetweenButtons = (buttonEndPosStart - buttonStartPosEnd) / 2;
    }

    if (halfDistanceBetweenButtons !== undefined && e.currentTarget === buttonEnd) {
      if (getXOfMoveEvent(e) < buttonStartPosEnd + halfDistanceBetweenButtons) {
        activeButton = buttonStart;
      } else {
        activeButton = buttonEnd;
      }
    } else {
      activeButton = e.currentTarget;
    }
    activeButton.focus();

    x = activeButton.offsetLeft - getXOfMoveEvent(e);
  }

  function handleButtonRelease(e) {
    isMouseButtonDown = false;
    if (!activeButton)
      return;

    x = activeButton.offsetLeft - getXOfMoveEvent(e);

    activeButton = undefined;

    if (typeof config !== 'undefined' && typeof config.buttonReleaseCallback === 'function') {
      window.console.log('+++ buttonReleaseCallback');
      config.buttonReleaseCallback({
        activeRange: that.activeRange
      });
    }
  }

  function handleButtonMove(e) {
    if (!activeButton || !isMouseButtonDown)
      return;

    e.preventDefault();
    e.stopImmediatePropagation();

    let newX = getXOfMoveEvent(e);

    newX = that.validateNewPosition(activeButton, newX + x);

    if (newX !== parseInt(activeButton.style.left)) {
      activeButton.style.left = newX + 'px';
      that.onButtonPositionChanged(activeButton);
    }
  }

  function handleKeyDown(e) {
    isMouseButtonDown = false;
    if (!document.activeElement) {
      return;
    }

    if (document.activeElement === buttonStart) {
      activeButton = buttonStart;
    } else if (document.activeElement === buttonEnd) {
      activeButton = buttonEnd;
    } else {
      return;
    }

    const arrowLeft = 37;
    const arrowRight = 39;

    let newX = 0;
    if (e.keyCode === arrowLeft) {
      newX = that.validateNewPosition(activeButton, activeButton.offsetLeft - 1);
    } else if (e.keyCode === arrowRight) {
      newX = that.validateNewPosition(activeButton, activeButton.offsetLeft + 1);
    }
    else {
      return;
    }

    e.preventDefault();

    activeButton.style.left = newX + 'px';
    that.onButtonPositionChanged(activeButton);
  }

  function getXOfMoveEvent(e) {
    if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
      const evt = !e.originalEvent ? e : e.originalEvent;
      const touch = evt.touches[0] || evt.changedTouches[0];

      return touch.pageX || touch.clientX;
    } else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
      return e.clientX;
    } else {
      return undefined;
    }
  }

  function init() {
    buttonStart.addEventListener('mousedown', handleButtonGrabbed, {passive: false});
    buttonStart.addEventListener('touchstart', handleButtonGrabbed, {passive: false});
    buttonStart.addEventListener('touchend', handleButtonRelease, {passive: false});
    buttonStart.addEventListener('touchcancel', handleButtonRelease, {passive: false});
    buttonEnd.addEventListener('mousedown', handleButtonGrabbed, {passive: false});
    buttonEnd.addEventListener('touchstart', handleButtonGrabbed, {passive: false});
    buttonEnd.addEventListener('touchend', handleButtonRelease, {passive: false});
    buttonEnd.addEventListener('touchcancel', handleButtonRelease, {passive: false});

    window.addEventListener('mouseup', handleButtonRelease, {passive: false});
    window.addEventListener('touchend', handleButtonRelease, {passive: false});
    window.addEventListener('touchcancel', handleButtonRelease, {passive: false});

    window.addEventListener('mousemove', handleButtonMove, {passive: false});
    window.addEventListener('touchmove', handleButtonMove, {passive: false});
    window.addEventListener('mouseout', (e) => {
      if (e.toElement == null && e.relatedTarget == null) {
        handleButtonRelease(e);
      }
    }, {passive: false});

    window.addEventListener('keydown', handleKeyDown, {passive: false});
  }

  init();
}


OmRangeSlider.init = function (settings, buttonReleaseCallback, containerId) {

  const defaultSettings = {
    selector: 'input[type=range][addsearch-range-slider]',
    // inputValueStyle: OmRangeSliderInputValueStyles.DEFAULT_COMMA_SEPARATED
  };
  settings = settings ? Object.assign(defaultSettings, settings) : defaultSettings;

  const rangeSlider = document.querySelector('#' + containerId).querySelector(settings.selector);
  (new OmRangeSlider(rangeSlider, settings.inputValueStyle, buttonReleaseCallback, containerId))
    .setDebug(false)
    .initialize();
}

export default OmRangeSlider;
