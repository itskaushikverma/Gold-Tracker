import { readFileSync, writeFileSync } from 'node:fs';

const AUTHOR_START = '<!-- AUTHOR:START -->';
const AUTHOR_END = '<!-- AUTHOR:END -->';

function valueBadge(alt, label, message, color, logo, href) {
  return `<a href="${href}"><img src="https://img.shields.io/badge/${label}-${message}-${color}?style=flat-square&logo=${logo}" alt="${alt}" /></a>`;
}

function renderAuthor(data) {
  const badges = [
    valueBadge('Email', 'Email', data.email, 'EA4335', 'gmail', `mailto:${data.email}`),
    valueBadge('Portfolio', 'Website', data.portfolio, '000000', 'vercel', data.portfolio),
    valueBadge('GitHub', 'GitHub', data.githubUsername, '181717', 'github', data.github),
    valueBadge('LinkedIn', 'LinkedIn', data.linkedin, '0077B5', 'linkedin', data.linkedin),
    valueBadge('Twitter', 'Twitter', data.twitter, '1DA1F2', 'twitter', data.twitter),
  ].join('\n    ');

  return `${AUTHOR_START}
<h2 id="contact" style="margin: 12px 0 8px">👤 Author</h2>
<div align="center" style="margin: 0">
  <img src="https://github.com/${data.githubUsername}.png" alt="Developer" width="100" height="100" style="border-radius:50%; width:100px; height:100px; object-fit:cover; display:block; margin:0 auto"/>
  <h3 style="margin: 8px 0 4px">Kaushik Verma</h3>
  <p style="margin: 0 0 8px">
    ${badges}
  </p>
  <p style="margin: 0">Open to product feedback, collaboration, and thoughtful conversation.</p>
</div>
<div align="center" style="margin: 8px 0 0">
  <p style="margin: 0 0 4px">If you found this project helpful, please consider giving it a ⭐️</p>
  <a href="https://github.com/${data.githubUsername}/Gold-Tracker"><img src="https://img.shields.io/github/stars/${data.githubUsername}/Gold-Tracker?style=social" alt="GitHub stars" /></a>
</div>
${AUTHOR_END}`;
}

function upsertAuthor(readme, section) {
  if (!readme.includes(AUTHOR_START) || !readme.includes(AUTHOR_END)) {
    throw new Error('README.md is missing AUTHOR markers');
  }

  return readme.replace(new RegExp(`${AUTHOR_START}[\\s\\S]*?${AUTHOR_END}`), section);
}

async function main() {
  try {
    const response = await fetch('https://profiledata.vercel.app/');
    if (!response.ok) throw new Error(`Could not load links (${response.status})`);

    const data = await response.json();

    const readme = readFileSync('README.md', 'utf-8');
    writeFileSync('README.md', upsertAuthor(readme, renderAuthor(data)));
    console.log('Readme updated successfully.');
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  }
}

void main();
