import fs from 'node:fs/promises';
import path from 'node:path';

function sanitizeFileName(value) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').toLowerCase();
}

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function saveUploadedFile(file, subdirectory, prefix = 'file') {
  if (!file || typeof file.arrayBuffer !== 'function' || !file.size) {
    return '';
  }

  const safeSubdirectory = subdirectory.replace(/^\/+|\/+$/g, '');
  const targetDirectory = path.join(process.cwd(), 'public', 'uploads', safeSubdirectory);
  await ensureDirectory(targetDirectory);

  const extension = path.extname(file.name || '') || '.bin';
  const safeBaseName = sanitizeFileName(path.basename(file.name || prefix, extension)) || prefix;
  const fileName = `${prefix}-${Date.now()}-${safeBaseName}${extension}`;
  const absolutePath = path.join(targetDirectory, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(absolutePath, buffer);
  return `/uploads/${safeSubdirectory}/${fileName}`;
}

export async function saveUploadedFiles(files, subdirectory, prefix = 'file') {
  const savedPaths = [];
  for (const file of files) {
    const savedPath = await saveUploadedFile(file, subdirectory, prefix);
    if (savedPath) {
      savedPaths.push(savedPath);
    }
  }
  return savedPaths;
}

