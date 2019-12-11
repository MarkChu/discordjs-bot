// require the discord.js module
const Discord = require('discord.js');
const token = process.env.BOT_TOKEN;
const jawsdb = process.env.JAWSDB_URL;
const prefix = "^";

const schedule = require('node-schedule');
const webhook = require("webhook-discord");
const Hook = new webhook.Webhook("https://discordapp.com/api/webhooks/653966367535398912/ABIrRHZq4yq43P4Tcsj3fMBhTZ_cbSfSXYBF2TXaRWF29l5frbb5ICMHq6lDlAO92G9A");

var mysql = require('mysql');


var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DB_SERVER,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_NAME,
  timezone		  : '+00:00'
});


// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Bot is Ready!');

	var j = schedule.scheduleJob('0 * * * * *', function(){
	  //每到0秒時執行一次(每分鐘)
	  checkboss();
	});
	var j1 = schedule.scheduleJob('* 0 * * * *', function(){
	  //每到0分時執行一次(每小時)
	  listboss();
	});
	//console.log('Ready!');
	sqltest();

});

// login to Discord with your app's token
client.login(token);



function sqltest(){

	var tz = process.env.TZ;
	var date = new Date();
	console.log(tz, '||', date);

	var sqlstr = "select convert(now(),DATETIME) as today; ";			    

	pool.query(sqlstr, function(err, rows, fields) {
		if (err) handleError(err);
	    
		var recordset = rows;
		var msgcontent = "";
		for(i=0;i<recordset.length;i++)
		{
			var row = recordset[i];
			console.log(row.today);
		}
	});

}



function checkboss(){

	var sqlstr = "select bossid,imgurl ";			    
		sqlstr += ",left(convert(killtime,DATETIME),16) as killed ";
		sqlstr += ",left(convert(reborntime,DATETIME),16) as reborn ";
		sqlstr += ",TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , reborntime ) AS dues ";
		sqlstr += ",cycletime ";
		sqlstr += "from tblboss ";
		sqlstr += "where reborntime IS NOT null ";
		sqlstr += "and TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , reborntime )  in (0 ,5 ,10) ";
		sqlstr += "order by 4 ";	

	pool.query(sqlstr, function(err, rows, fields) {
		if (err) handleError(err);
	    
		var recordset = rows;
		var msgcontent = "";
		for(i=0;i<recordset.length;i++)
		{

			var row = recordset[i];
        	var msgcontent = "野王出沒通知：【" + row.bossid + "】";
        	//console.log(row);
        	if(parseInt(row.dues)==0){
        		msgcontent += " 目前已經重生，趕快去吃王吧!!";
        	}else{
        		msgcontent += " 距離出現還有 " + row.dues + "分鐘!!";
        	}

        	const msg = new webhook.MessageBuilder()
            .setName("小馬怪")
            .setColor("#ff0000")
            .setText(msgcontent)
            .addField("野王編號", row.bossid )
            .addField("預計出現時間", row.reborn )
            .addField("重生時間", row.cycletime + " 小時")
            .setImage(row.imgurl)
            .setTime();

			Hook.send(msg);
			
			//message.channel.send(msgcontent);						
		}
		//Hook.info("小馬怪",msgcontent);
		//console.log(msgcontent);
    

	});

}


function listboss(){


	var sqlstr = "select bossid,imgurl ";			    
		sqlstr += ",left(convert(killtime,DATETIME),16) as killed ";
		sqlstr += ",left(convert(reborntime,DATETIME),16) as reborn ";
		sqlstr += ",TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , reborntime ) AS dues ";
		sqlstr += ",cycletime ";
		sqlstr += "from tblboss ";
		sqlstr += "where reborntime > DATE_ADD(NOW(),INTERVAL 8 HOUR ) ";
		sqlstr += "order by bossid ";	

	pool.query(sqlstr, function(err, rows, fields) {
	    if (err) handleError(err);
	    	
		var recordset = rows;
		var msgcontent = "";
		for(i=0;i<recordset.length;i++)
		{

			var row = recordset[i];
			msgcontent += "【" + row.bossid + " - 預計時間:"+row.reborn+" - 距離現在："+ row.dues +"分鐘】\n";
			
			//message.channel.send(msgcontent);						
		}
		Hook.info("小馬怪",msgcontent);
		//console.log(msgcontent);

	});

}




