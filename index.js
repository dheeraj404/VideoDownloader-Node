const express = require("express");
const fbDownloader = require("fb-downloader-scrapper");
const request = require("request");
const instagramGetUrl = require("instagram-url-direct");
const app = express();
const port = 3000;
const twitterGetUrl = require("twitter-url-direct");
const puppeteer = require("puppeteer");
const twitterDl = require('twitter-dl');
const cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path"); // Import the path module





// Endpoint to download and stream the video
app.get("/download-video", async (req, res) => {
  const videoUrl = req.query.url; // Get the Facebook video URL from the query param

  try {
    // Fetch media data from fb-downloader-scrapper
    const media = await fbDownloader(videoUrl);

    // Check if media contains HD or SD URL
    const videoDownloadUrl = media.hd || media.sd;

    if (!videoDownloadUrl) {
      return res.status(400).send("No downloadable video found.");
    }

    // Set appropriate headers for video streaming
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", "attachment; filename=video.mp4");

    // Stream the video directly to the frontend
    request(videoDownloadUrl)
      .on("error", (err) => {
        console.error("Error while streaming the video:", err);
        res.status(500).send("Error while streaming the video");
      })
      .pipe(res);
  } catch (error) {
    console.error("Error while fetching the video:", error);
    res.status(500).json({ error: "Failed to fetch video" });
  }
});
app.get("/download-instagram-video", async (req, res) => {
  const videoUrl = req.query.url; // Get the Instagram video URL from the query param

  try {
    // Fetch the download URL for the Instagram video
    const videoInfo = await instagramGetUrl(videoUrl);

    if (!videoInfo.url_list || videoInfo.url_list.length === 0) {
      return res.status(400).send("No downloadable video found.");
    }

    // Instagram video URL (first URL in the list)
    const videoDownloadUrl = videoInfo.url_list[0];

    // Set appropriate headers for video streaming
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=instagram_video.mp4"
    );

    // Stream the video directly to the frontend
    request(videoDownloadUrl)
      .on("error", (err) => {
        console.error("Error while streaming the video:", err);
        res.status(500).send("Error while streaming the video");
      })
      .pipe(res);
  } catch (error) {
    console.error("Error while fetching the Instagram video:", error);
    res.status(500).json({ error: "Failed to fetch Instagram video" });
  }
});



'use strict';

// Import the hypothetical twitter-dl package





const axios = require('axios');


async function downloadVideo(videoUrl) {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  let videoSourceUrl = null; // This will hold the video URL

  page.on('request', request => {
      if (request.resourceType() === 'media') {
          videoSourceUrl = request.url(); // Capture the URL
          console.log('Media URL found:', videoSourceUrl);
      }
  });

  await page.goto(videoUrl, { waitUntil: 'networkidle2' });

  // Wait for potential video source to load using a universal JavaScript approach
  await new Promise(resolve => setTimeout(resolve, 10000));

  if (videoSourceUrl) {
      await downloadFile(videoSourceUrl, 'video.mp4'); // Download the video
  } else {
      console.log('No video URL found');
  }

  await browser.close();
}

async function downloadFile(fileUrl, outputPath) {
  const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream'
  });

  const writer = fs.createWriteStream(outputPath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
  });
}



downloadVideo('https://x.com/TheWorldOfFunny/status/1827099171968450631');





app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
