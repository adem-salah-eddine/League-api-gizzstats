export default async function handler(req, res) {
  const { summonerName, region } = req.query;
  const API_KEY = process.env.RIOT_API_KEY;

  try {
    const summonerRes = await fetch(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${API_KEY}`
    );
    const summonerData = await summonerRes.json();

    if (summonerData.status) {
      return res.status(404).json({ error: "Summoner not found" });
    }

    const rankRes = await fetch(
      `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${API_KEY}`
    );
    const rankData = await rankRes.json();

    res.status(200).json({
      summoner: summonerData.name,
      level: summonerData.summonerLevel,
      ranks: rankData
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
