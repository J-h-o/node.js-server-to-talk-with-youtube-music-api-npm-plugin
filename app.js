const { YTMUSIC } = require("./ytmusic-api-master/dist/index.js");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

const api = new YTMUSIC(
  "CONSENT=YES+srp.gws-20210329-0-RC1.el+FX+532; VISITOR_INFO1_LIVE=gyQmpeVN-Jk; LOGIN_INFO=AFmmF2swRQIhAOd6d9G_kEOmAQrVRoKYlsdmAwvqtGDgTIPF-AQ6atm-AiB-N6v3nBZ41VxsYvpa48yvjJiZameYPTuWibIeZy3LyQ:QUQ3MjNmeG1CS3R6MEg1UndHWGU0b1YzSWh6SWVsU0RrVF80Y3owXy1IcEdzbjJIYnpqUnAyZzVVSldsS3JoSHk2U0NSaHJyVTNkbUlIZHNyazBDTFBhOFpENTdxN3JHcXU0Z0lXdURjemxZMTNsd0JZR3B5OVVudnVVQlJVNGF0UmdVRlZpQTVONEszVUpBWUt2RDFlUXF1ZUNXcDZOTjNB; YSC=fgO8_FmVc94; wide=1; HSID=AAjjVzSbcyNLd0alZ; SSID=Alo5AiDoCfdXsF23i; APISID=EudE3yZJk_m0jgHo/Aekgz9ZlD3N1xkDZS; SAPISID=84Q7a-6BkOB5Skr7/AJgJtGzOzIHllryzF; __Secure-1PAPISID=84Q7a-6BkOB5Skr7/AJgJtGzOzIHllryzF; __Secure-3PAPISID=84Q7a-6BkOB5Skr7/AJgJtGzOzIHllryzF; SID=DggPM-4rU0COKdlkrsKbSQB5QNuS_YO7IJVRCOytaBw20TB5GOueeoj-4cji2UunGLAPkw.; __Secure-1PSID=DggPM-4rU0COKdlkrsKbSQB5QNuS_YO7IJVRCOytaBw20TB5zYC4dXwW74r5PgiLmovxtg.; __Secure-3PSID=DggPM-4rU0COKdlkrsKbSQB5QNuS_YO7IJVRCOytaBw20TB59Aifv1Ei5UvvYVSPO8latQ.; _gcl_au=1.1.629579829.1637844655; PREF=tz=Europe.Athens&f6=400&volume=100; SIDCC=AJi4QfEwQFOxuSbo9Wkk2pGDmg3scjEtvfxkT2c-1scZIzUaHm0Sh3vBXjmfPSGbVJZabuv2JiI; __Secure-3PSIDCC=AJi4QfGrQ_s3QAF_4faSUJ70Ng7uWECFfSSYJmJg0ZnxRs9FOVZzGh7RlELCrnvKuBc2R8z8jkk"
);

app.get("/artist/:artistName", async (req, res) => {
  const artistName = req.params.artistName;
  let data = await api.search(artistName, { filter: "artists" });
  let dataThumbnail = data[0].thumbnails[0].url;
  let re = /(=).*/;
  let artistThumbnail = { artistThumbnail: dataThumbnail.replace(re, "") };
  let ex = data[0].url.replace("https://music.youtube.com/browse/", "");
  let artist = await api.getArtist(ex);
  let finalArtist = Object.assign(artist, artistThumbnail);
  res.send(finalArtist);
});

app.get("/playlist/:playlistId", async (req, res) => {
  const playlistId = req.params.playlistId;
  let data = await api.getPlaylist(playlistId);
  res.send(data);
});

app.get("/search/:query", async (req, res) => {
  const query = req.params.query;

  let top = await api.search(query);
  let songs = await api.search(query, { filter: "songs" });
  let albums = await api.search(query, { filter: "albums" });

  let artistName = songs[0].artist_browse_id;

  let album = [await albums[0], await albums[1], await albums[2]];
  let artist = await api.getArtist(artistName);
  let finalArtist = Object.assign(artist, { id: artistName });
  let topResult = await top[0];

  let data = [songs, album, finalArtist, topResult];

  res.send(data);
});

app.get("/hello", async (req, res) => {
  const test = "test";
  res.send(test);
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server listening on port 4000");
});
