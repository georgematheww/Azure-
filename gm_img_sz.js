const { app } = require('@azure/functions');
const axios = require('axios');
const sharp = require('sharp');

app.http('gm_img_sz', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    // Set the image URL to test with
    const imageUrl = 'https://www.w3schools.com/w3images/lights.jpg';
    context.log(`Image URL: ${imageUrl}`);

    if (imageUrl) {
      try {
        // Fetch the image
        const response = await axios({ url: imageUrl, responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Process and resize the image
        const resizedImageBuffer = await sharp(imageBuffer).resize(250, 250).toBuffer();

        // Return the processed image
        context.res = {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': 'inline; filename="resized.png"'
          },
          body: resizedImageBuffer,
          isRaw: true
        };
      } catch (error) {
        context.log(`Error processing image: ${error.message}`);
        context.res = {
          status: 500,
          body: `Error processing image: ${error.message}`
        };
      }
    } else {
      context.res = {
        status: 400,
        body: 'No image URL provided.'
      };
    }

    return context.res;
  }
});

