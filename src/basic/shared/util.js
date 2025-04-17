import { strings } from './strings';

/**
 * 엘레멘트 생성 함수
 * @param {string} tagName 태그 이름
 * @param {Object} options 옵션
 * @returns {Element} 생성된 엘레멘트
 */
export const createElement = (tagName, options) => {
  if (!tagName) throw new Error(strings.error.tagNameRequired);
  const element = document.createElement(tagName);

  const { parent, ...rest } = options;
  Object.entries(rest).forEach(([key, value]) => {
    if (key === 'dataset') {
      Object.entries(value).forEach(([datasetKey, datasetValue]) => {
        element.dataset[datasetKey] = datasetValue;
      });
    } else {
      element[key] = value;
    }
  });
  if (parent) parent.appendChild(element);

  return element;
};
