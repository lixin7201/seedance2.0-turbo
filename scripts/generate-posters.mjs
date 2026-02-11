/**
 * Generate poster thumbnails (WebP) from video files using HTML Canvas.
 * Run: node scripts/generate-posters.mjs
 *
 * This script creates a simple HTML page, opens it with the system browser,
 * and uses Canvas to extract the first frame. Since we don't have ffmpeg,
 * we use a Node.js approach with child_process to call system Python.
 */
import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';

const videosDir = join(process.cwd(), 'public', 'videos');

// Get all mp4 files
const videos = readdirSync(videosDir).filter(f => f.endsWith('.mp4'));

console.log(`Found ${videos.length} video files:`);
videos.forEach(v => console.log(`  - ${v}`));

// Try to use ffmpeg first
let useFFmpeg = false;
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
  useFFmpeg = true;
  console.log('\\nUsing ffmpeg for poster generation');
} catch {
  console.log('\\nffmpeg not found. Trying Python + opencv...');
}

if (useFFmpeg) {
  for (const video of videos) {
    const posterName = basename(video, extname(video)) + '-poster.webp';
    const posterPath = join(videosDir, posterName);
    
    if (existsSync(posterPath)) {
      console.log(`  ✓ ${posterName} already exists, skipping`);
      continue;
    }

    try {
      execSync(
        `ffmpeg -i "${join(videosDir, video)}" -vframes 1 -q:v 2 "${posterPath}"`,
        { stdio: 'inherit' }
      );
      console.log(`  ✓ Generated ${posterName}`);
    } catch (err) {
      console.error(`  ✗ Failed to generate ${posterName}:`, err.message);
    }
  }
} else {
  // Fallback: try Python with cv2
  let usePython = false;
  try {
    execSync('python3 -c "import cv2"', { stdio: 'ignore' });
    usePython = true;
    console.log('Using Python + opencv for poster generation');
  } catch {
    console.log('Python opencv not available either.');
  }

  if (usePython) {
    for (const video of videos) {
      const posterName = basename(video, extname(video)) + '-poster.webp';
      const posterPath = join(videosDir, posterName);
      
      if (existsSync(posterPath)) {
        console.log(`  ✓ ${posterName} already exists, skipping`);
        continue;
      }

      const pyCmd = `python3 -c "
import cv2
cap = cv2.VideoCapture('${join(videosDir, video)}')
ret, frame = cap.read()
if ret:
    cv2.imwrite('${posterPath}', frame, [cv2.IMWRITE_WEBP_QUALITY, 80])
    print('OK')
else:
    print('FAIL')
cap.release()
"`;
      try {
        const result = execSync(pyCmd, { encoding: 'utf-8' }).trim();
        if (result === 'OK') {
          console.log(`  ✓ Generated ${posterName}`);
        } else {
          console.error(`  ✗ Failed to generate ${posterName}`);
        }
      } catch (err) {
        console.error(`  ✗ Failed to generate ${posterName}:`, err.message);
      }
    }
  } else {
    console.log('\\n⚠️  Neither ffmpeg nor Python opencv is available.');
    console.log('Please install one of them and run this script again:');
    console.log('  brew install ffmpeg');
    console.log('  # or');
    console.log('  pip3 install opencv-python');
    console.log('\\nAlternatively, manually create poster images from video first frames');
    console.log('and save them as <video-name>-poster.webp in public/videos/');
    process.exit(1);
  }
}

console.log('\\nDone!');
