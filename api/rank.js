export default async function handler(req, res) {
  const { summonerName, region } = req.query;
  const API_KEY = process.env.RIOT_API_KEY;

  if (!summonerName || !region) {
    return res.status(400).json({ error: "Missing summonerName or region" });
  }

  try {
    // 1. Get Summoner data
    const summonerRes = await fetch(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${API_KEY}`,
      { headers: { "Accept": "application/json" } }
    );

    const summonerData = await summonerRes.json();

    if (!summonerRes.ok) {
      return res.status(summonerRes.status).json({
        error: "Failed to fetch summoner",
        details: summonerData,
      });
    }

    // 2. Get Rank data
    const rankRes = await fetch(
      `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${API_KEY}`,
      { headers: { "Accept": "application/json" } }
    );

    const rankData = await rankRes.json();

    if (!rankRes.ok) {
      return res.status(rankRes.status).json({
        error: "Failed to fetch rank",
        details: rankData,
      });
    }

    // 3. Send response
    res.status(200).json({
      summoner: summonerData.name,
      level: summonerData.summonerLevel,
      ranks: rankData,
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
