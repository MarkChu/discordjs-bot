// require the discord.js module
const Discord = require('discord.js');
const token = process.env.BOT_TOKEN;
const jawsdb = process.env.JAWSDB_URL;
const prefix = "^";

const schedule = require('node-schedule');
const webhook = require("webhook-discord");
const Hook = new webhook.Webhook("https://discordapp.com/api/webhooks/653966367535398912/ABIrRHZq4yq43P4Tcsj3fMBhTZ_cbSfSXYBF2TXaRWF29l5frbb5ICMHq6lDlAO92G9A");
/*

https://discordapp.com/oauth2/authorize?&client_id=653601639260749835&scope=bot&permissions=0
*/



const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host            : process.env.DB_SERVER,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_NAME,
  timezone		  : '+00:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Bot is Ready!');

	var j = schedule.scheduleJob('0 * * * * *', function(){
	  //每到0秒時執行一次(每分鐘)
	  //checkboss();
	  checkboss_channel();
	  auto_updateboss();
	});

	//testnotify();
	/*
	var j1 = schedule.scheduleJob('0 0 * * * *', function(){
	  //每到0分時執行一次(每小時)
	  listboss();
	});
	*/

	/*
	Promise.race([
	  getserver('661208151865032710'),
	  timeoutPromise(3000)
	])
	.then(
	  function(server) {
	    console.log(server);
	  },
	  function(err) {
	    // 可能是被拒絕或擱置超過 3 秒
	  }
	);
	*/

});

//被邀請加入時的訊息。
client.on("guildCreate", guild => {
    let channelID;
    let channels = guild.channels;
    channelLoop:
    for (let c of channels) {
        let channelType = c[1].type;
        if (channelType === "text") {
            channelID = c[0];
            break channelLoop;
        }
    }

    let channel = client.channels.get(guild.systemChannelID || channelID);
    channel.send(`謝謝你邀請我加入，您可以使用 ^help 查看所有指令喔!`);
});



// login to Discord with your app's token
client.login(token);


function channelnotify(fnuserid,fnmsg){

	var sqlstr = "select uniqid,server,channel,wbname,wbid,wbtoken ";
		sqlstr += "from tblChannelWebhook ";
		sqlstr += "where userid='"+fnuserid+"'";
		sqlstr += "and ison='Y' ";
		sqlstr += "and channel>'' and wbtoken>'' ";
		sqlstr += "order by create_date ";
	//console.log(sqlstr);
	query_sql(sqlstr).then(function(rtn){	
		Object.keys(rtn).forEach(function(key) {
			var row = rtn[key];

			var webhookClient = new Discord.WebhookClient(row.wbid , row.wbtoken );
			//console.log(webhookClient);
			try {
				
				webhookClient.send('', {
					username: '小馬怪',
					//avatarURL: 'https://i.imgur.com/wSTFkRM.png',
					embeds: [fnmsg],
				});
				
			} catch (error) {
				console.error('Error trying to send: ', error);
			}

		    //var row = rtn[key];
			//var theHook = new webhook.Webhook("https://discordapp.com/api/webhooks/"+row.channel+"/"+row.wbtoken);
			//console.log(theHook);
			//theHook.info("小馬怪",fnmsg);	
		});	
	});


}


function testnotify(){
	const msg = new Discord.RichEmbed();
	msg.setColor("#ff0000")
    .setTitle("測試訊息")
    .setTimestamp();


	var sqlstr = "select uniqid,server,channel,wbname,wbid,wbtoken ";			    
		sqlstr += "from tblChannelWebhook ";
		sqlstr += "where ison='Y' ";
		sqlstr += "and channel>'' and wbtoken>'' ";
		sqlstr += "order by create_date ";
	//console.log(sqlstr);
	query_sql(sqlstr).then(function(rtn){	
		Object.keys(rtn).forEach(function(key) {
			var row = rtn[key];

			hooksend(row.wbid , row.wbtoken , msg)
			.then(rtn => {
				console.log(row.uniqid);
				console.log(rtn);
			})
			.catch(console.error);

		});	
	});

}



function channelallnotify(fnmsg){

	var sqlstr = "select uniqid,server,channel,wbname,wbid,wbtoken ";			    
		sqlstr += "from tblChannelWebhook ";
		sqlstr += "where ison='Y' ";
		sqlstr += "and channel>'' and wbtoken>'' ";
		sqlstr += "order by create_date ";
	//console.log(sqlstr);
	query_sql(sqlstr).then(function(rtn){	
		Object.keys(rtn).forEach(function(key) {
			var row = rtn[key];


			hooksend(row.wbid , row.wbtoken , fnmsg)
			.then(rtn => {
				console.log(rtn);
			})
			.catch(console.error);

		});	
	});

}



async function hooksend(wbid,wbtoken,msg){
	var webhookClient = new Discord.WebhookClient(wbid , wbtoken );
	//console.log(webhookClient);
	try {
		
		await webhookClient.send('', {
			username: '小馬怪',
			//avatarURL: 'https://i.imgur.com/wSTFkRM.png',
			embeds: [msg],
		});
		console.log("hooksend success");
		return true;
	} catch (error) {
		console.error('Error trying to send: ', error);
		return false;
	}
}

function auto_updateboss(){

	var sqlstr = " UPDATE tblServerBoss ";
	sqlstr = sqlstr + " SET killtime = reborntime ";
	sqlstr = sqlstr + " ,reborntime = DATE_ADD(reborntime ,INTERVAL (select cycletime FROM tblboss z WHERE z.bossid=tblServerBoss.bossid)*60 MINUTE) ";
	sqlstr = sqlstr + " ,isauto = isauto + 1 ";
	sqlstr = sqlstr + " where TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , reborntime )  < -60 ";

  	exec_sql(sqlstr).then(function(rtn1){
  		console.log('auto updateboss..');
	});

}

