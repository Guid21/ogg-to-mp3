// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import ffmpeg from 'fluent-ffmpeg';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
import axios from 'axios';
import { Readable } from 'stream';

ffmpeg.setFfmpegPath(ffmpegPath);

console.log('ttt')

const KEY = 'JTy*G#BY~?s8!%qz3,wQM(2p4DR&vIZnKL6u)F;]`dCAeUPNbW[$Sj7mfh^Xtgxc';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const url = req.query.url;
  const isAvailable = KEY === req.query.key;
  const isGetMethod = req.method === 'GET';
  const hasLink = Boolean(url) && typeof url === 'string';

  if (hasLink && isAvailable && isGetMethod) {
    res.setHeader('Content-Type', 'audio/mpeg')
    axios
      .get(url, { responseType: 'arraybuffer' })
      .then((response) => {
        const bufferStream = new Readable();
        bufferStream.push(response.data);
        bufferStream.push(null);

        ffmpeg(bufferStream)
          .toFormat('mp3')
          .on('end', () => {
            console.log('Conversion done');
          })
          .pipe(res, { end: true })
          .on('error', (err) => {
            console.log('Error while converting file:', err.message);
          });
      })
      .catch((err) => {
        console.log('Error while fetching file:', err.message);
      });

    // res.redirect('/')
  }
}
