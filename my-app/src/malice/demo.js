const { SENSITIVE_Dictionary, MALICE_Dictionary } = require('./Dictionary')
const { Check, Detect } = require('./bundle')

var str = '你就是个废物'
console.log(Detect(str, SENSITIVE_Dictionary, MALICE_Dictionary))