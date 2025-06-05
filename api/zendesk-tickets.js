
export default async function handler(req, res) {
  const axios = require('axios');

  const { ZENDESK_EMAIL, ZENDESK_TOKEN, ZENDESK_SUBDOMAIN } = process.env;

  try {
    const response = await axios.get(`https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json`, {
      auth: {
        username: `${ZENDESK_EMAIL}/token`,
        password: ZENDESK_TOKEN,
      },
    });

    const tickets = response.data.tickets.slice(0, 5).map(t => ({
      id: t.id,
      subject: t.subject,
      status: t.status,
    }));

    res.status(200).json({
      outputs: [
        {
          text: `Ecco i primi 5 ticket:\n` +
                tickets.map(t => `#${t.id} - ${t.subject} [${t.status}]`).join('\n'),
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei ticket da Zendesk.' });
  }
}
