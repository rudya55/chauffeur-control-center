const fs = require('fs');
const path = require('path');

const files = [ 'alert1.wav.b64', 'alert2.wav.b64', 'chime.wav.b64', 'default.wav.b64' ];

const repoRoot = path.resolve(__dirname, '..');
const publicSoundsDir = path.join(repoRoot, 'public', 'sounds');
const androidRawDir = path.join(repoRoot, 'android', 'app', 'src', 'main', 'res', 'raw');

if (!fs.existsSync(publicSoundsDir)) fs.mkdirSync(publicSoundsDir, { recursive: true });
if (!fs.existsSync(androidRawDir)) fs.mkdirSync(androidRawDir, { recursive: true });

files.forEach((b64name) => {
  const b64path = path.join(publicSoundsDir, b64name);
  if (!fs.existsSync(b64path)) {
    console.warn('Missing base64 file:', b64path);
    return;
  }

  try {
    const b64 = fs.readFileSync(b64path, 'utf8').trim();
    const buf = Buffer.from(b64, 'base64');
    const wavName = b64name.replace('.b64', '');

    const publicOut = path.join(publicSoundsDir, wavName);
    const androidOut = path.join(androidRawDir, wavName);

    fs.writeFileSync(publicOut, buf);
    fs.writeFileSync(androidOut, buf);

    console.log('Decoded', b64name, '->', publicOut, 'and', androidOut);
  } catch (e) {
    console.error('Failed to decode', b64name, e);
  }
});

console.log('Done. Replace files in public/sounds and android/res/raw with your real audio files as needed.');
