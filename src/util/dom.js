export function attachEventListeners(container, dataAttribute, eventType, eventFunction) {
  const elems = container.querySelectorAll('[' + dataAttribute + ']');
  for (let i = 0; i < elems.length; i++) {
    elems[i].addEventListener(eventType, (e) => {
      eventFunction(e.target.getAttribute(dataAttribute));
    });
  }
}


export function validateContainer(containerId) {
  if (!document.getElementById(containerId)) {
    console.log('WARNING: Search UI container with id "' + containerId + '" not found');
    return false;
  }
  return true;
}