function checkboss_channel(){

	var sqlstr = "select a.bossid,a.imgurl2 as imgurl ";			    
		sqlstr += ",left(convert(b.killtime,DATETIME),16) as killed ";
		sqlstr += ",left(convert(b.reborntime,DATETIME),16) as reborn ";
		sqlstr += ",TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , b.reborntime ) AS dues ";
		sqlstr += ",a.cycletime ";
		sqlstr += ",a.bossimg  ";
		sqlstr += ",a.rank  ";
		sqlstr += ",a.bossname,a.bossname_kr  ";
		sqlstr += ",a.location,a.location_kr ";
		sqlstr += ",a.lv ";	
		sqlstr += ",b.serverid ";
		sqlstr += ",a.url ";
		sqlstr += ",b.isauto ";		
		sqlstr += "from tblboss a INNER JOIN tblServerBoss b ";
		sqlstr += "on a.bossid = b.bossid ";
		sqlstr += "where b.reborntime IS NOT null ";
		sqlstr += "and TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , b.reborntime )  in (0 ,5 ,10) ";
		sqlstr += "order by 5 ";	

	pool.query(sqlstr, function(err, rows, fields) {
		if (err) handleError(err);
	    
		var recordset = rows;
		var msgcontent = "";
		for(i=0;i<recordset.length;i++)
		{

			var row = recordset[i];
			var rank = "";
			var background = "";
			switch(row.rank){
				case 'r':
					rank = "紅";
					background = "#ff0000";
					break;
				case 'b':
					rank = "藍";
					background = "#0000ff";
					break;
				case 'p':
					rank = "紫";
					background = "#8340ff";
					break;
				default:
					rank = "";
					background = "#ffffff";					
					break;
			}
			var autoflag = "";
			if(row.isauto!="0"){
				autoflag = "【自動展延"+row.isauto+"次】";
			}

        	var msgcontent = row.serverid + " 野王出沒通知："+autoflag+"【" + row.bossid +" "+ row.bossname + " ("+rank+") 在 "+row.location+ "】";
        	//console.log(row);
        	if(parseInt(row.dues)==0){
        		msgcontent += " 目前已經重生，趕快去吃王吧!!";
        	}else{
        		msgcontent += " 距離出現還有 " + row.dues + "分鐘!!";
        	}

        	const msg = new Discord.RichEmbed();


			var bossname = row.bossname_kr+(row.bossname!=row.bossname_kr?" "+row.bossname:"");
			var bosslocation = row.location_kr+(row.location!=row.location_kr?" "+row.location:"");
			var url = "http://lineage2m.inven.co.kr/dataninfo/boss/";
			if(row.url!=null && row.url!=""){
				url = row.url;
			}

        	msg.setColor(background)
            .setTitle(msgcontent)
            .setURL(url)
            .addField("伺服器", row.serverid )
            .addField("野王編號", row.bossid + " ("+rank+") " )
            .addField("野王名稱", bossname )
            .addField("等級", row.lv)
            .addField("出現地區", bosslocation )
            .addField("預計出現時間", row.reborn )
            .addField("重生時間", row.cycletime + " 小時");

			if(row.imgurl!=null&&row.imgurl!=""){
	            msg.setImage(row.imgurl)
			}     

			//if(row.bossimg!=null&&row.bossimg!=""){
	        //    msg.setImage(row.bossimg)
			//}        	
	        msg.setTimestamp();


			channelallnotify(msg);
							
		}


	});



}



function checkboss(){

	var sqlstr = "select bossid,userid,(select imgurl from tblboss z where z.bossid=a.bossid) imgurl ";			    
		sqlstr += ",left(convert(killtime,DATETIME),16) as killed ";
		sqlstr += ",left(convert(reborntime,DATETIME),16) as reborn ";
		sqlstr += ",TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , reborntime ) AS dues ";
		sqlstr += ",(select cycletime from tblboss z where z.bossid=a.bossid) cycletime ";
		sqlstr += ",(select bossimg from tblboss z where z.bossid=a.bossid) bossimg ";
		sqlstr += ",(select rank FROM tblboss z WHERE z.bossid=a.bossid) rank ";
		sqlstr += ",(select bossname FROM tblboss z WHERE z.bossid=a.bossid) bossname ";
		sqlstr += ",(select location FROM tblboss z WHERE z.bossid=a.bossid) location ";
		sqlstr += ",(select lv FROM tblboss z WHERE z.bossid=a.bossid) lv ";		
		sqlstr += "from tblUserBoss a ";
		sqlstr += "where reborntime IS NOT null ";
		sqlstr += "and TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , reborntime )  in (0 ,5 ,10) ";
		sqlstr += "order by 5 ";	

	pool.query(sqlstr, function(err, rows, fields) {
		if (err) handleError(err);
	    
		var recordset = rows;
		var msgcontent = "";
		for(i=0;i<recordset.length;i++)
		{

			var row = recordset[i];
			var rank = "";
			switch(row.rank){
				case 'r':
					rank = "紅";
					break;
				case 'b':
					rank = "藍";
					break;
				case 'p':
					rank = "紫";
					break;
			}

        	var msgcontent = "野王出沒通知：【" + row.bossid +" "+ row.bossname + " ("+rank+") 在 "+row.location+ "】";
        	//console.log(row);
        	if(parseInt(row.dues)==0){
        		msgcontent += " 目前已經重生，趕快去吃王吧!!";
        	}else{
        		msgcontent += " 距離出現還有 " + row.dues + "分鐘!!";
        	}

        	const msg = new Discord.RichEmbed();

        	msg.setColor("#ff0000")
            .setTitle(msgcontent)
            .addField("野王編號", row.bossid + "("+rank+")" )
            .addField("野王名稱", row.bossname )
            .addField("出現地區", row.location )
            .addField("預計出現時間", row.reborn )
            .addField("重生時間", row.cycletime + " 小時");

			if(row.imgurl!=null&&row.imgurl!=""){
	            msg.setImage(row.imgurl)
			}     

			//if(row.bossimg!=null&&row.bossimg!=""){
	        //    msg.setImage(row.bossimg)
			//}        	
	        msg.setTimestamp();


			Promise.race([
			  getuser(row.userid),
			  timeoutPromise(3000),
			])
			.then(
			  function(user) {
			    user.sendEmbed(msg);
			    //channelnotify(user.id,msg);
			  },
			  function(err) {
			    // 可能是被拒絕或擱置超過 3 秒
			  }
			);
							
		}


	});

}


function listboss(){


	var sqlstr = "select bossid,userid,(select imgurl from tblboss z where z.bossid=a.bossid) imgurl ";			    
		sqlstr += ",left(convert(killtime,DATETIME),16) as killed ";
		sqlstr += ",left(convert(reborntime,DATETIME),16) as reborn ";
		sqlstr += ",TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , reborntime ) AS dues ";
		sqlstr += ",(select cycletime from tblboss z where z.bossid=a.bossid) cycletime ";
		sqlstr += "from tblUserBoss a ";
		sqlstr += "where reborntime IS NOT null ";
		sqlstr += "and reborntime > DATE_ADD(NOW(),INTERVAL 8 HOUR ) ";
		sqlstr += "order by 4 ";	



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
		if(msgcontent!=""){
			Hook.info("小馬怪",msgcontent);	
		}
		//console.log(msgcontent);

	});

}




