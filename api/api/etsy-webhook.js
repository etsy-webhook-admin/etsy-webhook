/**
 * VERCEL-READY ETSY WEBHOOK
 */

const https = require('https');

export default async function handler(req, res) {
      if (req.method !== 'POST') {
              return res.status(405).json({ error: 'Method not allowed. Use POST.' });
      }

  try {
          console.log('✅ Webhook received POST request');

        const designsData = await callClaudeAPI();

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
}

async function callClaudeAPI() {
      const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
          throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const prompt = `You are the new-etsy-designer skill...`;

  // [Rest of the code from the corrected file]
}
