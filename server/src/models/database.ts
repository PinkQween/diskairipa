import fs from 'fs';
import crypto from 'crypto';

require('dotenv').config();

const getIV = async (): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync('./src/database/iv.key')) {
      fs.writeFileSync('./src/database/iv.key', crypto.randomBytes(parseInt(process.env.IV || '16')).toString('hex'));
    }

    fs.readFile('./src/database/iv.key', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(Buffer.from(data, 'hex'));
      }
    });
  });
};

class Database {
  private filePath: string;
  private encryptionKey: Buffer; // The secret key for AES encryption

  async saveDatabase(data: Object): Promise<void> {
    const iv: Buffer = await getIV();

    const jsonData = JSON.stringify(data);

    // Create an AES cipher using the encryption key and IV
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);

    // Encrypt the data
    const encryptedData = Buffer.concat([iv, cipher.update(jsonData, 'utf-8'), cipher.final()]);

    // Write the encrypted data to the database file
    fs.writeFileSync(this.filePath, encryptedData);
  }

  // async set(key: string, value: { name: string; age: number; }) {
  //   const data: any = this.readDatabase();
  //   data[key] = value;
  //   this.writeDatabase(data);
  // }

  // async get(key: string) {
  //   const data: any = this.readDatabase();
  //   return data[key];
  // }

  // encryptChunk(chunk: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) {
  //   const encryptedChunk = crypto.publicEncrypt(
  //     {
  //       key: publicKeyData,
  //       padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  //     },
  //     Buffer.from(chunk, 'utf-8')
  //   ).toString('base64');
    
  //   return encryptedChunk;
  // }

  // decryptChunk(chunk: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) {
  //   const decryptedChunk = crypto.privateDecrypt(
  //     {
  //       key: privateKeyData,
  //       padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  //     },
  //     Buffer.from(chunk, 'base64')
  //   ).toString('utf-8');
    
  //   return decryptedChunk;
  // }

  // writeDatabase(data: {}) {
  //   const jsonData = JSON.stringify(data);
  //   const chunks = [];

  //   for (let i = 0; i < jsonData.length; i += this.chunkSize) {
  //     const chunk = jsonData.substr(i, this.chunkSize);
  //     const encryptedChunk = this.encryptChunk(chunk);
  //     chunks.push(encryptedChunk);
  //   }

  //   const encryptedData = chunks.join('');
  //   fs.writeFileSync(this.databasePath, encryptedData, 'utf-8');
  // }

  // readDatabase() {
  //   if (!fs.existsSync(this.databasePath)) {
  //     return {};
  //   }

  //   const encryptedData = fs.readFileSync(this.databasePath, 'utf-8');
  //   const chunks = encryptedData.match(/.{1,256}/g) || [];

  //   const data = {};

  //   for (let i = 0; i < chunks.length; i++) {
  //     const chunk = chunks[i];
  //     const decryptedChunk = this.decryptChunk(chunk);
  //     const chunkData = JSON.parse(decryptedChunk);

  //     Object.assign(data, chunkData);
  //   }

  //   return data;
  // }

  // Load data from the database file
  async loadData(): Promise<any> {
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
  
        // Ensure that the IV used for decryption matches the one used for encryption
        const iv = data.slice(0, 16); // Assuming 16 bytes IV size for AES-256-CBC
        const encryptedData = data.slice(16);
  
        // Debugging: Log key, IV, and encryptedData
        console.log('Key:', this.encryptionKey.toString('hex'));
        console.log('IV:', iv.toString('hex'));
        console.log('Encrypted Data:', encryptedData.toString('hex'));
  
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
        decipher.setAutoPadding(true);
  
        try {
          // Attempt to decrypt the data
          let decryptedData = decipher.update(Buffer.from(encryptedData), undefined, 'utf-8');
          decryptedData += decipher.final('utf-8');
          
          // Debugging: Log the decrypted data
          console.log('Decrypted Data:', decryptedData);
  
          // Resolve with decryptedData
          resolve(decryptedData);
        } catch (error) {
          // Handle decryption errors
          console.error('Decryption Error:', error);
          reject(error);
        }
      });
    });
  }
  
  

  // Save data to the database file
  private saveData(data: any): void {
    this.saveDatabase(data);
  }

  // Get data by a key
  async get(): Promise<any> {
    const database = await this.loadData();
    console.log(database);
    return database
    // if (key in database) {
    //   return database[key];
    // } else {
    //   return database
    //   throw new Error(`Key '${key}' not found in the database.`);
    // }
  }

  // Set data by a key
  async set(value: object): Promise<void> {
    let database = await this.loadData();
    database = value;
    console.log(database);
    await this.saveData(database);
  }

  // Delete data by a key
  async delete(key: string): Promise<void> {
    const database = await this.loadData();
    delete database[key];
    await this.saveData(database);
  }

  constructor(filePath: string, encryptionKey: string) {
    this.filePath = filePath;
    // Convert the encryption key from a string to a buffer
    this.encryptionKey = Buffer.from(encryptionKey, 'hex');

    this.set({})
  }
}

const db = new Database('./src/database/data.pck', process.env.KEY ? process.env.KEY : '5671ac291cfa7c3c4ce2beec0c7879a9b4110fc3cce90c78953e10b5f664685a')

export default db;

// function generateRandomAESKey(keyLengthInBits: number) {
//   if (![128, 192, 256].includes(keyLengthInBits)) {
//     throw new Error('Invalid key length. Please choose 128, 192, or 256 bits.');
//   }

//   const keyBytes = keyLengthInBits / 8;
//   return crypto.randomBytes(keyBytes).toString('hex');
// }

// const aes256Key = generateRandomAESKey(256);
// console.log('AES-256 Key:', aes256Key);