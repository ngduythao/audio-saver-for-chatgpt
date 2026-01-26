# Audio Saver for ChatGPT

A Chrome Extension that adds a native-looking "Download Audio" button to the ChatGPT context menu.

## Purpose 🎯

I created this extension to help with **IELTS Speaking Shadowing**. 
ChatGPT's "Read Aloud" feature is great for hearing correct pronunciation and intonation, but I needed a way to download the audio files to practice offline or loop them in a music player for shadowing exercises.

## Features ✨

- **Native Integration**: Adds a "Download Audio" button to the "More actions" (...) menu of any ChatGPT message.
- **High Quality**: Downloads the audio in AAC format directly from OpenAI's synthesis API.
- **Privacy Focused**: The extension runs entirely locally. It intercepts your *own* session token to fetch the audio on your behalf. No data is sent to any third-party server.

## Installation 🛠️

1. **Clone or Download** this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the folder where you saved this project.

## Usage 📖

1. Go to [ChatGPT](https://chatgpt.com).
2. Generate a response or find an existing message.
3. Click the "..." (More actions) menu next to the message.
4. You will see a new **Download Audio** button next to the "Read Aloud" button.
5. Click it to save the audio file.

> **Note**: If the download doesn't work immediately on a refreshed page, try generating a new message or playing the "Read Aloud" once to ensure the authentication token is captured.

## Disclaimer ⚠️

This project is for educational purposes. It interacts with internal ChatGPT APIs which may change at any time. Use responsibly.
