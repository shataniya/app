const { SENSITIVE_JSON } = require('./SENSITIVE_JSON')
const { MALICE_JSON } = require('./MALICE_JSON')

const SENSITIVE_Dictionary = JSON.parse(SENSITIVE_JSON)

const MALICE_Dictionary = JSON.parse(MALICE_JSON)

module.exports = {
    SENSITIVE_Dictionary,
    MALICE_Dictionary
}