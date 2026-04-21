import { handleZapierTrigger } from '../lib/etsy-webhook';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
    }

  try {
        const result = await handleZapierTrigger(req.body);
        return res.status(200).json({ success: true, data: result });
  } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: error.message });
  }
}
