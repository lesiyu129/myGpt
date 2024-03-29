const { Configuration, OpenAIApi } = require("openai");
const { code } = require("../config/code");
const MyError = require("../unit/myError");
const crypto = require("crypto");
const sha1 = require("sha1");

class gpt {
    constructor() {
        this.sendMsg = (xml, msg) => {
            const { ToUserName, FromUserName } = xml;
            return `
          <xml>
            <ToUserName><![CDATA[${FromUserName[0]}]]></ToUserName>
            <FromUserName><![CDATA[${ToUserName[0]}]]></FromUserName>
            <CreateTime>${new Date().getTime()}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${msg}]]></Content>
          </xml>
         `;
        };
        this.message = async (prompt, apiKey) => {
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
                return response.data;

            } catch (error) {
                return error;
            }
        };
    }
    async request(ctx) {
        const body = ctx.request.body;
        const prompt = body.prompt;
        const apiKey = body.apiKey;
        const promptStr = `${prompt}`;
        if (!apiKey) {
            throw new MyError({ code: code.notKey, message: 'apiKey不能为空' });
        }
        const configuration = new Configuration({
            apiKey: apiKey
        });
        const openai = new OpenAIApi(configuration);
        try {
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "user", "content": promptStr }],
                temperature: 0.5,
                // stop: "\n"
            });
            console.log(completion.data.choices[0].message);
            ctx.body = { code: code.ok, message: response.data };
        } catch (error) {
            ctx.body = { code: code.err, message: error };
        }

    }
    async wechat(ctx) {
        const query = ctx.query;
        const { signature, timestamp, nonce, echostr } = query;
        const token = 'incar2023chatgpt';
        const soltStr = [nonce, timestamp, token].sort().join('');
        const sha1Str = sha1(soltStr);
        if (sha1Str === signature) {
            ctx.body = echostr;
        } else {
            console.log('error');
        }
    }
    async sendMessage(ctx) {
        let msg, MsgType, result, str;
        msg = ctx.req.body ? ctx.req.body.xml : '';
        if (!msg) {
            ctx.body = 'error request.';
            return;
        }
        MsgType = msg.MsgType[0];
        switch (MsgType) {
            case 'text':
                str = '';
                const responseMSg = await this.message(msg.Content[0], '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');
                if (responseMSg.isAxiosError) {
                    console.error("responseMsg返回结果", `发生错误:${responseMSg}`);
                    result = this.sendMsg(msg, '机器人陷入了沉思');
                } else {
                    const choices = responseMSg.choices;
                    for (const iterator of choices) {
                        str += iterator.text;
                    }
                    console.info("responseMsg返回结果", `成功了:${str}`);
                    result = this.sendMsg(msg, str);
                }
                break;

            default:
                result = 'success';

        }
        ctx.body = result;
    }
}

module.exports = new gpt();