client.on('message', message => {



	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();
	const clientid = client.user.id;
	const authorid = message.author.id;
	const authorname = message.author.username;

	//console.log(message.content);

	if(command==='help'){

		const exampleEmbed = new Discord.RichEmbed()
		.setColor("#0099ff")
		.addField("機器人網址：",'https://discordapp.com/oauth2/authorize?&client_id=653601639260749835&scope=bot&permissions=537918656')
		.setTitle("指令說明："+prefix+"help")
		.addField(prefix+"register", '第一次註冊開始使用。')
		.addField(prefix+"server 伺服器ID", '設定所在天2M伺服器，例如4-4, 13-2, 6-6。')
		.addField(prefix+"map", '列出野王地圖及編號。')
		.addField(prefix+"boss", '列出目前有紀錄的BOSS重生時間。')
		.addField(prefix+"boss 野王編號", '列出特定BOSS的資料。')
		.addField(prefix+"bossall", '列出目前建檔的BOSS。')
		.addField(prefix+"kill 野王編號", '更新擊殺野王的時間，會使用系統時間-3分鐘 。')
		.addField(prefix+"kill 野王編號 日期時間", '更新擊殺野王的時間，時間輸入範例如: 2019/12/10 11:50 轉換成 201912101150 。')
		//.addField(prefix+"kill 野王編號 時間", '更新擊殺野王的時間，會使用系統今日日期時間-3分鐘擊殺野王的時間，時間輸入範例如: 11:50 轉換成 1150 。')
		.addField(prefix+"reset 野王編號", '清空特定野王的擊殺時間與重生時間。')
		.addField(prefix+"maintain 日期時間", '維護時間，全部的王的重生時間重置。')
		.addField(prefix+"notify", '顯示目前的設置的頻道通知狀態。')
		.addField(prefix+"notify add", '將目前所在頻道加入頻道通知。')
		.addField(prefix+"notify del", '將目前所在頻道通知刪除。')
		.addField(prefix+"notify on", '啟用目前所在的頻道通知。')
		.addField(prefix+"notify off", '停用目前所在的頻道通知。')		
		.addField(prefix+"notify allon", '啟用所有設定過的頻道通知。')
		.addField(prefix+"notify alloff", '停用所有設定過的頻道通知。')
		.setTimestamp();
		message.channel.send(exampleEmbed);

	}else if(command==='register'){

		var q_userid = mysql.raw("'"+clientid+"'");
		var q_authorid = mysql.raw("'"+authorid+"'");
		var q_authorname = mysql.raw("'"+authorname+"'");


		var sqlstr = "select uniqid,left(convert(limitdate,DATETIME),16) as limitdate ";			    
			sqlstr += "from tblUser ";
			sqlstr += "where userid= ? ";

		sqlstr = mysql.format(sqlstr, [ q_authorid ] );


		pool.query(sqlstr, function(err, result, fields) {
		    if (err) handleError(err);

		    if(result.length>0){
			    Object.keys(result).forEach(function(key) {
			    	var row = result[key];
			    	message.channel.send( authorname +" ,您已經註冊過了喔!!目前有效期間至 "+row.limitdate+"。" );
			    });  	
		    }else{

				var q_regdate = mysql.raw("DATE_ADD( NOW() , INTERVAL 8 HOUR )");
				var q_limitdate = mysql.raw("DATE_ADD( NOW() , INTERVAL 12 MONTH )");
				var insert_sql = mysql.format('INSERT INTO tblUser (userid,authorid,authorname,regdate,limitdate) values ( ? , ? , ? , ? , ? );', [q_authorid, q_authorid , q_authorname ,q_regdate ,q_limitdate ]);

				pool.query(insert_sql, function (error, results, fields) {
				  if (error) handleError(error);

				  var sql1 = mysql.format('DELETE FROM tblUserBoss WHERE userid= ? ;',[q_authorid]);				  
				  var sql2 = mysql.format('INSERT INTO tblUserBoss (userid,bossid) SELECT ?,bossid FROM tblboss;',[q_authorid]);				  
				  exec_sql(sql1).then(function(rtn1){
				  	exec_sql(sql2).then(function(rtn2){
				  		message.channel.send(authorname +" ,使用者註冊成功!!");
				  	});
				  });


				})

		    }

		});

	}else{
		//以下操作都需要註冊
		checklogin(authorid).then(function(login){
			if(login != null){
			var serverid = login[0].serverid;	
			
			if(command!='server'){
				if(serverid == null || serverid == "" || serverid == undefined){
					var msg = "伺服器ID未設定, "+message.author+"!\n";
					msg += "請先設定伺服器ID，設定方式如下：\n";
					msg += prefix+"server 伺服器ID：伺服器ID例如 4-4 , 13-2 , 6-6。";
					message.channel.send(msg);
					return;
				}			
			}

			switch(command){
				case 'server':
					if (!args.length) {
						var msg = "參數輸入錯誤, "+message.author+"!\n";
						msg += "輸入方式如下：\n";
						msg += prefix+"server 伺服器ID：伺服器ID例如 4-4 , 13-2 , 6-6。";
						message.channel.send(msg);
						return;
					}else{
						var input = args[0];			
						var q_userid = mysql.raw("'"+authorid+"'");
						var q_serverid = mysql.raw("'"+input+"'");

						var update_sql = "UPDATE tblUser SET serverid= ? WHERE userid = ? ; ";
						var sql = mysql.format(update_sql , [q_serverid , q_userid] );


						var sqlstr = " INSERT INTO tblServerBoss (bossid,serverid) ";
						sqlstr = sqlstr + " SELECT bossid,serverid ";
						sqlstr = sqlstr + " FROM ";
						sqlstr = sqlstr + " ( ";
						sqlstr = sqlstr + " 	SELECT b.*,a.serverid ";
						sqlstr = sqlstr + " 	,(SELECT COUNT(*) FROM tblServerBoss z WHERE z.bossid = b.bossid AND z.serverid = a.serverid) cnt ";
						sqlstr = sqlstr + " 	FROM ";
						sqlstr = sqlstr + " 	( ";
						sqlstr = sqlstr + " 	SELECT serverid ";
						sqlstr = sqlstr + " 	FROM tblUser ";
						sqlstr = sqlstr + " 	WHERE serverid > '' ";
						sqlstr = sqlstr + " 	GROUP BY serverid ";
						sqlstr = sqlstr + " 	) a CROSS JOIN tblboss b ";
						sqlstr = sqlstr + " ) a ";
						sqlstr = sqlstr + " WHERE cnt = 0 ";
						sqlstr = sqlstr + " AND serverid = ? ";
						var sql2 = mysql.format(sqlstr , [q_serverid ] );

						exec_sql(sql).then(function(rtn){
							exec_sql(sql2).then(function(rtn2){
					  			message.channel.send(message.author+",您的伺服器已經設定為:【"+input+"】 !!");
					  			return;
					  		});	
					  	});	
					}
				case 'notify':
					var isok = true;

					try{
						sid = message.guild.id;
						cid = message.channel.id;
					}catch(e){
						isok = false;
					}

					if(!isok){
						console.log("error:no message guild id");
						return ;
					}

					if (!args.length) {
						//無參數
						//console.log("show notify..");
						var sqlstr = "select server,channel,wbname,ison ";			    
							sqlstr += "from tblChannelWebhook ";
							sqlstr += "where userid='"+authorid+"'";
							sqlstr += "order by uniqid";
						//console.log(sqlstr);
						var msg = [];
						var sn = 0;
						var done = false;
						query_sql(sqlstr).then(function(rtn){	
							Object.keys(rtn).forEach(function(key) {
							    var row = rtn[key];
					    		//console.log(row);
					    		//var server ;
					    		//server = await getserver(row.server);
					    		getServerAndChannel(row.server,row.channel)
					    		.then(rtn => {
					    			sn ++;
					    			var s = rtn[0];
					    			var c = rtn[1];
					    			var str =sn+".伺服器:【"+s.name+"】,頻道:【"+c.name+"】:"+(row.ison=="Y"?"啟用":"停用"); 
					    			//console.log(str);
					    			msg.push(str);
					    		})
					    		.catch(console.error);
					    		//console.log(server);
						 		//return;
							});	

							function a(){
								setTimeout(function(){
									if(sn==rtn.length){
										done = true;
									}
									if(done){
										//console.log(msg);
										var msgcontent = "";
										for(m=0;m<msg.length;m++){
											msgcontent += msg[m]+"\n";
										}
										if(msgcontent!=""){
											message.channel.send(msgcontent);		
										}
										return;
									}
									a();
								},100);
							}
							a();
						});

					}else{
						//有參數
						var input = args[0];
						switch(input){
							case 'del':
								var sqlstr = "select uniqid ";			    
									sqlstr += "from tblChannelWebhook ";
									sqlstr += "where userid='"+authorid+"'";
									sqlstr += "and server='"+sid+"'";
									sqlstr += "and channel='"+cid+"'";
								query_sql(sqlstr).then(function(rtn){	
									Object.keys(rtn).forEach(function(key) {
									    var row = rtn[key];
							    
									    var q_uniqid = mysql.raw(""+row.uniqid+"");
									    var del_sql = "DELETE FROM tblChannelWebhook WHERE uniqid = ? ;";
									    var sql = mysql.format(del_sql , [q_uniqid] );
										//console.log(sql);
									  	exec_sql(sql).then(function(rtn2){
									  		message.channel.send(message.author+",目前頻道:【"+message.channel.name+"】 頻道通知已刪除!!");

									  		return;
									  	});
								 		
									});	
								});		

								break;
							case 'add':

								if(message.guild.me.hasPermission('MANAGE_WEBHOOKS')){

									var sqlstr = "select uniqid ";			    
									sqlstr += "from tblChannelWebhook ";
									sqlstr += "where userid='"+authorid+"'";
									sqlstr += "and server='"+sid+"'";
									sqlstr += "and channel='"+cid+"'";
									//console.log(sqlstr);

									query_sql(sqlstr).then(function(rtn){

									  	//console.log(rtn);
										var isNotExist = true;

										Object.keys(rtn).forEach(function(key) {
									      	var row = rtn[key];
									 		message.channel.send(message.author+",您在此頻道:【 "+message.channel.name+" 】 已設定過通知!!");
									 		return;
									    });  	
									    if(isNotExist){
									    	//create webhook 
											var webhookname = "小馬怪通知 at "+message.channel.name+"_"+authorid;
											// This will create the webhook with the name "Example Webhook" and an example avatar.
											message.channel.createWebhook(webhookname, "https://i.imgur.com/P4yamS3.jpg")
											// This will actually set the webhooks avatar, as mentioned at the start of the guide.
											.then(webhook => webhook.edit(webhookname, "https://i.imgur.com/P4yamS3.jpg")
											// This will get the bot to DM you the webhook, if you use this in a selfbot,
											// change it to a console.log as you cannot DM yourself
											.then(wb => {
												var q_userid = mysql.raw("'"+authorid+"'");
												var q_server = mysql.raw("'"+sid+"'");
												var q_channel = mysql.raw("'"+cid+"'");
												var q_wbname = mysql.raw("'"+webhookname+"'");
												var q_wbid = mysql.raw("'"+wb.id+"'");
												var q_wbtoken = mysql.raw("'"+wb.token+"'");

												var insert_sql = "INSERT INTO tblChannelWebhook (userid,server,channel,wbname,wbid,wbtoken,ison,create_date) ";
													insert_sql += "VALUES (? , ? , ? , ? , ? , ? ,'Y', DATE_ADD(NOW(),INTERVAL 8 HOUR ) ); ";
												var sql = mysql.format(insert_sql , [q_userid,q_server,q_channel,q_wbname,q_wbid,q_wbtoken] );
												//console.log(sql);
											  	exec_sql(sql).then(function(rtn2){
											  		message.channel.send(message.author+",目前頻道:【"+message.channel.name+"】 設定加入通知成功!!");
											  	});			  
												//message.channel.send(`Here is your webhook https://canary.discordapp.com/api/webhooks/${wb.id}/${wb.token}`)	

											}).catch(console.error));

									    }		


									});

									
								}else{
									message.channel.send(message.author+",小馬怪權限不足，無法幫你設定頻道通知，請來訊管理員!!");
								}	


								break;
							case 'off':
								var q_userid = mysql.raw("'"+authorid+"'");
								var q_sid = mysql.raw("'"+sid+"'");
								var q_cid = mysql.raw("'"+cid+"'");	

								var update_sql = "UPDATE tblChannelWebhook SET ison='N' WHERE userid = ? and server= ? and channel = ? ; ";
								var sql = mysql.format(update_sql , [q_userid,q_sid,q_cid] );

								exec_sql(sql).then(function(rtn){
							  		message.channel.send(message.author+",目前此頻道:【"+message.channel.name+"】 頻道通知已停用!!");
							  		return;
							  	});		

								break;
							case 'on':

								var q_userid = mysql.raw("'"+authorid+"'");
								var q_sid = mysql.raw("'"+sid+"'");
								var q_cid = mysql.raw("'"+cid+"'");	

								var update_sql = "UPDATE tblChannelWebhook SET ison='Y' WHERE userid = ? and server= ? and channel = ? ; ";
								var sql = mysql.format(update_sql , [q_userid,q_sid,q_cid] );
									
								exec_sql(sql).then(function(rtn){
							  		message.channel.send(message.author+",目前此頻道:【"+message.channel.name+"】 頻道通知已啟用!!");
							  		return;
							  	});

								break;								

							case 'alloff':
								var q_userid = mysql.raw("'"+authorid+"'");

								var update_sql = "UPDATE tblChannelWebhook SET ison='N' WHERE userid = ? ; ";
								var sql = mysql.format(update_sql , [q_userid] );
								//console.log(sql);
							  	exec_sql(sql).then(function(rtn2){					  		
							  		message.channel.send(message.author+",您的所有頻道通知已全部停用。如要啟用請使用^notify on.");
							  		//channelnotify(authorid,"您的所有頻道通知已全部停用。如要啟用請使用^notify on.");
							  	});		

								break;
							case 'allon':
								var q_userid = mysql.raw("'"+authorid+"'");

								var update_sql = "UPDATE tblChannelWebhook SET ison='Y' WHERE userid = ? ; ";
								var sql = mysql.format(update_sql , [q_userid] );
								//console.log(sql);
							  	exec_sql(sql).then(function(rtn2){

						        	const msg = new Discord.RichEmbed();

						        	msg.setColor("#ff0000")
						            .setTitle(message.author.username+",您的所有頻道通知已全部啟用.");

						            //console.log(message);
							  		//message.channel.send(msg);

							  		//send all set channel
							  		channelnotify(authorid,msg);
							  	});		

								break;	



						}


					}

					break;

				case 'map':

					const msg1 = new Discord.RichEmbed();
					msg1.setColor("#ff0000")
		            .setTitle("古魯丁領地 野王編號 1-01 至 1-05。")
		            .setImage("https://i.imgur.com/S0dRDS4.jpg")
		            .setTimestamp();
					message.channel.send(msg1);

					const msg2 = new Discord.RichEmbed();
					msg2.setColor("#ff0000")
		            .setTitle("狄恩領地 野王編號 2-01 至 2-13")
		            .setImage("https://i.imgur.com/Pkg7Qrb.jpg")
		            .setTimestamp();
					message.channel.send(msg2);

					const msg3 = new Discord.RichEmbed();
					msg3.setColor("#ff0000")
		            .setTitle("奇岩領地 野王編號 3-01 至 3-07。")
		            .setImage("https://i.imgur.com/EstZyjp.jpg")
		            .setTimestamp();
					message.channel.send(msg3);

					const msg4 = new Discord.RichEmbed();
					msg4.setColor("#ff0000")
		            .setTitle("奧倫領地 野王編號 4-01 至 4-11。")
		            //.setImage("https://i.imgur.com/EstZyjp.jpg")
		            .setTimestamp();
					message.channel.send(msg4);

					const msg5 = new Discord.RichEmbed();
					msg5.setColor("#ff0000")
		            .setTitle("Aden領地 野王編號 5-01 至 4-05。")
		            //.setImage("https://i.imgur.com/EstZyjp.jpg")
		            .setTimestamp();
					message.channel.send(msg5);


					break;
				case 'maintain':
					if (!args.length) {
						var msg = "參數輸入錯誤, "+message.author+"!\n";
						msg += "輸入方式如下：\n";
						msg += prefix+"maintain 日期時間：維護時間，全部的王的重生時間重置。";
						message.channel.send(msg);
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

						var q_userid = mysql.raw("'"+authorid+"'");
						var q_kill = mysql.raw("'"+fixtime+"'");
						var q_reborn = mysql.raw("DATE_ADD('"+fixtime+"',INTERVAL (select cycletime FROM tblboss z WHERE z.bossid=tblUserBoss.bossid)*60 MINUTE )");


						// user boss
						var update_sql = mysql.format('UPDATE tblUserBoss SET killtime = ? ,reborntime = ? WHERE userid= ? ', [q_kill, q_reborn , q_userid ]);

						pool.query(update_sql, function (error, results, fields) {
						  if (error) handleError(error);
						  //message.channel.send(message.author+",野王重生時間已全部重置!!");
						})


						// server boss
						var q_serverid = mysql.raw("'"+serverid+"'");
						var q_kill1 = mysql.raw("'"+fixtime+"'");
						var q_reborn1 = mysql.raw("DATE_ADD('"+fixtime+"',INTERVAL (select cycletime FROM tblboss z WHERE z.bossid=tblServerBoss.bossid)*60 MINUTE )");

						var update_sql = mysql.format('UPDATE tblServerBoss SET killtime = ? ,reborntime = ? ,userid = ?, isauto=0 WHERE serverid = ?  ', [q_kill1, q_reborn1, q_userid, q_serverid ]);

						pool.query(update_sql, function (error, results, fields) {
						  if (error) handleError(error);
						  message.channel.send(message.author+",野王重生時間已全部重置!!");
						})

					}
					

					break;






				case 'reset':
					if (!args.length) {

						var msg = "參數輸入錯誤, "+message.author+"!\n";
						msg += "輸入方式如下：\n";
						msg += prefix+"reset 野王編號 ：清空重生時間。";
						message.channel.send(msg);

					}else{

						var bossid = args[0];
						var uniqid = "";
						var sqlstr = "select uniqid ";			    
							sqlstr += "from tblboss ";
							sqlstr += "where bossid='"+bossid+"'";
						
						pool.query(sqlstr, function(err, result, fields) {
						    if (err) handleError(err);
						    var isNotExist = true;

							Object.keys(result).forEach(function(key) {
						      	var row = result[key];
						      	uniqid = row.uniqid;
						      	isNotExist = false;

						 		var q_userid = mysql.raw("'"+authorid+"'");
						        var q_bossid = mysql.raw("'"+bossid+"'");
								var q_kill = mysql.raw("NULL");
								var q_reborn = mysql.raw("NULL");
								var update_sql = mysql.format('UPDATE tblUserBoss SET killtime = ? ,reborntime = ? WHERE userid= ? and bossid = ? ', [q_kill, q_reborn , q_userid , q_bossid ]);

								pool.query(update_sql, function (error, results, fields) {
								  if (error) handleError(error);
								  //message.channel.send(message.author+",野王編號 【"+bossid+"】 已清空!!");
								})

								var q_serverid = mysql.raw("'"+serverid+"'");
								var update_sql = mysql.format('UPDATE tblServerBoss SET killtime = ? ,reborntime = ?, userid = ? WHERE bossid = ? and serverid = ? ', [q_kill, q_reborn ,q_userid , q_bossid , q_serverid ]);

								pool.query(update_sql, function (error, results, fields) {
								  if (error) handleError(error);
								  message.channel.send(message.author+",野王編號 【"+bossid+"】 已清空!!");
								})

						    });  	
						    if(isNotExist){
						    	message.channel.send(message.author+",野王編號 【"+bossid+"】 此編號不存在。請重新輸入!!");
						    }				    	

						});

					}
					




					break;


				case 'kill':
					if (!args.length) {

						var msg = "參數輸入錯誤, "+message.author+"!\n";
						msg += "輸入方式如下：\n";
						msg += prefix+"kill 野王編號 ：更新擊殺野王的時間，會使用系統時間-3分鐘。\n";
						msg += prefix+"kill 野王編號 日期時間：更新擊殺野王的時間，時間輸入範例如: 2019/12/10 11:50 轉換成 201912101150 。";
						message.channel.send(msg);

					}else{

						var bossid = args[0];
						var uniqid = "";
						var killtime = "";
						if(args.length>1){
							input_time = args[1];
							if(input_time.length!=12){
								if(input_time.length!=4){	
									message.channel.send("時間輸入範例如: 2019/12/10 11:50 轉換成 201912101150");
									break;
								}else{
									/*
									var datestr = new Date().toISOString().
												  replace(/T/, ' ').
												  replace(/-/, '').
												  .substr(0, 10);
									killtime += datestr+" "+input_time.substr(0,2)+":"+input_time.substr(2,2);	
									if(isNaN(Date.parse(killtime))){
										message.channel.send("時間輸入範例如: 11:50 轉換成 1150");
										//message.author.send
										break;	
									}
									*/
									message.channel.send("時間輸入範例如: 2019/12/10 11:50 轉換成 201912101150");
									break;
								}
							}else{
								killtime += input_time.substr(0,4) +"/"+input_time.substr(4,2)+"/"+input_time.substr(6,2)+" "+input_time.substr(8,2)+":"+input_time.substr(10,2);
								if(isNaN(Date.parse(killtime))){
									message.channel.send("時間輸入範例如: 2019/12/10 11:50 轉換成 201912101150");
									//message.author.send
									break;	
								}
								//console.log(killtime);	
							}
						}
					
						var sqlstr = "select uniqid ";
							sqlstr += ",(select count(*) from tblUserBoss z where z.bossid=a.bossid) cnt ";	
							sqlstr += ",(select count(*) from tblServerBoss z where z.bossid=a.bossid) servercnt ";		    
							sqlstr += "from tblboss a ";
							sqlstr += "where bossid='"+bossid+"'";
						
						pool.query(sqlstr, function(err, result, fields) {
						    if (err) handleError(err);
						    var isNotExist = true;
							Object.keys(result).forEach(function(key) {
						      	var row = result[key];
						      	uniqid = row.uniqid;
						      	cnt = row.cnt;
						      	servercnt = row.servercnt;
						      	isNotExist = false;

						        var	update_sql = "";
						        var update_sql_server = "";
						        var q_userid = mysql.raw("'"+authorid+"'");
						        var q_bossid = mysql.raw("'"+bossid+"'");
						        var q_serverid = mysql.raw("'"+serverid+"'");
								var q_kill = "";
								var q_reborn = "";

					        	if(killtime==""){

					        		q_kill = mysql.raw("DATE_ADD(NOW(),INTERVAL 477 MINUTE)");
									q_reborn = mysql.raw("DATE_ADD(DATE_ADD(NOW(),INTERVAL 477 MINUTE),INTERVAL (select cycletime FROM tblboss WHERE bossid='"+bossid+"')*60 MINUTE)");

					        	}else{
					        		q_kill = mysql.raw("'"+killtime+"'");
									q_reborn = mysql.raw("DATE_ADD('"+killtime+"',INTERVAL (select cycletime FROM tblboss WHERE bossid='"+bossid+"')*60 MINUTE)");
					        	}


					        	if(cnt>0){
					        		update_sql = mysql.format('UPDATE tblUserBoss SET killtime = ? ,reborntime = ? WHERE userid= ? and bossid = ? ', [q_kill, q_reborn , q_userid , q_bossid ]);
					        		//同步更新tblBoss時間
					        		//update_sql = mysql.format('UPDATE tblboss SET killtime = ? ,reborntime = ? WHERE bossid = ? ', [q_kill, q_reborn , q_bossid ]);
					        	}else{
					        		update_sql = mysql.format('INSERT tblUserBoss (bossid,userid,killtime,reborntime) VALUES (?, ?, ?, ?) ', [q_bossid, q_userid, q_kill, q_reborn   ]);
					        	}
								
								// 同步更新tblServerBoss時間
					        	if(servercnt>0){
					        		update_sql_server = mysql.format('UPDATE tblServerBoss SET killtime = ? ,reborntime = ?, userid = ?, isauto=0 WHERE serverid= ? and bossid = ? ', [q_kill, q_reborn , q_userid , q_serverid , q_bossid ]);
					        	}else{
					        		update_sql_server = mysql.format('INSERT tblServerBoss (bossid,serverid,userid,killtime,reborntime,isauto) VALUES (?, ?, ?, ?, ?, 0) ', [q_bossid, q_serverid, q_userid, q_kill, q_reborn ]);
					        	}


								pool.query(update_sql, function (error, results, fields) {
								  if (error) handleError(error);
								  pool.query(update_sql_server, function (error1, results1, fields1) {
								  	if (error1) handleError(error1);
								  	message.channel.send(message.author+",野王編號 【"+bossid+"】 下次重生時間已更新!!");
								  })
								})

								/*
					        	if(killtime==""){
					        		q_kill = mysql.raw("DATE_ADD(NOW(),INTERVAL 477 MINUTE)");
									q_reborn = mysql.raw("DATE_ADD(DATE_ADD(NOW(),INTERVAL 477 MINUTE),INTERVAL (cycletime)*60 MINUTE)");
					        	}else{
					        		q_kill = mysql.raw("'"+killtime+"'");
									q_reborn = mysql.raw("DATE_ADD('"+killtime+"',INTERVAL (cycletime)*60 MINUTE)");
					        	}

								var update_sql1 = mysql.format('UPDATE tblboss SET killtime = ? ,reborntime = ? WHERE bossid = ? ', [q_kill, q_reborn , q_bossid ]);								

								pool.query(update_sql1, function (error, results, fields) {
								  if (error){
								  	handleError(error);
								  	console.log(update_sql1);
								  } 
								})
								*/


						    });
						    if(isNotExist){
						    	message.channel.send(message.author+",野王編號 【"+bossid+"】 此編號不存在。請重新輸入!!");
						    }
						});

					}
					




					break;

				case 'bossall':

					for(mapi=1;mapi<=5;mapi++){

						var sqlstr = "select a.bossid,a.imgurl2 as imgurl ";			    
							sqlstr += ",left(convert(b.killtime,DATETIME),16) as killed ";
							sqlstr += ",left(convert(b.reborntime,DATETIME),16) as reborn ";
							sqlstr += ",TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , b.reborntime ) AS dues ";
							sqlstr += ",a.cycletime ";
							sqlstr += ",a.bossimg  ";
							sqlstr += ",a.rank  ";
							sqlstr += ",a.bossname,a.bossname_kr  ";
							sqlstr += ",a.location,a.location_kr ";
							sqlstr += ",a.lv ";	
							sqlstr += ",b.isauto ";	
							sqlstr += "from tblboss a LEFT OUTER JOIN (SELECT * from tblServerBoss WHERE serverid='"+serverid+"') b ";
							sqlstr += "on a.bossid = b.bossid ";
							sqlstr += "where a.bossid like '"+mapi+"-%' ";
							sqlstr += "order by 1 ";	
						const msg = new Discord.RichEmbed();
						msg.setTitle("伺服器:"+serverid+" 第"+mapi+"區BOSS清單");
						msg.setColor("#0099ff");


						pool.query(sqlstr, function(err, rows, fields) {
						    if (err) handleError(err);
						    	
							var recordset = rows;
							var rows = 0;

							for(i=0;i<recordset.length;i++)
							{
								rows ++;
								var row = recordset[i];
								var rank = "";
								switch(row.rank){
									case 'r':
										rank = "紅";
										break;
									case 'b':
										rank = "藍";
										break;
									case 'p':
										rank = "紫";
										break;
								}
								var bossname = row.bossname_kr+(row.bossname!=row.bossname_kr?" "+row.bossname:"");
								var bosslocation = row.location_kr+(row.location!=row.location_kr?" "+row.location:"");

								var autoflag = "";
								if(row.isauto!="0"){
									autoflag = "【自動展延"+row.isauto+"次】";
								}

								var msgtitle = row.bossid+" "+ bossname + " ("+rank+") " + autoflag;							
								var msgcontent = "地點："+bosslocation+"\n";
									msgcontent += "前次擊殺時間："+(row.killed == null ? "無":row.killed) + " \n";
									if(row.cycletime==null){
										msgcontent += "重生間格：隨機\n";
									}else{
										msgcontent += "重生間格："+ row.cycletime +"小時\n";
										msgcontent += "預計出現時間： "+(row.reborn == null ? "無":row.reborn) +" \n";										
								}
								msg.addField(msgtitle,msgcontent);
								//message.channel.send(msgcontent);						
							}

							msg.setTimestamp();

							if(rows>0){
								setTimeout(function(){
									message.channel.send(msg);	
								},mapi*200);
							}else{
								//message.channel.send("目前沒有記錄喔!!");	
							}
							//console.log(msgcontent);

						});


					}


					//message.channel.send('test!');
					break;

				case 'boss':

					if (!args.length) {

						for(mapi=1;mapi<=5;mapi++){

							var sqlstr = "select a.bossid,a.imgurl2 as imgurl ";			    
								sqlstr += ",left(convert(b.killtime,DATETIME),16) as killed ";
								sqlstr += ",left(convert(b.reborntime,DATETIME),16) as reborn ";
								sqlstr += ",TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , b.reborntime ) AS dues ";
								sqlstr += ",a.cycletime ";
								sqlstr += ",a.bossimg  ";
								sqlstr += ",a.rank  ";
								sqlstr += ",a.bossname,a.bossname_kr  ";
								sqlstr += ",a.location,a.location_kr ";
								sqlstr += ",a.lv ";	
								sqlstr += ",b.isauto ";	
								sqlstr += "from tblboss a LEFT OUTER JOIN (SELECT * from tblServerBoss WHERE serverid='"+serverid+"') b ";
								sqlstr += "on a.bossid = b.bossid ";
								sqlstr += "where b.reborntime > DATE_ADD(NOW(),INTERVAL 8 HOUR ) ";
								sqlstr += "and a.bossid like '"+mapi+"-%' ";
								sqlstr += "order by 4 ";	

								pool.query(sqlstr, function(err, rows, fields) {
								    if (err) handleError(err);


								    var bossmsg = new Discord.RichEmbed();
									bossmsg.setTitle("伺服器:"+serverid+" 待出BOSS清單");
									bossmsg.setColor("#ff0000");	
									var recordset = rows;
									var rowscnt = 0;

									for(i=0;i<recordset.length;i++)
									{
										rowscnt ++;
										var row = recordset[i];
										var rank = "";
										switch(row.rank){
											case 'r':
												rank = "紅";
												break;
											case 'b':
												rank = "藍";
												break;
											case 'p':
												rank = "紫";
												break;
										}
										var bossname = row.bossname_kr+(row.bossname!=row.bossname_kr?" "+row.bossname:"");
										var bosslocation = row.location_kr+(row.location!=row.location_kr?" "+row.location:"");

										var autoflag = "";
										if(row.isauto!="0"){
											autoflag = "【自動展延"+row.isauto+"次】";
										}

										var msgtitle = row.bossid+" "+ bossname + " ("+rank+") " + autoflag ;							
										var msgcontent = "地點："+bosslocation+"\n";
											msgcontent += "預計時間："+(row.reborn == null ? "無":row.reborn) + " \n";
											msgcontent += "距離現在："+row.dues + "分鐘 \n";									
										
										bossmsg.addField(msgtitle,msgcontent);


										//msgcontent += "【" + row.bossid +" "+ row.bossname + " ("+rank+") 在 "+row.location+" ，" + " - 預計時間:"+row.reborn+" - 距離現在："+ row.dues +"分鐘】\n";
										
										//message.channel.send(msgcontent);						
									}
									if(rowscnt>0){
										message.channel.send(bossmsg);	
									}else{
										message.channel.send("目前野王都沒有擊殺記錄喔!!");	
									}
									//console.log(msgcontent);

								});

						}	

						

						

					}else{
						var bossid = args[0];

						var sqlstr = "select a.bossid,a.imgurl2 as imgurl ";			    
							sqlstr += ",left(convert(b.killtime,DATETIME),16) as killed ";
							sqlstr += ",left(convert(b.reborntime,DATETIME),16) as reborn ";
							sqlstr += ",TIMESTAMPDIFF(MINUTE, DATE_ADD(NOW(),INTERVAL 8 HOUR ) , b.reborntime ) AS dues ";
							sqlstr += ",a.cycletime ";
							sqlstr += ",a.bossimg  ";
							sqlstr += ",a.rank  ";
							sqlstr += ",a.bossname,a.bossname_kr  ";
							sqlstr += ",a.location,a.location_kr ";
							sqlstr += ",a.lv ";	
							sqlstr += ",a.url ";
							sqlstr += ",b.isauto ";		
							sqlstr += "from tblboss a LEFT OUTER JOIN (SELECT * from tblServerBoss WHERE serverid='"+serverid+"') b ";
							sqlstr += "on a.bossid = b.bossid ";
							sqlstr += "where a.bossid = '"+bossid+"' ";

							pool.query(sqlstr, function(err, recordset, fields) {
								if (err) handleError(err);
							    
								var msgcontent = "";
								if (recordset.length > 0){
									var row = recordset[0];
									var rank = "";
									var background = "";
									switch(row.rank){
										case 'r':
											rank = "紅";
											background = "#ff0000";
											break;
										case 'b':
											rank = "藍";
											background = "#0000ff";
											break;
										case 'p':
											rank = "紫";
											background = "#8340ff";
											break;
										default:
											rank = "";
											background = "#ffffff";					
											break;
									}

						        	const msg = new Discord.RichEmbed();

									var bossname = row.bossname_kr+(row.bossname!=row.bossname_kr?" "+row.bossname:"");
									var bosslocation = row.location_kr+(row.location!=row.location_kr?" "+row.location:"");
									var url = "http://lineage2m.inven.co.kr/dataninfo/boss/";
									if(row.url!=null && row.url!=""){
										url = row.url;
									}

						        	msg.setColor(background)
						            .setTitle("野王資料查看")
						            .setURL(url)
						            .addField("野王編號", row.bossid + " ("+rank+") " )
						            .addField("野王名稱", bossname )
						            .addField("等級", row.lv)
						            .addField("出現地區", bosslocation )
						            .addField("上次擊殺時間", row.killed )
						            .addField("預計出現時間", row.reborn )
						            .addField("重生時間", row.cycletime + " 小時");

									if(row.imgurl!=null&&row.imgurl!=""){
							            msg.setImage(row.imgurl)
									}     

									//if(row.bossimg!=null&&row.bossimg!=""){
							        //    msg.setImage(row.bossimg)
									//}        	
							        msg.setTimestamp();


									message.channel.send(msg);

								}else{
									message.channel.send('找不到 【'+bossid+'】 的資料.');
								}	


							});



					}

					

					//message.channel.send('test!');
					break;
				default:
					message.channel.send('您可以輸入 ^help 查看指令.');
					break;
			}

			//switch end







			}else{
				message.channel.send("您還沒有進行註冊喔，可以使用 ^register 進行註冊。");	
				return;	
			}
		});
	}

	


});


