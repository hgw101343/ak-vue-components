/**
 * 转换函数工具
 */

/**
 * json格式转换成uri格式的参数
 * @param paramsJson
 * @returns {string}
 */
export const convertUriParamsFromJson = (paramsJson) => {
  const temp = Object.keys(paramsJson).map(key => (`${key}=${paramsJson[key]}`))
  return temp ? `?${temp.join('&')}` : ''
}