client.on('message', message => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();


	//console.log(message.content);

	switch(command){
		case 'help':

			const exampleEmbed = new Discord.RichEmbed()
			.setColor("#0099ff")
			.setTitle("指令說明："+prefix+"help")
			.addField(prefix+"boss", '列出目前有紀錄的BOSS重生時間。')
			.addField(prefix+"kill 野王編號", '更新擊殺野王的時間，會使用系統時間-3分鐘 。')
			.addField(prefix+"kill 野王編號 日期時間", '更新擊殺野王的時間，時間輸入範例如: 2019/12/10 11:50 轉換成 201912101150 。')
			.addField(prefix+"reset 野王編號", '清空特定野王的擊殺時間與重生時間。')
			.addField(prefix+"maintain 日期時間", '維護時間，全部的王的重生時間重置。')
			.setTimestamp();

			message.channel.send(exampleEmbed);
			break;

		case 'maintain':
			if (!args.length) {
				message.channel.send("參數輸入錯誤, "+message.author+"!");
				message.channel.send("輸入方式如下：");
				message.channel.send(prefix+"maintain 日期時間：維護時間，全部的王的重生時間重置。");
			}else{

				var input_time = args[0];
				var fixtime = "";

				if(input_time.length!=12){
					message.channel.send("時間輸入範例如: 2019/12/10 11:50 轉換成 201912101150");
					break;
				}else{
					fixtime += input_time.substr(0,4) +"/"+input_time.substr(4,2)+"/"+input_time.substr(6,2)+" "+input_time.substr(8,2)+":"+input_time.substr(10,2);
					if(isNaN(Date.parse(fixtime))){
						message.channel.send("時間輸入範例如: 2019/12/10 11:50 轉換成 201912101150");
						break;	
					}
					//console.log(killtime);	
				}
		
				sql.connect(db, err => {
				    // ... error checks
					var	update_sql =  "update tblboss set killtime = dateadd(n,10,'"+fixtime+"') " ;
		        		update_sql += "		,reborntime = dateadd(n, (cycletime*60 + 10) ,'"+fixtime+"')  " ;

					const transaction = new sql.Transaction()
					transaction.begin(err => {
					    // ... error checks

					    const request = new sql.Request(transaction)
					    request.query(update_sql, (err, result) => {
					        // ... error checks

					        transaction.commit(err => {
					            // ... error checks
					            message.channel.send("野王重生時間已全部重置!!");
					        })
					    })
					})

				})			

			}
			

			break;






		case 'reset':
			if (!args.length) {
				message.channel.send("參數輸入錯誤, "+message.author+"!");
				message.channel.send("輸入方式如下：");
				message.channel.send(prefix+"reset 野王編號 ：清空重生時間。");
			}else{

				var bossid = args[0];
				
				sql.connect(db, err => {
				    // ... error checks
					var sqlstr = "select uniqid ";			    
						sqlstr += "from tblboss ";
						sqlstr += "where bossid='"+bossid+"'";
				    // Query

				    new sql.Request().query(sqlstr, (err, result) => {
				        // ... error checks
				        var recordset = result.recordset;
				        if(!recordset.length){
				        	message.channel.send("野王編號錯誤，【"+bossid+"】 不存在!!, 請重新輸入!!");
				        }else{
				        	var uniqid = recordset[0].uniqid;
				        	
				        	var	update_sql =  "update tblboss set killtime= null " ;
				        		update_sql += "		,reborntime = null  " ;
				        		update_sql += "where uniqid="+uniqid+" " ;


							const transaction = new sql.Transaction()
							transaction.begin(err => {
							    // ... error checks

							    const request = new sql.Request(transaction)
							    request.query(update_sql, (err, result) => {
							        // ... error checks

							        transaction.commit(err => {
							            // ... error checks
							            message.channel.send("野王編號 【"+bossid+"】 已清空!!");
							        })
							    })
							})
			        	
				        }

				    })
				})
				

			}
			




			break;


		case 'kill':
			if (!args.length) {
				message.channel.send("參數輸入錯誤, "+message.author+"!");
				message.channel.send("輸入方式如下：");
				message.channel.send(prefix+"kill 野王編號 ：更新擊殺野王的時間，會使用系統時間-3分鐘 。");
				message.channel.send(prefix+"kill 野王編號 日期時間：更新擊殺野王的時間，時間輸入範例如: 2019/12/10 11:50 轉換成 201912101150 。");
			}else{

				var bossid = args[0];
				var killtime = "";
				if(args.length>1){
					input_time = args[1];
					if(input_time.length!=12){
						message.channel.send("時間輸入範例如: 2019/12/10 11:50 轉換成 201912101150");
						break;
					}else{
						killtime += input_time.substr(0,4) +"/"+input_time.substr(4,2)+"/"+input_time.substr(6,2)+" "+input_time.substr(8,2)+":"+input_time.substr(10,2);
						if(isNaN(Date.parse(killtime))){
							message.channel.send("時間輸入範例如: 2019/12/10 11:50 轉換成 201912101150");
							break;	
						}
						//console.log(killtime);	
					}
				}

				sql.connect(db, err => {
				    // ... error checks
					var sqlstr = "select uniqid ";			    
						sqlstr += "from tblboss ";
						sqlstr += "where bossid='"+bossid+"'";
				    // Query

				    new sql.Request().query(sqlstr, (err, result) => {
				        // ... error checks
				        var recordset = result.recordset;
				        if(!recordset.length){
				        	message.channel.send("野王編號錯誤，【"+bossid+"】 不存在!!, 請重新輸入!!");
				        }else{
				        	var uniqid = recordset[0].uniqid;
				        	var update_sql = "";
				        	if(killtime==""){
				        		update_sql =  "update tblboss set killtime=dateadd(n,-3,dbo.now()) " ;
				        		update_sql += "		,reborntime = dateadd(n,cycletime*60,dateadd(n,-3,dbo.now()))  " ;
				        		update_sql += "where uniqid="+uniqid+" " ;
				        	}else{
				        		update_sql =  "update tblboss set killtime='"+killtime+"' " ;
				        		update_sql += "		,reborntime = dateadd(n,cycletime*60,'"+killtime+"')  " ;
				        		update_sql += "where uniqid="+uniqid+" " ;
				        	}


							const transaction = new sql.Transaction()
							transaction.begin(err => {
							    // ... error checks

							    const request = new sql.Request(transaction)
							    request.query(update_sql, (err, result) => {
							        // ... error checks

							        transaction.commit(err => {
							            // ... error checks
							            message.channel.send("野王編號 【"+bossid+"】 下次重生時間已更新!!");
							        })
							    })
							})
			        	
				        }

				    })
				})
				

			}
			




			break;
		case 'boss':

			sql.connect(db, err => {
			    // ... error checks
				var sqlstr = "select bossid,imgurl ";			    
					sqlstr += ",convert(varchar(16),killtime,120) as killed ";
					sqlstr += ",convert(varchar(16),reborntime,120) as reborn ";
					sqlstr += ",datediff(n,dbo.now(),reborntime) as dues ";
					sqlstr += ",cycletime ";
					sqlstr += "from tblboss ";
					sqlstr += "where reborntime > dbo.now() ";
					sqlstr += "order by 4 ";		    
			    // Query

			    new sql.Request().query(sqlstr, (err, result) => {
			        // ... error checks
			        var recordset = result.recordset;
			        var msgcontent = "";

			        for(i=0;i<recordset.length;i++){

						var row = recordset[i];
			        	msgcontent += "【" + row.bossid + " - 預計時間:"+row.reborn+" - 距離現在："+ row.dues +"分鐘】\n";
			        }

					message.channel.send(msgcontent);						

			        //console.dir(result)
			    })
			})


			//message.channel.send('test!');
			break;
		default:
			message.channel.send('您可以輸入 ^help 查看指令.');
			break;
	}

});


function handleError (error) {
	console.log(error);
}
