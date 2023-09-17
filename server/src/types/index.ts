// const fs = require('fs');
// const path = require('path');

// const directory = path.join(__dirname); // Go up one level to the parent directory

// console.log(directory);

// const loadAndExportInterfaces = async (directory: any) => {
//   const files = fs.readdirSync(directory);

//   console.log(files);

//   for (const file of files) {
//     const filePath = path.join(directory, file);
//     const { name, ext } = path.parse(filePath);

//     if (ext === '.ts' && file !== 'index.ts') {
//       const importedModule = require(filePath);
//       const interfaceExport = importedModule; // Use require and access the default export
//       exports[name] = interfaceExport;
//     } else if (fs.statSync(filePath).isDirectory()) {
//       await loadAndExportInterfaces(filePath);
//     }
//   }
// }

// loadAndExportInterfaces(directory);


import Image from "./Image";
import Message from "./Message";
import Reaction from "./Reaction";
import User from "./User";
import Channels from "./Channels";
import permissions from "./Permissions";
import Roles from "./Roles";
import Server from "./Server";
import TextChannel from "./TextChannel";

export {
  Image,
  Message,
  Reaction,
  User,
  Channels,
  permissions,
  Roles,
  Server,
  TextChannel
}