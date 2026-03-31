import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing market id' });
  }
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const resp = await fetch(`${backendUrl}/markets/${id}`);
    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'Market not found' });
    }
    const data = await resp.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch market' });
  }
}
