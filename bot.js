const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('7645828128:AAE2_AIeGQTgNYcvGnn2GVA-gbheXDcbDl8');

bot.start((ctx) => {
    return ctx.replay(
        'Добро пожаловать! Нажми на кпоку ниже, чтобы найти ближайшим пункт переработки и полезную информацию.',
        Markup.keyboard([
            Markup.button.webApp('Открыть приложение', 'https://t.me/ecopointsspb_bot')
        ]).resize()
    );
});

bot.launch();
console.log('Бот запущен');