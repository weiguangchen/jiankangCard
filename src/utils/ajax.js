export default function (url, data) {
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url,
      data,
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
  return p;
}
