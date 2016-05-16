# Accessible Banking API

This is the back end for an accesssible online banking prototype; 
for front end code see [the repository `hdm_banking_default`](https://github.com/MarioAer/hdm_banking_default).

## Installation Notes

Dependencies:
- [Node.js](https://nodejs.org/);
- [MongoDB](https://www.mongodb.org/).

Procedure (First time)
- Go to the project location folder 
- Run the command `npm install` 
- Run `npm install -g nodemon` 
- Start the database from the mongoDB bin folder with the command `mongod -Dpath <project location folder>/data` 
- Run the command `nodemon` 


## Copyright & Licences

Copyright 2015 Hochschule der Medien (HdM) / Stuttgart Media University ([research group Remex](https://www.hdm-stuttgart.de/remex)).

Licence: [MIT](LICENSE).

This licence is also used by most of the Node.js modules in this project 
([body-parser](https://www.npmjs.com/package/body-parser), 
[cookie-parser](https://www.npmjs.com/package/cookie-parser),
[debug](https://www.npmjs.com/package/debug),
[express](https://www.npmjs.com/package/express),
[monk](https://www.npmjs.com/package/monk),
[morgan](https://www.npmjs.com/package/morgan),
[passport-http](https://www.npmjs.com/package/passport-http),
[passport](https://www.npmjs.com/package/passport) and
and [serve-favico,](https://www.npmjs.com/package/serve-favicon)).

Some dependencies use other licences:
* the Node.js module [hjs](https://www.npmjs.com/package/hjs): Apache License 2.0;
* the Node.js module [mongodb](https://www.npmjs.com/package/mongodb): Apache License 2.0;
* the Node.js module [easyXML](https://www.npmjs.com/package/easyxml): 
 dual-licensed under [undefined versions](https://github.com/tlhunter/node-easyxml/issues/7) of BSD & GPL;
* [MongoDB](https://www.mongodb.org/licensing): [GNU Affero General Public License (AGPL) v3.0](http://www.gnu.org/licenses/agpl-3.0.html);
 * MongoDB's drivers are available under the [Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0).

