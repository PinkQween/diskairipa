const express = require('express');
const fs = require('fs');
const path = require('path');
var http = require('http');
const https = require("https");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 80;
const httpsPort = process.env.HTTPSPORT || 443;

const routesDirectory = path.join(__dirname, 'routes');

// Function to get the latest version
function getLatestVersion() {
  try {
    // Read all subdirectories in the versions directory
    const subdirectories = fs.readdirSync(routesDirectory, { withFileTypes: true })
      .filter((dirent: { isDirectory: () => any; name: string; }) => dirent.isDirectory() && dirent.name.startsWith('@V'))
      .map((dirent: { name: any; }) => dirent.name);

    // Sort the versions in descending order
    const sortedVersions = subdirectories.sort((a: string, b: string) => {
      // Extract the version numbers (assuming directory names are like @Vx.x.x)
      const versionA = a.substring(2);
      const versionB = b.substring(2);

      // Compare versions as strings (lexicographically)
      return versionB.localeCompare(versionA);
    });

    // Return the latest version
    if (sortedVersions.length > 0) {
      return sortedVersions[0];
    } else {
      return null; // No versions found
    }
  } catch (error) {
    console.error('Error getting latest version:', error);
    return null;
  }
}


// Middleware to handle subdomain routing
app.use((req: { subdomains: string | any[]; url: any; path: string; baseUrl: string; }, res: { sendFile: (arg0: any) => any; status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; redirect: (arg0: number, arg1: string) => void; }, next: () => void) => {
  const subdomain = req.subdomains[req.subdomains.length - 1]; // Get the first subdomain (e.g., cdn)
  const requestedPath = req.url;

  if (subdomain?.includes('cdn')) {
    // Handle requests for the CDN subdomain (e.g., cdn.hannaskairipa.com)
    // You can add specific CDN-related routing logic here
    // For example, serve files from the ./cdn folder
    const cdnPath = path.join(__dirname, 'cdn', requestedPath);
    if (fs.existsSync(cdnPath) && fs.statSync(cdnPath).isFile()) {
      return res.sendFile(cdnPath);
    } else {
      // Handle cases where the file does not exist in the CDN
      return res.status(404).send('File not found in CDN');
    }
  } else {
    if (!requestedPath.startsWith('/tests')) {
      // Check if the requested path is not in the @Vx.x.x format
      if (!requestedPath.match(/^\/@V\d+\.\d+\.\d+/)) {
        // Get the latest version
        const latestVersion = getLatestVersion();

        if (latestVersion) {
          // Add the latest version to the beginning of the path
          console.log(req.path)
          res.redirect(301, req.baseUrl + latestVersion + req.path)
        }
      }
    }

    // Handle requests for other subdomains (e.g., api.hannaskairipa.com)
    // Load API routes as before
    next();
  }
});


// Recursive function to load routes from subdirectories
function loadRoutes(directory: any, baseRoute = '') {
  fs.readdirSync(directory).forEach((file: any) => {
    const routePath = path.join(directory, file);

    if (fs.statSync(routePath).isDirectory()) {
      // If it's a directory, recursively load routes from it
      const subRoute = path.join(baseRoute, file);
      loadRoutes(routePath, subRoute);
    } else if (file === 'index.ts') {
      const route = require(routePath);
      app.use(`/${baseRoute}`, route);
    } else if (file.endsWith('.ts')) {
      const route = require(routePath);
      const routeName = path.basename(file, '.ts');
      app.use(`/${baseRoute}/${routeName}`, route);
    }
  });
}

// Enable dots as path separators in Express routes
app.set('strict routing', false);

// Start loading routes from the main directory
loadRoutes(routesDirectory);

console.log(getLatestVersion())

// Start the server
// try {
//   https.createServer({
//         key: fs.readFileSync("./src/certificates/ssl/key.pem"),
//         cert: fs.readFileSync("./src/certificates/ssl/cert.pem"),
//       },
//       app).listen(port, () => {
//     console.log(`Server is listening on port ${port} with https!`);
//   });
// } catch (err) {
//   console.log(err)

//   app.listen(port, () => {
//     console.log(`Server is listening on port ${port} with http`);
//   });
// }

var httpServer = http.createServer(app);
var httpsServer = https.createServer({
  key: fs.readFileSync("./src/certificates/ssl/key.pem", 'utf8'),
  cert: fs.readFileSync("./src/certificates/ssl/cert.pem", 'utf8'),
}, app);

httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port} with http`);
});

httpsServer.listen(httpsPort, () => {
  console.log(`Server is listening on port ${httpsPort} with https!`);
});