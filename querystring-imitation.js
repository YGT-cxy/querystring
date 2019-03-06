/**
 * parse  URL解析
 * @param  {String} str     要解析的 URL 查询字符串
 * @param  {String} sep     用于界定查询字符串中的键值对的子字符串。默认为 '&'
 * @param  {String} eq      用于界定查询字符串中的键与值的子字符串。默认为 '='
 * @param  {Object} options decodeURIComponent <Function> 解码查询字符串的字符时使用的函数。默认为 querystring.unescape()
                            maxKeys <number> 指定要解析的键的最大数量。指定为 0 则不限制。默认为 1000
 * @return {Object}         键值对的集合
 */
exports.parse = function(str, sep = '&', eq = '=', options = {decodeURIComponent: this.unescape, maxKeys: 1000}) {
    let resObj = {};
    if(!str.length) {
        return resObj;
    }
    str = str.trim();  // 去除前后空格
    str = options.decodeURIComponent(str);  // 编码处理

    if(str.indexOf('?') === 0) {  // 处理?
        str = str.slice(1);
    }

    let urlArr = str.split(sep);
    for(let i = 0, leng = urlArr.length; i < leng; i++) {
        if(i > options.maxKeys) {  // 限制遍历的键的最大数量
            break;
        }

        let key = urlArr[i].split(eq)[0];
        let val = urlArr[i].split(eq)[1];
        if(resObj.hasOwnProperty(key)) {  // 判断当前的键是否已存在返回的对象中
            if(Array.isArray(resObj[key])) {  // 判断当前存在对象中的键对应的值是否为数组
                resObj[key].push(val);
            } else {  // 不为数组，将当前的键对应的值的类型改为数组格式，并存放原先和此次的值
                let lastval = resObj[key];
                resObj[key] = [];
                resObj[key].push(lastval, val);
            }
        } else {
            resObj[key] = val;
        }
    }

    return resObj;
};

/**
 * 将一个对象序列化成 URL 查询字符串
 * @param  {Object} obj     要序列化成 URL 查询字符串的对象
 * @param  {String} sep     用于界定查询字符串中的键值对的子字符串。默认为 '&'
 * @param  {String} eq      用于界定查询字符串中的键与值的子字符串。默认为 '='
 * @param  {Object} options encodeURIComponent <Function> 把对象中的字符转换成查询字符串时使用的函数。默认为 querystring.escape()
 * @return {String}         URL 查询字符串
 */
exports.stringify = function(obj, sep = '&', eq = '=', options = {encodeURIComponent: this.escape}) {
    let resStr = '';
    if(typeof obj !== 'object') {  // 普通数据类型直接返回一个空的字符串
        return resStr;
    }

    let temp = '';
    for(let i in obj) {
        i = options.encodeURIComponent(i);
        if(Array.isArray(obj[i])) {
            for(let j = 0, leng = obj[i].length; j < leng; j++) {
                temp += i + eq + options.encodeURIComponent(obj[i][j]) + sep;
            }
            resStr += temp;
        } else {
            resStr += i + eq + options.encodeURIComponent(obj[i]) + sep;
        }
    }

    return resStr.slice(0, -1);
};

/**
 * 对给定的 str 进行 URL 编码
 * @param  {String} str 需要进行编码的str
 * @return {String}     编码后的str
 */
exports.escape = function(str) {
    return encodeURIComponent(str);
};

/**
 * 对给定的 str 进行 URL 解码
 * @param  {String} str 需要进行解码str
 * @return {String}     解码后的str
 */
exports.unescape = function(str) {
    return decodeURIComponent(str);
};