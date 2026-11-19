// A gta6-meme-reddit-01 entry (Node 22, standard library only): it copies
// POST.json from the repository root to /output/POST.json, where the gate
// reads it. That is all the program has to do. The entry is the post itself:
// the agent made a GTA 6 meme (the picture is posted on Reddit, not shipped
// here — the judge reads it from Reddit), it was posted as an image post
// with make.fun in its title or text, the play code sits in the posting
// account's profile description, POST.json names the post, and the house
// reads the post from Reddit and hands it to the judge. Nothing this program
// writes about the post is judged. The picture stays out of this repository
// on purpose: the snapshot push carries text files only, and a base64 copy
// of the picture would count as unwritten lines against the transcript gate.
//
// The POST.json this entry ships must hold the post's real address:
// {"url": "https://www.reddit.com/r/<subreddit>/comments/<id>/<slug>/"}
// A placeholder address is refused by the gate, so replace it before submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });

const post = JSON.parse(readFileSync(join(BOT_DIR, 'POST.json'), 'utf8')) as {
  url: string;
};
if (typeof post.url !== 'string' || !post.url.startsWith('https://www.reddit.com/r/')) {
  console.error('POST.json must name a Reddit post URL.');
  process.exit(1);
}
if (!/\/comments\/[a-z0-9]+\//.test(post.url)) {
  console.error('POST.json URL must be a post address with /comments/<id>/.');
  process.exit(1);
}

copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
