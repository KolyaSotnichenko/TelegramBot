// const bot = new Telegraf('5985563709:AAFqsAnRodXlOki_poTNAJym8d0tmevrX6c');
const { Telegraf } = require('telegraf');
const axios = require('axios');
const { GrammarBot } = require('grammarbot');

const bot = new Telegraf('5985563709:AAFqsAnRodXlOki_poTNAJym8d0tmevrX6c');

bot.start((ctx) => ctx.reply('Привіт! Я бот для перевірки та виправлення граматичних помилок англійського тексту. Просто надішліть мені текст, і я перевірю та надам пропозиції щодо виправлень.'));

bot.on('text', async (ctx) => {
  const text = ctx.message.text;

  const grammarErrors = await checkGrammar(text);

  let errorMessages = '';

  if (grammarErrors.length > 0) {
    const spellError = grammarErrors.map((error) => error.message)
    const correctedText = correctTextWithErrors(text, grammarErrors);
    const grammarSuggestions = grammarErrors.map((error) => `${error.message}`);
    errorMessages += `Знайдено граматичні помилки:\n\n${grammarSuggestions.join('\n')}\n\n`;
    if(spellError[0] !== 'Possible spelling mistake found.'){
        errorMessages += `Ось виправлений текст:\n\n${correctedText}👌\n`;
    }
  } else {
    errorMessages += 'Помилок у граматиці не знайдено. Ваш текст вірний!';
  }

  ctx.reply(errorMessages);
});

async function checkGrammar(text) {
    try {
      const grammarBot = new GrammarBot({
        language: 'en-US', // Встановити потрібну мову для перевірки граматики
        apiKey: '5ff1eb0498msh0f7ecb615d431ddp1659fejsn02fbf22f2fe5' // Додати свій ключ API GrammarBot
      });
  
      const { matches } = await grammarBot.check(text);
  
      return matches || [];
    } catch (error) {
      console.error('Error occurred during grammar check:', error);
      return [];
    }
  }

function correctTextWithErrors(text, grammarErrors) {
    let correctedText = text;
  
    for (let i = grammarErrors.length - 1; i >= 0; i--) {
      const { offset, length, replacements } = grammarErrors[i];
      const replacement = replacements[0]?.value || '';
  
      correctedText = correctedText.slice(0, offset) + replacement + correctedText.slice(offset + length);
    }
  
    return correctedText;
}

bot.launch();