// const bot = new Telegraf('5985563709:AAFqsAnRodXlOki_poTNAJym8d0tmevrX6c');
// const apiKey = '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'
const {Telegraf} = require('telegraf');
const {OpenAIApi, Configuration} = require('openai');

const apiKey = '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'; // Ваш ключ API OpenAI

const bot = new Telegraf('5985563709:AAFqsAnRodXlOki_poTNAJym8d0tmevrX6c'); // Ваш токен бота

const configuration = new Configuration({
    apiKey: apiKey,
});


const openaiInstance = new OpenAIApi(configuration);

bot.start((ctx) => ctx.reply('Привіт! Я бот для перевірки та виправлення граматичних помилок. Просто надішліть мені текст, і я перевірю та виправлю помилки.'));

bot.on('text', async (ctx) => {
  const text = ctx.message.text;

  try {
    const prompt = `In English, correct the grammar errors in the following text:\n${text}`;

    const response = await openaiInstance.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.3,
      n: 1,
      stop: '\n',
    });

    const correctedText = response.choices[0].text.trim();

    ctx.reply(`Знайдено помилки. Ось виправлений текст:\n\n${correctedText}`);
  } catch (error) {
    console.error('Error occurred during grammar correction:', JSON.stringify(error.message));
    ctx.reply('Виникла помилка при виправленні граматики. Будь ласка, спробуйте ще раз.');
  }
});

bot.launch();
