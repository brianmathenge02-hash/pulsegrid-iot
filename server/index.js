'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');const {Store}=require('./store');
const root=path.join(__dirname,'..','public');
function createServer(store=new Store(process.env.DATA_FILE||path.join(__dirname,'..','data','readings.json'))){return http.createServer(async(req,res)=>{const u=new URL(req.url,'http://localhost');const send=(code,obj)=>{res.writeHead(code,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(obj))};try{
if(u.pathname==='/api/health'&&req.method==='GET')return send(200,{ok:true});
if(u.pathname==='/api/devices'&&req.method==='GET')return send(200,{devices:store.devices()});
if(u.pathname==='/api/readings/latest'&&req.method==='GET')return send(200,{reading:store.latest(u.searchParams.get('deviceId'))});
if(u.pathname==='/api/readings'&&req.method==='GET'){const n=Number(u.searchParams.get('limit')||50);if(!Number.isInteger(n)||n<1||n>500)return send(400,{error:'Invalid limit'});return send(200,{readings:store.history(u.searchParams.get('deviceId'),n)})}
if(u.pathname==='/api/readings'&&req.method==='POST'){let s='';for await(const chunk of req){s+=chunk;if(s.length>16384)return send(413,{error:'Too large'})}let r;try{r=JSON.parse(s)}catch{return send(400,{error:'Invalid JSON'})}try{return send(201,{reading:store.add(r)})}catch(e){return send(400,{error:e.message})}}
if(req.method!=='GET')return send(405,{error:'Method not allowed'});const files={'/':'index.html','/index.html':'index.html','/app.js':'app.js','/styles.css':'styles.css'};const file=files[u.pathname];if(!file)return send(404,{error:'Not found'});res.writeHead(200,{'content-type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript'});fs.createReadStream(path.join(root,file)).pipe(res)
}catch(e){console.error(e);if(!res.headersSent)send(500,{error:'Server error'})}})}
if(require.main===module)createServer().listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('PulseGrid listening'));
module.exports={createServer};
