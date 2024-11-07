function UiRangeSlider() {
  let buttonReleaseCallback;
  let sliderId;

  function updateDisplayValue(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function controlFromSlider(fromSlider, toSlider, fromInput, rangeStyles) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, rangeStyles.trackColor, rangeStyles.progressColor, toSlider);
    if (from > to) {
      fromSlider.value = to;
      updateDisplayValue(fromInput, to);
    } else {
      updateDisplayValue(fromInput, from);
    }
  }

  function controlToSlider(fromSlider, toSlider, toInput, rangeStyles) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, rangeStyles.trackColor, rangeStyles.progressColor, toSlider);
    setToggleAccessible(toSlider);
    if (from <= to) {
      toSlider.value = to;
      updateDisplayValue(toInput, to);
    } else {
      toSlider.value = from;
      updateDisplayValue(toInput, from);
    }
  }

  function handleInputChanged(fromSlider, toSlider) {
    const [from, to] = getParsed(fromSlider, toSlider);
    if (typeof buttonReleaseCallback === 'function') {
      buttonReleaseCallback({
        activeRange: [from, to]
      });
    }
  }

  function getParsed(currentFrom, currentTo) {
    const from = parseFloat(currentFrom.value);
    const to = parseFloat(currentTo.value);
    return [from, to];
  }

  function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max - to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
  }

  function setToggleAccessible(currentTarget) {
    const fromSlider = document.querySelector(
      '#' + sliderId + ' [data-id=adds-slider-control-from]'
    );
    const toSlider = document.querySelector('#' + sliderId + ' [data-id=adds-slider-control-to]');
    if (Number(currentTarget.value) <= fromSlider.value) {
      toSlider.style.zIndex = '2';
    } else {
      toSlider.style.zIndex = '0';
    }
  }

  function initVisuals(values, step) {
    const rangeSliderContainer = document.querySelector(
      '#' + sliderId + ' .adds-range-slider-container'
    );
    const [min, max, start, end] = values;

    const template = `
      <div class="adds-range-slider-control">
         <input data-id="adds-slider-control-from" type="range" value="${start || min}" min="${min}" max="${max}" step="${step}" />
         <input data-id="adds-slider-control-to" type="range" value="${end || max}" min="${min}" max="${max}" step="${step}" />
      </div>
    `;
    rangeSliderContainer.innerHTML = template;
  }

  function getSliderValue() {
    const rangeSliderContainer = document.querySelector(
      '#' + sliderId + ' .adds-range-slider-container'
    );
    const min = rangeSliderContainer.getAttribute('data-slider-min');
    const max = rangeSliderContainer.getAttribute('data-slider-max');
    const start = rangeSliderContainer.getAttribute('data-slider-start');
    const end = rangeSliderContainer.getAttribute('data-slider-end');

    return [min, max, start, end];
  }

  this.initialize = function (containerId, callback, settings) {
    buttonReleaseCallback = callback;
    sliderId = containerId;

    const [min, max, start, end] = getSliderValue();
    const maxRounded = Math.ceil(parseFloat(max));
    const minRounded = Math.floor(parseFloat(min));
    initVisuals([minRounded, maxRounded, start, end], settings.step);

    const rangeStyles = settings.styles;
    const fromSlider = document.querySelector(
      '#' + containerId + ' [data-id=adds-slider-control-from]'
    );
    const toSlider = document.querySelector(
      '#' + containerId + ' [data-id=adds-slider-control-to]'
    );
    const fromInput = document.querySelector(
      '#' + containerId + ' [data-id=adds-slider-display-start]'
    );
    const toInput = document.querySelector(
      '#' + containerId + ' [data-id=adds-slider-display-end]'
    );

    fillSlider(fromSlider, toSlider, rangeStyles.trackColor, rangeStyles.progressColor, toSlider);
    setToggleAccessible(toSlider);

    updateDisplayValue(fromInput, start || min);
    updateDisplayValue(toInput, end || max);

    fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput, rangeStyles);
    toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput, rangeStyles);

    fromSlider.onchange = () => handleInputChanged(fromSlider, toSlider);
    toSlider.onchange = () => handleInputChanged(fromSlider, toSlider);
  };
}

UiRangeSlider.init = function (containerId, callback, settings) {
  new UiRangeSlider().initialize(containerId, callback, settings);
};

export default UiRangeSlider;
