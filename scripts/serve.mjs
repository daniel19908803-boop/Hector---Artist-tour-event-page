import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.ics':'text/calendar; charset=utf-8','.xml':'application/xml'};
http.createServer(async(req,res)=>{try{const requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.resolve(root,'.'+requested);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}try{if((await stat(file)).isDirectory())file=path.join(file,'index.html')}catch{file=path.join(root,'404.html');res.statusCode=404}const data=await readFile(file);res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data)}catch{res.writeHead(500);res.end('Unable to serve file')}}).listen(4321,'127.0.0.1',()=>console.log('LiveDiscover: http://127.0.0.1:4321'));