function handleError (error) {
	console.log(error);
}


function checkuser(authid,fncallback){
	checklogin(authid).then(function(logstat){
		if(logstat != null){
			fncallback(logstat)
		}else{
			message.channel.send(logstat);		
			return;
		}
	});
}


function checklogin(authorid) {
  return new Promise(function(resolve, reject) { 	
	var q_authorid = mysql.raw("'"+authorid+"'");
	var sqlstr = "select uniqid,left(convert(limitdate,DATETIME),16) as limitdate,serverid ";			    
		sqlstr += "from tblUser ";
		sqlstr += "where userid= ? ";
	sqlstr = mysql.format(sqlstr, [ q_authorid ] );

	pool.query(sqlstr, function(err, result, fields) {
	    if (err) handleError(err);
	    if(result.length>0){
	    	resolve(result);
	    }else{
	    	resolve(null);
	    }
	});
  })
}





function query_sql(mysql_sql){
	return new Promise(function(resolve, reject) { 	
		pool.query(mysql_sql, function (err, results, fields) {
			if (err) resolve(null);
			resolve(results);
		});
	})
}


function exec_sql(mysql_sql){
	return new Promise(function(resolve, reject) { 	
		pool.query(mysql_sql, function (err, results, fields) {
			if (err) resolve(false);
			resolve(true);
		});
	})
}


