/**
 * 工具类
 */
import Vue from 'vue'
import CryptoJS from 'crypto-js'
export default {

  // 加密
  encrypt(word) {
	var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
	var srcs = CryptoJS.enc.Utf8.parse(word);
	var encrypted = CryptoJS.AES.encrypt(srcs, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.toString();
},
//解密
decrypt(word) {
	if (!word) {
		return null;
	}
	var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
	var decrypt = CryptoJS.AES.decrypt(word, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

}