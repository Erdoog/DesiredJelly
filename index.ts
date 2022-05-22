import * as DiscordJS from 'discord.js';
import * as dotenv from 'dotenv';
import { Intents, Constants } from "discord.js";
dotenv.config();

let imperator : DiscordJS.User;
const mGuildId = '732947430080774184';
let defaultprefix = '#';
let prefixes: {[key: string]: string[]} = {}; //   { 'serverid' : [prefix0, prefix1...]}
let commandopts: {[key: string]: {[key: string] : any[]}} = {};

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
    console.log("Logged!");
    client.users.fetch('534032368634167311').then(async (user) => {
        imperator = user;
        permittedusrs.push(user);
    });
    client.guilds.cache.forEach((guild) => {
        prefixes[guild.id] = [defaultprefix,];
    });
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
    );
    const guild = client.guilds.cache.get(mGuildId + '!');
    let commands;
    if (guild)
        commands = guild.commands;
    else
        commands = client.application?.commands;
    commands?.create({
        name: 'changeactivity',
        description: 'Изменить активность бота', 
        options: [
            {
                name: 'subject',
                description: 'Субъект активности',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
        ],
    });
    // guild.commands.cache.forEach((value) => {
    //     value.delete()
    // })
    console.log('Steady and ready!');
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand())
    {
        await interaction.deferReply({
            ephemeral: true
        });
        const { commandName, options } = interaction;
        if (!interaction.member)
        {
            interaction.reply('Your user is null for some reason');
            return;
        }
        if (!commandopts[interaction.member.user.id])
            commandopts[interaction.member.user.id] = {};
        if (commandopts[interaction.member.user.id][commandName] !== undefined){
            interaction.reply('Нихуа ты разогнался, это нельзя вызвать несколько раз одновременно');
            return;
        }
        if (commandName === 'changeactivity')
        {
            commandopts[interaction.member!.user.id]['changeactivity'] = [options.getString('subject', true)];
            const typerow = new DiscordJS.MessageActionRow().addComponents(
                new DiscordJS.MessageSelectMenu()
                .setCustomId('actntype')
                .setPlaceholder('Выберите тип активности')
                .addOptions([
                    {
                        label: 'Играть',
                        description: 'Пример: Играет в Тарков',
                        value: 'PLAYING',
                    },
                    {
                        label: 'Смотреть',
                        description: 'Пример: Смотрит Тарков',
                        value: 'WATCHING',
                    },
                    {
                        label: 'Стримить',
                        description: 'Пример: Стримит Тарков',
                        value: 'STREAMING',
                    },
                    {
                        label: 'Слушать',
                        description: 'Пример: Слушает Тарков',
                        value: 'LISTENING',
                    },
                    {
                        label: 'Соревноваться',
                        description: 'Пример: Соревнуется в Тарков',
                        value: 'COMPETING',
                    }
                ])
            )
            if (!interaction.deferred){
                // interaction.reply('wtf');
                return;
            }
            await interaction.editReply(
                {
                    content: 'Теперь определи как будет выглядеть активность',
                    components: [typerow],
                }
            )
            return;

        }
    } else if (interaction.isSelectMenu())
    {
        if (interaction.customId === 'actntype')
        {
            let typee = Constants.ActivityTypes.PLAYING;
            switch(interaction.values[0])
            {
                case 'COMPETING':
                    typee = Constants.ActivityTypes.COMPETING;
                    break;
                case 'PLAYING':
                    typee = Constants.ActivityTypes.PLAYING;
                    break;
                case 'LISTENING':
                    typee = Constants.ActivityTypes.LISTENING;
                    break;
                case 'WATCHING':
                    typee = Constants.ActivityTypes.WATCHING;
                    break;
                case 'STREAMING':
                    typee = Constants.ActivityTypes.STREAMING;
                    break;
            }
            if (typeof commandopts[interaction.member!.user.id]['changeactivity'][0] !== 'string')
            {
                interaction.update('Error');
                return;
            }
            client.user?.setActivity({
                name: commandopts[interaction.member!.user.id]['changeactivity'][0],
                type: typee,
            });
            delete commandopts[interaction.member!.user.id]['changeactivity'];
            await interaction.update({
                content: 'Статус успешно обновлён!',
                components: []
            });
        }
    }
})

// client.user?.setActivity({
//     name: options.getString('subject', true),
//     type: 'PLAYING',
// });

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
    if (message.channel.id == '720471221589770240')
    {
        message.react('👍');
        message.react('👎');
        return;
    }
    if (['700613209828360223', '714887829318139965', '703700712931983372'].indexOf(message.channel.id) > -1)
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
                return;
            }
            message.reply(`Мой дефолтный префикс: \`${defaultprefix}\``);
            return;
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
                message.reply(`Префикс \`${args[2]}\` истреблён, остались ${getPrefixes(message?.guild?.id!)}`);
                return;
            }
            message.reply(`Префикс \`${args[2]}\` истреблён, все префиксы ушли в ислам`);
            return;
        }
        if (args[1] == 'set')
        {
            prefixes[message?.guild?.id!].push(args[2]);
            message.reply(`Теперь на районе ко мне обращаться через:   \`${args[2]}\``);
            return;
        }
        
        if (!prefixes[message?.guild?.id!].length)
        {
            message.reply('Префиксов нема');
            return;
        }
        message.reply(`Мои префиксы:   ${getPrefixes(message?.guild?.id!)}`);
        return;
    }
})

let voiceConfig = {
    inkin: false,
    killain: false,
    inkid: '702721820499116054',
    killaid: '398132164182671361!',
    // was just testing out on my accounts
    // inkid: '534032368634167311',
    // killaid: '716276860660613150',

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

client.on('voiceStateUpdate', async (newVoiceState) => {
    if (newVoiceState.id != voiceConfig.inkid && newVoiceState.id != voiceConfig.killaid)
        return;
    let actor : DiscordJS.User = client.users.cache.get(newVoiceState.id)!;
    // console.log(newVoiceState);
    // console.log(`${imperator?.username} and ${actor?.username}`);
    if (actor.id == voiceConfig.inkid)
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
    } else if (actor.id == voiceConfig.killaid)
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