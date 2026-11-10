'use strict';
const fs=require('node:fs');const path=require('node:path');
class Store{
 constructor(file){this.file=file;try{this.rows=JSON.parse(fs.readFileSync(file,'utf8'));if(!Array.isArray(this.rows))this.rows=[]}catch{this.rows=[]}}
 add(r){if(!r||typeof r.deviceId!=='string'||!/^[a-zA-Z0-9_-]{1,40}$/.test(r.deviceId))throw Error('Invalid deviceId');if(typeof r.temperature!=='number'||!Number.isFinite(r.temperature)||r.temperature < -50||r.temperature>125)throw Error('Invalid temperature');if(typeof r.humidity!=='number'||!Number.isFinite(r.humidity)||r.humidity<0||r.humidity>100)throw Error('Invalid humidity');if(typeof r.timestamp!=='string'||!Number.isFinite(Date.parse(r.timestamp)))throw Error('Invalid timestamp');if(Date.parse(r.timestamp)>Date.now()+300000)throw Error('Future timestamp');const row={deviceId:r.deviceId,temperature:r.temperature,humidity:r.humidity,timestamp:new Date(r.timestamp).toISOString(),receivedAt:new Date().toISOString()};this.rows.push(row);this.rows=this.rows.slice(-5000);if(this.file){fs.mkdirSync(path.dirname(this.file),{recursive:true});fs.writeFileSync(this.file,JSON.stringify(this.rows))}return row}
 // Known issue: duplicates and late packets are accepted, latest follows receipt order.
 latest(id){return this.history(id,5000).at(-1)||null}
 history(id,limit=50){return this.rows.filter(r=>!id||r.deviceId===id).slice(-limit)}
 devices(){return [...new Set(this.rows.map(r=>r.deviceId))].sort()}
}
module.exports={Store};
