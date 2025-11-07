/**
 * 将像素字符串转换为数字（如 '200px' -> 200）
 * @param {string} pxString - 带px单位的字符串（如 '100px', ' 300PX ', '50'）
 * @returns {number|null} 转换后的数字，无效输入返回null
 */
function pxToNumber<T>(pxString: T) {
  // 如果输入不是字符串，直接返回null
  if (typeof pxString !== "string") {
    return null;
  }

  // 去除字符串前后空格，并转换为小写（处理 'PX' 大写情况）
  const trimmed = pxString.trim().toLowerCase();

  // 正则匹配：提取数字部分（支持整数、小数、负数）
  const match = trimmed.match(/^(-?\d+(\.\d+)?)(px)?$/);

  if (match) {
    // 解析数字并返回（使用Number转换确保类型正确）
    return Number(match[1]);
  }

  // 不匹配时返回null（如非px单位的字符串）
  return null;
}

export default pxToNumber;
