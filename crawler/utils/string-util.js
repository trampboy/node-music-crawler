/**
 * Created by YanMingDao on 31/08/2017.
 */
class StringUtil {
    trim(str) {
       return str.replace('/\s+/g', '');
    }
}

module.exports = new StringUtil();