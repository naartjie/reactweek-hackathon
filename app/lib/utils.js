export default {
  toArray
}

function toArray(obj) {
  if (!obj) return []

  return Object.keys(obj).map((key) => {
    var result = obj[key]

    if (typeof result === 'object') {
      result.key = key
    } else {
      result = {_key: key, val: result}
    }
    return result
  })
}