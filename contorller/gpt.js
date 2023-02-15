const { Configuration, OpenAIApi } = require("openai");
const { code } = require("../config/code");
const MyError = require("../unit/myError");
class gpt {
    async request(ctx) {
        const body = ctx.request.body;
        const prompt = body.prompt;
        const apiKey = body.apiKey;
        if (!apiKey) {
            throw new MyError({ code: code.notKey, message: 'apiKey不能为空' });
        }
        const configuration = new Configuration({
            apiKey: apiKey || "apiKey"
        });
        const openai = new OpenAIApi(configuration);
        try {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                temperature: 0,
                max_tokens: 100,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            });
            ctx.body = { code: code.ok, message: response.data };
        } catch (error) {
            ctx.body = { code: code.err, message: error };
        }

    }
}

module.exports = new gpt();