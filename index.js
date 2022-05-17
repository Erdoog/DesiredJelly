import * as DiscordJS from 'discord.js';
import * as dotenv from 'dotenv';
import { Intents } from "discord.js";
dotenv.config();

const client = new DiscordJS.Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

client.on('ready', () => {
    console.log("Logged!");
});

client.on('messageCreate', (message) => {
    console.log(message.author);
})

let inkin = false;
let kilkin = false;
// let inkid = '702721820499116054';
// let killaid = '398132164182671361';
let inkid = '534032368634167311';
let killaid = '716276860660613150';
let killamsgid;
let inkmsgid;

client.on('voiceStateUpdate', (oldVoiceState, newVoiceState) => {
    // if (voiceUpdateObj.id != '702721820499116054' && voiceUpdateObj.id != '398132164182671361')
    //     return;
    if (!newVoiceState)
        return;
    let imperator = client.users.cache.get('534032368634167311');
    let actor = client.users.cache.get(oldVoiceState.id);
    console.log(newVoiceState);
    console.log(oldVoiceState);
    console.log(`${imperator?.username} and ${actor?.username}`)
    if (!actor)
        console.log('U fucked up');
    if (newVoiceState.id == inkid)
    {
        if (inkin)
        {
            inkin = false;
            
        }
        else
        {
            inkin = true;
            imperator.send("Inkie is waiting!");
        }
    } else if (newVoiceState.id == killaid)
    {
        if (kilkin)
            kilkin = false;
        else
        {
            kilkin = true;
            imperator.send("Time to tear ur stomach down, killa came in");
        }
    }
});

client.login(process.env.TOKEN);