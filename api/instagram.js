const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  const url = req.query.url;
  if (!url || !url.includes("instagram.com")) {
    return res.status(400).json({ status: false, message: "Invalid or missing Instagram URL" });
  }

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = require("cheerio").load(data);
    const video = $('meta[property="og:video"]').attr("content");
    const image = $('meta[property="og:image"]').attr("content");

    if (video) return res.json({ status: true, type: "video", url: video });
    if (image) return res.json({ status: true, type: "image", url: image });

    return res.status(404).json({ status: false, message: "No media found." });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
