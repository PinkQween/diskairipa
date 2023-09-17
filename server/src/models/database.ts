import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import * as fsPlus from 'fs'

require('dotenv').config();

const privateKeyPassphrase = process.env.passkey;

const privateKeyPath = path.join(__dirname, '../certificates/privateKey.pem');
const publicKeyPath = path.join(__dirname, '../certificates/publicKey.pem');

let privateKeyData: string; // Rename this variable

// Check if private and public key files exist, otherwise generate them
if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
  console.log('Generating RSA key pair...');
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // Adjust the key size as needed for your security requirements
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc', // Use a secure encryption algorithm for the private key
      passphrase: privateKeyPassphrase,
    },
  });

  // Save the generated keys to files
  fs.writeFileSync(privateKeyPath, privateKey, 'utf-8');
  fs.writeFileSync(publicKeyPath, publicKey, 'utf-8');

  console.log('RSA key pair generated and saved.');

  privateKeyData = privateKey; // Assign the private key to the renamed variable
} else {
  console.log('RSA key pair already exists.');
  privateKeyData = fs.readFileSync(privateKeyPath, 'utf-8'); // Read the private key from the file
}

class Database {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;

    // Check if the database file exists
    if (!fs.existsSync(this.filePath)) {
      // File doesn't exist, create it with an encrypted empty object
      const emptyObject = {};
      const encryptedEmptyObject = crypto.publicEncrypt(
        {
          key: fs.readFileSync(publicKeyPath, 'utf-8'),
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(JSON.stringify(emptyObject), 'utf-8')
      ).toString('base64');

      fs.writeFileSync(this.filePath, encryptedEmptyObject, { encoding: 'utf-8', flag: 'wx' });
    }
  }

  // Load data from the database file
  private loadData(): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            // If the file doesn't exist, initialize with an empty object
            return resolve({});
          }
          return reject(err);
        }
        if (data.length === 0) {
          // If the file is empty, return an empty object
          return resolve({});
        }
        try {
          const jsonData = JSON.parse(
            crypto.privateDecrypt(
              {
                key: privateKeyData,
                passphrase: privateKeyPassphrase,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
              },
              Buffer.from(data, undefined)
            ).toString('utf-8')
          );
          resolve(jsonData);
        } catch (parseError) {
          (parseError);
        }
      });
    });
  }  

  // Save data to the database file
  private saveData(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        this.filePath,
        crypto.publicEncrypt(
          {
            key: fs.readFileSync(publicKeyPath, 'utf-8'),
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, // Use OAEP padding
          },
          Buffer.from(JSON.stringify(data, null, 2), 'utf-8')
        ).toString('base64'),
        'utf8',
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Get data by a key
  async get(key: string): Promise<any> {
    const database = await this.loadData();
    return database
    if (key in database) {
      return database[key];
    } else {
      throw new Error(`Key '${key}' not found in the database.`);
    }
  }

  // Set data by a key
  async set(key: string, value: any): Promise<void> {
    const database = await this.loadData();
    database[key] = value;
    console.log(database);
    await this.saveData(database);
  }

  // Delete data by a key
  async delete(key: string): Promise<void> {
    const database = await this.loadData();
    delete database[key];
    await this.saveData(database);
  }
}

export default Database;
