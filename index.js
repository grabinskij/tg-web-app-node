const TelegramBot = require('node-telegram-bot-api');
const webAppUrl = 'https://superlative-sorbet-f86e37.netlify.app';
const express = require('express');
const cors = require('cors');



const token = TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start'){
        await bot.sendMessage(chatId, "The button is on the bottom. Please fill the form", {
            reply_markup: {
                keyboard: [
                    [{text: 'Fill the form', web_app: {url: webAppUrl + "/form"}}]
                ]
            }
        });
        await bot.sendMessage(chatId, "The button is on the bottom. Make an order", {
            inline_markup: {
                inline_keyboard: [
                    [{text: 'Make an order', web_app: {url: webAppUrl}}]
                ]
            }
        });
    }

    if(msg?.web_app_data?.data){
        try {
            const data = JSON.parse(msg?.web_app_data?.data)

            await bot.sendMessage(chatId,'Thank you for callback!');
            await bot.sendMessage(chatId,'You country:' + data?.country);
            await bot.sendMessage(chatId,'You street' + data?.street);

            setTimeout( async () => {
                await bot.sendMessage(chatId,'All information you receive in this chat');
            }, 3000)

        } catch (e) {
            console.log(e)
        }
    }

});
app.post('/web-data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Successful shopping',
            input_message_content: {message_text: 'Granulation. Your bought things spending' + totalPrice},
        })
        return res.status(200).json({});
    } catch (e){
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Unsuccessful shopping',
            input_message_content: {message_text: 'Unsuccessful shopping'},
        })
    }
    return res.status(500).json({});
})

const PORT = 8000;

app.listen(PORT, () => console.log('Server started on PORT ' + PORT))