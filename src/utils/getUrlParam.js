/* eslint-disable */
export default (name) => {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  const r = window.location.search.substr(1).match(reg)
  if (r != null){
    return unescape(r[2])
  } else  {
    return ''
  }
}