async function getServerAndChannel(fnserverid, fnchannelid) {
  const s = await getserver(fnserverid);
  const c = await getchannel(fnchannelid);
  return [s,c]; 
  //return s;
}

function getserver(fnserverid){
	return new Promise(function(resolve, reject) { 
		let guilds = client.guilds.array();
		for (let i = 0; i < guilds.length; i++) {
			if(guilds[i].id===fnserverid){
				var g = client.guilds.get(guilds[i].id);
				resolve(g);
			}
			//resolve(null);
		}
	})
}

function getchannel(fnchannelid){
	return new Promise(function(resolve, reject) { 
		let channels = client.channels.array();
		for (let i = 0; i < channels.length; i++) {
			if(channels[i].id===fnchannelid){
				var c = client.channels.get(channels[i].id);
				resolve(c);
			}

		}
	})
}


function getuser(fnuserid){
	return new Promise(function(resolve, reject) { 
		let guilds = client.guilds.array();
		for (let i = 0; i < guilds.length; i++) {
		    client.guilds.get(guilds[i].id).fetchMembers().then(r => {
		      r.members.array().forEach(r => {
		        //let username = `${r.user.username}#${r.user.discriminator}(${r.user.id})`;
		        //console.log(`${username}`);
		        if(r.user.id === fnuserid ){
		        	resolve(r.user);
		        }
		      });
		    });
		}
	})
}

function timeoutPromise(delay) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject('Timeout!');
    }, delay);
  });
}