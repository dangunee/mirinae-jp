#!/usr/bin/env node
/**
 * 책 표지 이미지를 WebP로 변환
 * 사용: node scripts/convert-book-webp.cjs
 * 필요: npm install sharp
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '../public/img/textbook');
const FILES = [
  'book_han45.png',
  'book_han3.jpg',
  'book_hanjun2.jpg',
  'book_han12.jpg',
  'book_hana_dul_set_123.png',
  'book_hana_dul_set_123_chujyukyu.png',
  'book_tanguni_nihon.jpg',
  'book_tanguni_ningen.jpg',
  'book_topik1.jpg',
  'book_topik2.jpg',
];

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('sharp 패키지가 필요합니다: npm install sharp');
    process.exit(1);
  }

  for (const file of FILES) {
    const srcPath = path.join(SRC, file);
    const base = path.basename(file, path.extname(file));
    const destPath = path.join(SRC, base + '.webp');

    if (!fs.existsSync(srcPath)) {
      console.warn('건너뜀 (파일 없음):', file);
      continue;
    }

    try {
      await sharp(srcPath)
        .webp({ quality: 85 })
        .toFile(destPath);
      console.log('변환 완료:', file, '->', base + '.webp');
    } catch (err) {
      console.error('변환 실패:', file, err.message);
    }
  }
}

main();
