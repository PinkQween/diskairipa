import * as types from '../../types';
import fetch from 'node-fetch';
import sharp from 'sharp';

const express = require('express');

const router = express.Router();

async function fetchImageFromCDN(url: string): Promise<Buffer> {
    // try {
    //   const response = await fetch(url);
  
    //   if (!response.ok) {
    //     throw new Error(`Failed to fetch image from CDN: ${response.statusText}`);
    //   }
  
    //   const contentType = response.headers.get('content-type');
  
    //   if (contentType && contentType.startsWith('image/svg')) {
    //     // If the fetched image is an SVG, return it as a Blob without conversion.
    //     const imageBuffer = await response.buffer();
    //     return imageBuffer;
    //   } else {
    //     // If it's not an SVG, convert it to PNG using sharp.
    //     const imageBuffer = await response.buffer();
    //     const pngBuffer = await sharp(imageBuffer).png().toBuffer();
    //     // console.log(new Blob([pngBuffer], { type: 'image/png' }))
    //     return imageBuffer;
    //   }
    // } catch (error) {
    //   console.error('Error fetching or converting image from CDN:', error);
    //   throw error;
    // }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch image from CDN: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');

        const buffer = await response.buffer();
        return buffer
    } catch (error) {
        console.error('Error fetching or converting image from CDN:', error);
        throw error;
    }
}

router.get('/', async (req: any, res: any) => {
    try {
        let movieBuffer = await fetchImageFromCDN("http://cdn.diskairipa.hannaskairipa.com/64e6.mp4")

        // imageBuffer = await fetchImageFromCDN("https://imgv3.fotor.com/images/cover-photo-image/a-beautiful-girl-with-gray-hair-and-lucxy-neckless-generated-by-Fotor-AI.jpg")
      
      // You can set the appropriate Content-Type header based on the image type.
      // For SVG, you can use 'image/svg+xml', and for PNG, you can use 'image/png'.
      res.setHeader('Content-Type', 'video/mp4'); // Adjust the Content-Type as needed
  
      // Send the image buffer as the response.
      res.send(movieBuffer);
    } catch (error) {
      console.error('Error sending image:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;