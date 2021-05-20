const discord = require('discord.js')

const bot = new discord.Client()

const mysql = require('mysql')

const fs = require('fs')

const ms = require("pkg_ms_to_time")

const mysql_f = require('pkg_mysql_operation')

const config = require('./configs/config.json')

bot.on("ready", () =>{
    console.log(`[INFO]: Bot is ready as ${bot.user.tag}!`);
    bot.user.setActivity((config.statusmessage), { type: (config.statustype) }) //stato del bot discord per cambiare fare riferimento a ./configs/config.json
})

 //credenziali usate dallo script per l'accesso al database
const con = mysql.createConnection({
    host:(config.mysqlhost),
    user:(config.mysqluser),
    password:(config.mysqlpassword),
    database:(config.mysqldatabase)
    
})

let tabella = "eugeo_user_info"

let trovato = false

con.connect()

bot.on('guildMemberAdd',utente=>{
    try {
        mysql_f.insert(con,utente.id,tabella,"DISCORD_USER_ID")
      //aggiunge i dati nella tabella eugeo_user_info nel database bot_ds MySQL
    } catch (error) {
        console.log("[MySQL Warn]: Values ​​already in the database!")
    }
})

bot.on('message',msg=>{
    let lower = msg.content.toLocaleLowerCase()

    //stringa codice dedicata al comando !test restituisce un messaggio di prova Test
    if(lower == `${config.prefix}test`){
        msg.channel.send("Questo è un test! :heart:")  
    } 

    //embed dedicato alle info!
    if(lower == `${config.prefix}info`){
        let embed = new discord.MessageEmbed()
        embed.setTitle("**Info**")
        embed.setColor('#1976af')
        embed.addField("**Attualmente in sviluppo!**",'\u200b')
        embed.setDescription('Per usufruire correttamente di tutte le funzioni del bot fare **!register**')
        embed.setFooter('Eugeo')
        msg.channel.send(embed) 
    }

    //embed dedicato al comando help!
    if(lower == `${config.prefix}help`){
        let embed = new discord.MessageEmbed()
        embed.setTitle("**Informazioni Comandi**")
        embed.setColor('#1976af')
        embed.addFields(
            {name: "!info" , value: "\u200b"},
            {name: "!uptime" , value: "\u200b"},
            {name: "!register" , value: "\u200b"},
            {name: "!eugeo" , value: "\u200b"}
        )
        embed.setFooter('Eugeo')
        msg.channel.send(embed) 
    }

    //riporta in chat un saluto! all'esecuzione del comando !eugeo
    if(lower == `${config.prefix}eugeo`){
        msg.channel.send("Ehy Ciaoooo! :hand_splayed:")
    }

    //riporta in chat l'uptime del bot!
    if(lower == `${config.prefix}uptime`){
	let ottenuto = ms.get_time(bot.uptime)
        msg.channel.send("Sono online da:") 
        msg.channel.send(ottenuto.total)
    }

    //embed.setAuthor(bot.user.username+"#"+bot.user.discriminator)
    if(lower == `${config.prefix}register`){
        let embed = new discord.MessageEmbed()   
        embed.setTitle("**User succesfully registered!**")
        embed.setColor('#32cd32')
        embed.setThumbnail(msg.author.displayAvatarURL())
        embed.addField(`**${msg.author.username}#${msg.author.discriminator}   Server: ${msg.guild.name}**`,'\u200b')
        embed.setFooter('Eugeo')
        msg.channel.send(embed)
        mysql_f.insert(con,msg.author.id,tabella,"DISCORD_USER_ID")
    }

})

//bot token fare riferimento a ./configs/config.json
bot.login(config.token)