import * as DiscordJS from 'discord.js';
import * as dotenv from 'dotenv';
import { Intents } from "discord.js";
dotenv.config();

let imperator : DiscordJS.User;
let defaultprefix = '*';
let prefixes :{[key: string]: string[]} = {}; //   { 'serverid' : [prefix0, prefix1...]}

let permittedusrs : Array<DiscordJS.User> = [];

let replies = ['Да ты зайпал', 'Налоги плати далпаёп', 'Ты мащенник йопаный', 'Ведьмака покормите, хлебом и водичкой, о-о-о-о-о!', 'https://tenor.com/view/hacker-pc-meme-matrix-codes-gif-16730883'];

const client = new DiscordJS.Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

client.on('ready', () => {
    imperator = client?.users?.cache?.get('534032368634167311')!;
    permittedusrs.push(imperator);
    client.guilds.cache.forEach((guild) => {
        prefixes[guild.id] = [defaultprefix,];
    })
    client?.user?.setPresence(
        {
            status: 'online',
            activities : [
                {
                    name: 'Alabama',
                    type: 'COMPETING',
                }
            ]
        }
    )
    console.log("Logged!");
});

client.on('guildCreate', (guild) => {
    console.log(guild.name);
    prefixes[guild.id] = [defaultprefix,];
})

client.on('guildDelete', (guild) => {
    delete prefixes[guild.id];
})

client.on('messageCreate', (message) => {
    if (message.author.bot)
        return;
    let senderpermitted = false;
    if (permittedusrs.indexOf(message.author) > -1)
        senderpermitted = true;
    if (message.channel.id == '926483312212598804')
    {
        message.react('👍');
        message.react('👎');
        return;
    }
    if (message.channelId == '950637260561326090')
    {
        message.crosspost();
    }
    let content = message.content.trim();
    if (message.content.startsWith(`<@${client?.user?.id!}> `))
        content = content.slice(22);
    else
    {
        // if (!prefixes[message.guild.id].length)
        // {
        //     return;
        // }
        let passable = false;
        prefixes[message?.guild?.id!].forEach((el) => {
            if (content.startsWith(el))
            {
                content = content.slice(el.length)
                passable = true;
                return;
            }
        });
        if (!passable)
            return;
        
    }
    let args = content.split(' ');
    if (message.author.id == '531069407221383179')
    {
        message.reply('Своего бота делай, мащеник ты токсичный Торен');
        return;
    }
    if (args[0] == 'работайбляд')
    {
        message.reply(replies[Math.floor(Math.random() * replies.length)]);
        return;
    }
    if (args[0] == 'prefix')
    {
        // подтверждение действия
        if (args[1] == 'default')
        {
            if (args[2] == 'redefine')
            {
                if (!senderpermitted)
                {
                    message.reply(`Ты не достоин такой власти воин`);
                    return;
                }
                if (args.length < 4)
                {
                    message.reply('Вы не указали на какой префикс менять');
                    return;
                }
                defaultprefix = args[3];
                message.reply(`Теперь при добавлении на сервер по дефолту мой префикс будет \`${defaultprefix}\``);
            }
        }
        if (args[1] == 'remove')
        {
            if (args.length < 3)
            {
                message.reply('А сам префикс то где бляд?');
                return;
            }
            let eltodeleteind = prefixes[message?.guild?.id!].indexOf(args[2]);
            if (eltodeleteind < 0)
            {
                message.reply('Такого префикса нема');
                return;
            }
            prefixes[message?.guild?.id!].splice(eltodeleteind, 1);
            if (prefixes[message?.guild?.id!].length != 0)
            {
                message.reply(`Префикс ${args[2]} истреблён, остались ${getPrefixes(message?.guild?.id!)}`);
                return;
            }
            message.reply(`Префикс ${args[2]} истреблён, все префиксы ушли в ислам`);
            return;
        }
        if (args[1] == 'set')
        {
            prefixes[message?.guild?.id!].push(args[2]);
            message.reply(`Теперь на районе ко мне обращаться через:   \`${args[2]}\``);
            return;
        }
        
    }
    if (!prefixes[message?.guild?.id!].length)
    {
        message.reply('Префиксов нема');
        return;
    }
    message.reply(`Мои префиксы:   ${getPrefixes(message?.guild?.id!)}`);
    return;
})

let voiceConfig = {
    inkin: false,
    killain: false,
    inkid: '702721820499116054',
    killaid: '398132164182671361',
    // was just testing out on my accounts
    // let inkid = '534032368634167311';
    // let killaid = '716276860660613150';

    // i have no idea what this is
    // killamsgid,
    // inkmsgid,
}

function getPrefixes(guildid : string) : string
{
    let prefixesres = '';
    prefixes[guildid].forEach((item) => {prefixesres += `\`${item}\`, `});
    return prefixesres.slice(0, -2);
}

client.on('voiceStateUpdate', (newVoiceState) => {
    if (newVoiceState.id != voiceConfig.inkid && newVoiceState.id != voiceConfig.killaid)
        return;
    let actor = client.users.cache.get(newVoiceState.id);
    // console.log(newVoiceState);
    // console.log(`${imperator?.username} and ${actor?.username}`);
    if (!actor)
        imperator?.send('U fucked up');
    if (newVoiceState.id == voiceConfig.inkid)
    {
        if (voiceConfig.inkin)
        {
            voiceConfig.inkin = false;   
        }
        else
        {
            voiceConfig.inkin = true;
            imperator?.send("Inkie is waiting!");
        }
    } else if (newVoiceState.id == voiceConfig.killaid)
    {
        if (voiceConfig.killain)
            voiceConfig.killain = false;
        else
        {
            voiceConfig.killain = true;
            imperator?.send("Time to tear ur stomach apart, killa came in");
        }
    }
});

// нужно автоматически добавлять дефолтный префикс при добавлении на сервер

client.login(process.env.TOKEN);
