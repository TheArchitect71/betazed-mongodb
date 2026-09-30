const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function createLocalConfig(directory=process.cwd()){
 const file=path.join(directory,'.env.local');
 if(fs.existsSync(file)){console.log('Existing .env.local preserved');return false;}
 const config={"PORT":"3000","MONGODB_URI":"mongodb://127.0.0.1:27018/betazed?replicaSet=offline-rs"};
 config["JWT_SECRET"]=crypto.randomBytes(48).toString('hex');
 fs.writeFileSync(file,Object.entries(config).map(([key,value])=>key+'='+value).join('\n')+'\n',{flag:'wx',mode:0o600});
 console.log('Created private .env.local; no application data seeded');return true;
}
module.exports={createLocalConfig};
if(require.main===module)createLocalConfig();
