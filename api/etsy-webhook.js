/**
 * VERCEL-READY ETSY WEBHOOK
 */

const https = require('https');

module.exports = async (req, res) => {
      if (req.method !== 'POST') {
              return res.status(405).json({ error: 'Method not allowed. Use POST.' });
      }

      try {
              console.log('🎨 webhook received POST request');
              const designsData = await callclaudeAPI();
              return res.status(200).json({
                        success: true,
                        timestamp: new Date().toISOString(),
                        designs: designsData,
                        message: '5 Etsy designs generated successfully'
              });
      } catch (error) {
              console.error('❌ Error in webhook:', error);
              return res.status(500).json({
                        success: false,
                        error: error.message,
                        message: 'Failed to generate designs'
              });
      }
};

async function callclaudeAPI() {
      const prompt = `You are an Etsy product title and tag expert. Create 5 unique, SEO-optimized Etsy product listings.
      For each, provide:
      - Product title (55 characters max)
      - 13 tags (CSV format)
      Format as JSON array.`;

  return new Promise((resolve, reject) => {
          const data = JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 1024,
                    messages: [
                        {
                                      role: 'user',
                                      content: prompt
                        }
                              ]
          });

                         const options = {
                                   hostname: 'api.anthropic.com',
                                   port: 443,
                                   path: '/v1/messages',
                                   method: 'POST',
                                   headers: {
                                               'Content-Type': 'application/json',
                                               'Content-Length': data.length,
                                               'anthropic-version': '2023-06-01',
                                               'x-api-key': process.env.ANTHROPIC_API_KEY
                                   }
                         };

                         const req = https.request(options, (res) => {
                                   let responseData = '';
                                   res.on('data', (chunk) => {
                                               responseData += chunk;
                                   });
                                   res.on('end', () => {
                                               try {
                                                             const parsed = JSON.parse(responseData);
                                                             if (parsed.content && parsed.content[0]) {
                                                                             resolve(parsed.content[0].text);
                                                             } else {
                                                                             reject(new Error('Invalid API response structure'));
                                                             }
                                               } catch (error) {
                                                             reject(new Error(`Failed to parse API response: ${error.message}`));
                                               }
                                   });
                         });

                         req.on('error', (error) => {
                                   reject(new Error(`API request failed: ${error.message}`));
                         });

                         req.write(data);
          req.end();
  });
}
