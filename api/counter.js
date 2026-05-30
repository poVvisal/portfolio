import { incrementVisits } from '../server/counter.js';

export default async function handler(req, res) {
  try {
    const metrics = await incrementVisits(globalThis.process?.env ?? {}, {
      referrer: req.headers['x-referrer'] ?? req.headers.referer ?? '',
      host: req.headers.host ?? '',
    });

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Redis Error:', error);
    res.status(500).json({
      total: '---',
      weekly: { current: 0, previous: 0, changePct: null },
      monthly: { current: 0, previous: 0, changePct: null },
      sparkline: [],
      referrers: [],
    });
  }
}