import Abstract from "../view/abstract.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  BEFORE: `before`
};

export const render = (container, element, place = RenderPosition.BEFOREEND, targetElement) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

  if (targetElement instanceof Abstract) {
    targetElement = targetElement.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.BEFORE:
      container.insertBefore(element, targetElement);
  }
};

export const renderTemplate = (container, template, place = RenderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const replace = (oldElement, newElement) => {
  if (oldElement instanceof Abstract) {
    oldElement = oldElement.getElement();
  }

  if (newElement instanceof Abstract) {
    newElement = newElement.getElement();
  }

  if (oldElement === null || newElement === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  oldElement.replaceWith(newElement);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};
