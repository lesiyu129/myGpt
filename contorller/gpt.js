const { Configuration, OpenAIApi } = require("openai");
const { code } = require("../config/code");
const MyError = require("../unit/myError");
const crypto = require("crypto")
const sha1 = require("sha1");
class gpt {
    async request(ctx) {
        const body = ctx.request.body;
        const prompt = body.prompt;
        const apiKey = body.apiKey;
        const promptStr = `\n${prompt}`;
        if (!apiKey) {
            throw new MyError({ code: code.notKey, message: 'apiKey不能为空' });
        }
        const configuration = new Configuration({
            apiKey: apiKey || "apiKey"
        });
        const openai = new OpenAIApi(configuration);
        try {
            const response = await openai.createCompletion({
                best_of: 1,
                model: "text-davinci-003",
                prompt: promptStr,
                temperature: 0.5,
                max_tokens: 2038,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                // stop: "\n"
            });
            ctx.body = { code: code.ok, message: response.data };
        } catch (error) {
            ctx.body = { code: code.err, message: error };
        }

    }
    async wachan(ctx){
        const query = ctx.request.query;
        const {signature,timestamp,nonce,echostr} = query
        const soltStr = [timestamp,nonce,echostr].solt().join('')
        const sha1Str = sha1(soltStr)
        if (sha1Str === signature) {
            res.send(echostr)
          } else {
            console.log('error')
        }
    }
}

module.exports = new gpt();