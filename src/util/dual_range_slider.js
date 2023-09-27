function DualRangeSlider() {
  let buttonReleaseCallback;

  // function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
  //   const [from, to] = getParsed(fromInput, toInput);
  //
  //   fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
  //   if (from > to) {
  //     fromSlider.value = to;
  //     fromInput.value = to;
  //   } else {
  //     fromSlider.value = from;
  //   }
  // }
  //
  // function controlToInput(toSlider, fromInput, toInput, controlSlider) {
  //   const [from, to] = getParsed(fromInput, toInput);
  //   fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
  //   setToggleAccessible(toInput);
  //   if (from <= to) {
  //     toSlider.value = to;
  //     toInput.value = to;
  //   } else {
  //     toInput.value = from;
  //   }
  // }

  function controlFromSlider(fromSlider, toSlider, fromInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    if (from > to) {
      fromSlider.value = to;
      if (fromInput) {
        fromInput.textContent = to;
      }
    } else {
      if (fromInput) {
        fromInput.textContent = from;
      }
    }
  }

  function controlToSlider(fromSlider, toSlider, toInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    setToggleAccessible(toSlider);
    if (from <= to) {
      toSlider.value = to;
      if (toInput) {
        toInput.textContent = to;
      }
    } else {
      if (toInput) {
        toInput.textContent = from;
      }
      toSlider.value = from;
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
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  }

  function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
  }

  function setToggleAccessible(currentTarget) {
    const toSlider = document.querySelector('#toSlider');
    if (Number(currentTarget.value) <= 0 ) {
      toSlider.style.zIndex = 2;
    } else {
      toSlider.style.zIndex = 0;
    }
  }

  function initVisuals(containerId, values) {
    const rangeSliderContainer = document.querySelector('#' + containerId + ' .range_container');
    const [min, max, start, end] = values;

    const template = `
      <div class="sliders_control">
         <input id="fromSlider" type="range" value="${start || min}" min="${min}" max="${max}"/>
         <input id="toSlider" type="range" value="${end || max}" min="${min}" max="${max}"/>
      </div>
      <div class="form_control">
        <div class="form_control_container">
<!--          <span class="form_control_container__time__input" id="fromInput">${start || min}</span>-->
<!--          <input class="form_control_container__time__input" id="fromInput" value="10" min="${min}" max="${max}"/>-->
        </div>
        <div class="form_control_container">
<!--          <span class="form_control_container__time__input" id="toInput">${end || max}</span>-->
<!--          <input class="form_control_container__time__input" id="toInput" value="3000" min="${min}" max="${max}"/>-->
        </div>
      </div>
    `;
    rangeSliderContainer.innerHTML = template;
  };

  function getSliderValue(sliderId) {
    const rangeSliderContainer = document.querySelector('#' + sliderId + ' .range_container');
    const min = rangeSliderContainer.getAttribute('data-slider-min');
    const max = rangeSliderContainer.getAttribute('data-slider-max');
    const start = rangeSliderContainer.getAttribute('data-slider-start');
    const end = rangeSliderContainer.getAttribute('data-slider-end');

    return [min, max, start, end];
  };

  this.initialize = function(containerId, callback) {
    const [min, max, start, end] = getSliderValue(containerId);

    buttonReleaseCallback = callback;
    initVisuals(containerId, [min, max, start, end]);

    const fromSlider = document.querySelector('#fromSlider');
    const toSlider = document.querySelector('#toSlider');
    const fromInput = document.querySelector('#' + containerId + ' [data-id=adds-slider-display-start]');
    const toInput = document.querySelector('#' + containerId + ' [data-id=adds-slider-display-end]');


    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    setToggleAccessible(toSlider);

    fromInput.textContent = start || min;
    toInput.textContent = end || max;

    window.console.log('+++ init');

    fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
    toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);

    fromSlider.onchange = () => handleInputChanged(fromSlider, toSlider);
    toSlider.onchange = () => handleInputChanged(fromSlider, toSlider);

    // fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
    // toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);
  }
}

DualRangeSlider.init = function(containerId, callback) {
  (new DualRangeSlider()).initialize(containerId, callback);
}

export default DualRangeSlider;
