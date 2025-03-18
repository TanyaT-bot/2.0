const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('7645828128:AAE2_AIeGQTgNYcvGnn2GVA-gbheXDcbDl8');

// Обработка команды /start
bot.start((ctx) => {
    return ctx.reply(
        'Добро пожаловать! Нажми на кнопку ниже, чтобы открыть приложение.',
        Markup.keyboard([
            Markup.button.webApp('Открыть приложение', 'https://tanyat-bot.github.io/2.0/') // Убедитесь, что это правильный URL вашего WebApp
        ]).resize()
    );
});

// Обработка команды для открытия WebApp
bot.command('open', (ctx) => {
    return ctx.reply(
        'Открыть WebApp',
        Markup.keyboard([
            Markup.button.webApp('Открыть приложение', 'https://tanyat-bot.github.io/2.0/')
        ]).resize()
    );
});

// Запуск бота
bot.launch();
console.log('Бот запущен');