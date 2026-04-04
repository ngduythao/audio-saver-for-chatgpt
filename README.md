# ChatGPT Audio Downloader

Chrome extension that adds a **Download Audio** action to ChatGPT's message menu so you can save read-aloud audio as a file.

![Demo](demo.gif)

## What it does

ChatGPT can read messages aloud, but there's no built-in way to keep that audio. This extension pulls the same high-quality stream (AAC from OpenAI's synthesis flow) and saves it to disk. Handy for offline listening, looping in a player, or archiving.

## Features

**Download from the menu.** "Download Audio" shows in the "More actions" (...) menu next to "Read Aloud".

**High quality.** Audio is saved in AAC, matching what the app uses for playback.

**Runs locally.** Your session is used to request audio. Nothing is sent to a separate third-party service.

## Install

Clone or download this repo.

Open `chrome://extensions` in Chrome.

Turn on **Developer mode** (top right).

Click **Load unpacked** and choose this project folder.

## Use

Open [ChatGPT](https://chatgpt.com).

Open the **...** menu on a message.

Choose **Download Audio**.

If a download fails after a refresh, try a new message or play **Read Aloud** once so the session token is available.

## Disclaimer

For learning and personal use. It relies on ChatGPT's internal APIs, which can change. Use responsibly.
