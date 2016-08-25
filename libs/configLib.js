/**
 * Created by Micro on 21.08.2016.
 */
var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: './config.json' });

module.exports = nconf;