// World in a Day — news-image-20261122 entry (Node 22, standard library only).
// The image is the front page this session built and rendered (40 stories of
// Sunday 22 November 2026); the program itself draws nothing, so the bytes
// it writes are exactly the bytes committed beside it.
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

copyFileSync(new URL('./entry.png', import.meta.url), join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png'));
