const shortid = require('shortid')

export default function(){
  shortid.characters('123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ')

  return shortid.generate().substring(4)
}
