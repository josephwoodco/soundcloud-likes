const fs = require('fs');
const path = require('path');

const HAR_FILE_PATH = process.argv[2] || 'soundcloud.com.har';

function relativeToAbsolutePath(relativePath) {
  const baseDir = process.pkg ? path.dirname(process.execPath) : __dirname;
  
  return path.join(baseDir, relativePath);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate(); // Returns the day of the month (from 1 to 31)
  const month = date.toLocaleString('en-us', { month: 'short' }); // Returns the abbreviated month name (e.g., 'Jan', 'Feb')
  const year = date.getFullYear(); // Returns the 4-digit year

  return `${day} ${month === "Sep" ? "Sept" : month} ${year}`;
}

function convertToCSV(tracks) {
  const headers = ['Artist', 'Title', 'Duration', 'Date Added', 'Date Posted', 'Artwork'];

  const rows = tracks.map(e => {
    const artist = e.user?.username || e.user?.permalink || "Not found";
    const title = e.title;
    const duration = convertMsToTime(e.duration);
    const added = formatDate(e.liked_on);
    const posted = formatDate(e.display_date);
    const artwork = e.artwork_url
      ? e.artwork_url.replace("-large.", "-t500x500.")
      : e.user.avatar_url
        ? e.user.avatar_url.replace("-large.", "-t500x500.")
        : "";

    return `"${artist}","${title}","${duration}","${added}","${posted}","${artwork}"`;
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  const CSV_FILE_PATH = `${HAR_FILE_PATH}_tracks.csv`;

  fs.writeFile(relativeToAbsolutePath(CSV_FILE_PATH), csvContent, 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('Error writing the CSV file:', writeErr);
    } else {
      console.log(`CSV data has been saved to ${CSV_FILE_PATH}`);
    }
  });
}

function convertMsToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor(duration / (1000 * 60 * 60));

  const paddedSeconds = seconds.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');

  return hours > 0 ? `${hours}:${paddedMinutes}:${paddedSeconds}` : `${minutes}:${paddedSeconds}`;
}

function isBase64(str) {
  // A simple check to guess if a string is base64 encoded
  return Buffer.from(str, 'base64').toString('base64') === str;
}

function processSoundCloudData() {
  fs.readFile(relativeToAbsolutePath(HAR_FILE_PATH), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    const jsonData = JSON.parse(data);
    const entries = jsonData.log.entries;

    const filteredEntries = entries.filter(e => 
      e._resourceType === "xhr" && 
      /^https:\/\/api-v2\.soundcloud\.com\/users\/\d+\/track_likes\?/.test(e.request.url)
    );

    const responseContents = filteredEntries.map(e => {
      let content = e.response.content.text;

      // Decode from base64 if necessary
      if (isBase64(content)) {
        content = Buffer.from(content, 'base64').toString('utf8');
      }

      // Parse the JSON content
      const parsedContent = JSON.parse(content);

      return parsedContent;
    });
    
    // Flatten the array to get only the track objects
    const tracks = responseContents.flatMap(e => e.collection.map(t => (
      {
        liked_on: t.created_at,
        ...t.track
      }
    )));
    
    console.log("Number of tracks:", tracks.length);

    const TRACKS_FILE_PATH = `${HAR_FILE_PATH}_tracks.json`;

    // Convert the tracks array to JSON and remove unusual line terminators
    const jsonString = JSON.stringify(tracks, null, 2).replace(/\u2028|\u2029/g, '');
    
    fs.writeFile(relativeToAbsolutePath(TRACKS_FILE_PATH), jsonString, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing the file:', writeErr);
      } else {
        console.log(`Processed track data has been saved to ${TRACKS_FILE_PATH}`);
      }
    });

    // Convert the tracks array to CSV
    convertToCSV(tracks);
    
    return tracks;
  });
}

if (HAR_FILE_PATH)
  processSoundCloudData();