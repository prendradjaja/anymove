/**
 * @param {String} HTML representing a single element
 * @return {Element}
 *
 * https://stackoverflow.com/a/35385518/1945088
 */
export function htmlToElement(html: string): Element {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  const result = template.content.firstChild;
  if (!result) {
    throw new Error('Invalid argument to htmlToElement: No element');
  }
  return result as Element;
}

/**
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 *
 * https://stackoverflow.com/a/35385518/1945088
 */
export function htmlToElements(html: string): NodeList {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.childNodes;
}
