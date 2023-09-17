import * as types from '../../types';
import fetch from 'node-fetch';
import sharp from 'sharp';

const express = require('express');

const router = express.Router();

async function fetchImageFromCDN(url: string): Promise<Buffer> {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch image from CDN: ${response.statusText}`);
      }
  
      const contentType = response.headers.get('content-type');
  
      if (contentType && contentType.startsWith('image/svg')) {
        // If the fetched image is an SVG, return it as a Blob without conversion.
        const imageBuffer = await response.buffer();
        return imageBuffer;
      } else {
        // If it's not an SVG, convert it to PNG using sharp.
        const imageBuffer = await response.buffer();
        const pngBuffer = await sharp(imageBuffer).png().toBuffer();
        // console.log(new Blob([pngBuffer], { type: 'image/png' }))
        return imageBuffer;
      }
    } catch (error) {
      console.error('Error fetching or converting image from CDN:', error);
      throw error;
    }
}

const getMessage = async () => {
    const message: types.Server = {
        channels: [
            {
                textChannels: [
                    {
                        id: 'fbhds',
                        users: [
                            {
                                id: 'trew',
                                username: "User"
                            }
                        ],
                        messages: [
                            {
                                id: "string",
                                content: "string",
                                author: {
                                    id: 'trew',
                                    username: "User"
                                },
                                timestamp: new Date(),
                                images: [
                                    {
                                        data: await fetchImageFromCDN("http://cdn.diskairipa.hannaskairipa.com/435.png")
                                    }
                                ],
                                reactions: [
                                    {
                                        emoji: {
                                            data: await fetchImageFromCDN("http://cdn.diskairipa.hannaskairipa.com/435.png")
                                        },
                                        count: 3,
                                        users: [
                                            {
                                                id: 'trew',
                                                username: "User"
                                            }
                                        ]
                                    }
                                ],
                            }
                        ]
                    }
                ]
            }
        ],
        roles: [],
        id: ''
    }

    return message;
}

router.get('/', async (req: any, res: any) => {
    try {
        const message = await getMessage()
        let imageBuffer: Buffer;
        if (
            message &&
            message.channels &&
            message.channels[0] &&
            message.channels[0].textChannels &&
            message.channels[0].textChannels[0] &&
            message.channels[0].textChannels[0].messages &&
            message.channels[0].textChannels[0].messages[0] &&
            message.channels[0].textChannels[0].messages[0].images &&
            message.channels[0].textChannels[0].messages[0].images[0] &&
            await message.channels[0].textChannels[0].messages[0].images[0].data
          ) {
            imageBuffer = message.channels[0].textChannels[0].messages[0].images[0].data;
        } else {
            imageBuffer = await fetchImageFromCDN("https://cdn.diskairipa.hannaskairipa.com/435.png")
        }

        // imageBuffer = await fetchImageFromCDN("https://imgv3.fotor.com/images/cover-photo-image/a-beautiful-girl-with-gray-hair-and-lucxy-neckless-generated-by-Fotor-AI.jpg")
      
      // You can set the appropriate Content-Type header based on the image type.
      // For SVG, you can use 'image/svg+xml', and for PNG, you can use 'image/png'.
      res.setHeader('Content-Type', 'image/png'); // Adjust the Content-Type as needed
  
      // Send the image buffer as the response.
      res.send(imageBuffer);
    } catch (error) {
      console.error('Error sending image:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;