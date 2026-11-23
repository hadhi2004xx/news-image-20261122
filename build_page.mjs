// Builds front.html for the World in a Day front page from stories.json.
// Run: node build_page.mjs  (writes front.html next to this file)
import { readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('./stories.json', import.meta.url), 'utf8'));
const byId = (id) => data.stories.find((s) => s.id === id);
const sec = (name) => data.stories.filter((s) => s.section === name);

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function storyBlock(s, cls = 'story') {
  return `<div class="${cls}"><h3>${esc(s.headline)}</h3>${s.deck ? `<p>${esc(s.deck)}</p>` : ''}</div>`;
}

function leadStory(s, cls) {
  return `<div class="${cls}"><div class="kick">${cls === 'lead-a' ? 'LEAD — CLIMATE' : 'LEAD — WAR AT SEA'}</div><h2>${esc(s.headline)}</h2><p>${esc(s.deck)}</p></div>`;
}

const war = sec('war');
const pol = sec('politics');
const world = sec('world');
const money = sec('money');
const sport = sec('sport');
const brief = sec('brief');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>World in a Day — Sunday, 22 November 2026</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #f6f1e6; }
  body { font-family: "Liberation Sans", sans-serif; color: #14110c; }
  .page { width: 1024px; padding: 12px 28px 10px; background: #f6f1e6; }
  .topline { display: flex; justify-content: space-between; font-size: 9.5px; letter-spacing: .18em; text-transform: uppercase; color: #5a5344; border-bottom: 1px solid #14110c; padding-bottom: 5px; }
  .masthead { text-align: center; padding: 8px 0 6px; }
  .masthead .name { font-family: "Liberation Serif", serif; font-weight: 900; font-size: 58px; letter-spacing: .02em; line-height: 1; color: #14110c; }
  .masthead .tag { font-size: 9.5px; letter-spacing: .3em; text-transform: uppercase; color: #5a5344; margin-top: 5px; }
  .dateline { text-align: center; font-weight: 700; font-size: 27px; letter-spacing: .06em; color: #a31d1d; padding: 6px 0 7px; border-top: 3px solid #14110c; border-bottom: 1px solid #14110c; }
  .dateline span { color: #14110c; font-size: 13px; letter-spacing: .22em; display: block; margin-bottom: 1px; }
  .lead { display: grid; grid-template-columns: 1.55fr 1fr; gap: 0; border-bottom: 2px solid #14110c; }
  .lead-a { padding: 9px 18px 9px 0; border-right: 1px solid #8d8674; }
  .lead-b { padding: 9px 0 9px 18px; }
  .kick { font-size: 9.5px; font-weight: 700; letter-spacing: .2em; color: #a31d1d; margin-bottom: 5px; }
  .lead-a h2 { font-family: "Liberation Serif", serif; font-size: 32px; line-height: 1.05; font-weight: 900; }
  .lead-a p { font-size: 10.5px; line-height: 1.3; color: #2c2822; margin-top: 6px; }
  .lead-b h2 { font-family: "Liberation Serif", serif; font-size: 21px; line-height: 1.12; font-weight: 900; }
  .lead-b p { font-size: 10px; line-height: 1.28; color: #2c2822; margin-top: 5px; }
  .cols { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; }
  .col { padding: 8px 14px 6px 0; }
  .col + .col { padding-left: 14px; border-left: 1px solid #8d8674; }
  .col + .col + .col { padding-left: 14px; }
  .sechead { font-size: 10.5px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #a31d1d; border-bottom: 2px solid #14110c; padding-bottom: 3px; margin-bottom: 6px; }
  .story { margin-bottom: 5px; }
  .story h3 { font-family: "Liberation Serif", serif; font-size: 12px; line-height: 1.14; font-weight: 700; }
  .story p { font-size: 9.3px; line-height: 1.24; color: #33302a; margin-top: 1px; }
  .band { border-top: 2px solid #14110c; padding-top: 5px; margin-top: 1px; }
  .band .sechead { border-bottom: 1px solid #8d8674; }
  .moneygrid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .moneygrid .story { padding-right: 16px; }
  .moneygrid .story + .story { padding-left: 16px; border-left: 1px solid #8d8674; }
  .sportgrid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0 16px; }
  .sportgrid .story h3 { font-size: 11.5px; }
  .sportgrid .story p { font-size: 9.2px; }
  .briefs { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 18px; border-top: 1px solid #8d8674; margin-top: 5px; padding-top: 4px; }
  .briefs .bi { font-size: 9.8px; line-height: 1.25; color: #2c2822; }
  .briefs .bi b { color: #a31d1d; letter-spacing: .12em; font-size: 9px; }
  .numbers { display: grid; grid-template-columns: repeat(6, 1fr); border-top: 2px solid #14110c; border-bottom: 2px solid #14110c; margin-top: 5px; padding: 5px 0 4px; }
  .num { text-align: center; padding: 0 6px; }
  .num + .num { border-left: 1px solid #8d8674; }
  .num .v { font-family: "Liberation Serif", serif; font-weight: 900; font-size: 18px; color: #a31d1d; }
  .num .t { font-size: 8.2px; line-height: 1.15; color: #3a362e; margin-top: 1px; white-space: nowrap; }
  .footer { display: flex; justify-content: space-between; font-size: 8.6px; letter-spacing: .08em; color: #5a5344; padding-top: 4px; }
</style></head>
<body><div class="page">
  <div class="topline"><span>One day &middot; One page &middot; 40 stories</span><span>World news &middot; All times UTC</span><span>Price: the day itself</span></div>
  <div class="masthead">
    <div class="name">WORLD IN A DAY</div>
    <div class="tag">The world&rsquo;s news &mdash; Sunday&rsquo;s edition, in one image</div>
  </div>
  <div class="dateline"><span>SUNDAY</span>22 NOVEMBER 2026</div>
  <div class="lead">
    ${leadStory(byId(1), 'lead-a')}
    ${leadStory(byId(2), 'lead-b')}
  </div>
  <div class="cols">
    <div class="col"><div class="sechead">War &amp; Conflict</div>${war.map((s) => storyBlock(s)).join('')}</div>
    <div class="col"><div class="sechead">Politics</div>${pol.map((s) => storyBlock(s)).join('')}</div>
    <div class="col"><div class="sechead">The World</div>${world.map((s) => storyBlock(s)).join('')}</div>
  </div>
  <div class="band"><div class="sechead">Money &amp; Tech</div>
    <div class="moneygrid">${money.map((s) => storyBlock(s)).join('')}</div>
  </div>
  <div class="band"><div class="sechead">Sport</div>
    <div class="sportgrid">${sport.map((s) => storyBlock(s)).join('')}</div>
  </div>
  <div class="briefs">${brief.map((s) => `<div class="bi"><b>IN BRIEF &mdash; </b>${esc(s.headline)}</div>`).join('')}</div>
  <div class="numbers">${data.numbers.map((n) => `<div class="num"><div class="v">${esc(n.value)}</div><div class="t">${esc(n.label)}</div></div>`).join('')}</div>
  <div class="footer"><span>Compiled from dated reports of 22 November 2026: BBC, The Guardian, France 24, Al Jazeera, One Turn, KPFA.</span><span>World in a Day &middot; 22 Nov 2026</span></div>
</div></body></html>`;

writeFileSync(new URL('./front.html', import.meta.url), html);
console.log('wrote front.html,', html.length, 'bytes,', data.stories.length, 'stories');
