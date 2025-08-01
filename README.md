# 🎵 SoundCloud Likes Exporter

Easily convert your SoundCloud "Likes" list into **CSV** and **JSON** files using your browser's HAR data export.

---

## ⬇️ Download

| Platform                  | File (latest release)                                                               |
|---------------------------|--------------------------------------------------------------------------------------|
| **Windows (x64)**         | [soundcloud-likes-windows-x64.zip](../../releases/latest/download/soundcloud-likes-windows-x64.zip) |
| **macOS (Apple Silicon)** | [soundcloud-likes-macos-arm64.zip](../../releases/latest/download/soundcloud-likes-macos-arm64.zip) |
| **macOS (Intel)**         | [soundcloud-likes-macos-x64.zip](../../releases/latest/download/soundcloud-likes-macos-x64.zip) |
| **Linux (x64)**           | [soundcloud-likes-linux-x64.zip](../../releases/latest/download/soundcloud-likes-linux-x64.zip) |

1. Download the version for your OS.
2. Unzip it.
3. Follow the instructions below to capture your HAR file and process it.

---

## 📌 1. Capture your SoundCloud Likes data

1. Go to your SoundCloud likes page: [https://soundcloud.com/you/likes](https://soundcloud.com/you/likes).
2. Right‑click anywhere on the page and choose **Inspect** to open DevTools.
3. In the DevTools window:
   - Click the **Network** tab.
   - Click the **🚫 Clear** button (top left of Network tab) to empty the log.
   - Ensure logging is **recording** (🔴 icon). If it's grey (◉), click it once to start recording.
4. **Reload** the SoundCloud page (↻ next to the URL bar).
5. Scroll to the **very bottom** of the page until **all your likes have loaded**.
6. In the same toolbar row (Network tab), click the **"Export HAR..." button** ([📥 or ⬇️ icon]).
7. Save the file as:  
   ```
   soundcloud.com.har
   ```

---

## 📌 2. Use the SoundCloud Likes Exporter

### 🖱️ Option A – Easy Mode (No installation needed)

1. Go to the [Releases page](../../releases) and download the version for your computer:
   - **Windows (x64)** → `.zip` file for Windows  
   - **macOS Apple Silicon** → `.zip` for macOS ARM64  
   - **macOS Intel** → `.zip` for macOS x64  
   - **Linux (x64)** → `.zip` for Linux  

2. Unzip the file. Inside you’ll find:
   - `soundcloud-likes` (or `soundcloud-likes.exe` on Windows)
   - A `README_quickstart.txt` with a short summary

3. Place your `soundcloud.com.har` file **in the same folder** as the app.

4. **Double-click the app**:
   - It will create two new files in the same folder:
     - `soundcloud.com.har_tracks.json`
     - `soundcloud.com.har_tracks.csv`

5. Open the `.csv` file in Excel, Google Sheets, or similar to browse your likes list.

> **macOS:** If you see a "can't be opened" message, right‑click → **Open** → **Open**  
> **Windows:** If SmartScreen warns you, click **More info** → **Run anyway**.

---

### 💻 Option B – Developer Mode (Node.js installed)

1. Clone this repository or download the source.
2. Place your `soundcloud.com.har` file next to `index.js`.
3. Run:
   ```bash
   node index.js
   ```
4. The same `.json` and `.csv` files will be generated.

---

## 📌 3. Output details

- **CSV Columns:**
  - **Artist:** `username` or `permalink`
  - **Title:** Track title
  - **Duration:** Converted from milliseconds to `H:MM:SS`
  - **Date Added:** Date you liked the track
  - **Date Posted:** Track’s original posted date
  - **Artwork:** High‑res image URL (`-t500x500` size)

- **JSON File:** Contains the raw processed track objects for any further analysis.

---

## ⚠️ Notes & Limitations

- This tool only exports the likes **loaded on your likes page**. If SoundCloud fails to load older likes, they won't appear.
- The app isn't code‑signed yet, so macOS and Windows may show a security warning the first time you run it.
- Your HAR file may contain sensitive data, so this app processes it locally on your device — nothing is uploaded. Delete the HAR file after use to protect your privacy.

---

## 🛠️ Credits

- Created by **Joe Wood**
- Packaged with [pkg](https://github.com/vercel/pkg)
