const shortid = require('shortid')

export default function(){
  shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$')

  return shortid.generate().substring(4)
}
