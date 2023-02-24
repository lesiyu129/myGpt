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
            <ToUserName><![CDATA[${FromUserName}]]></ToUserName>
            <FromUserName><![CDATA[${ToUserName}]]></FromUserName>
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
        const { xml } = ctx.req.body;
        const { ToUserName, FromUserName, CreateTime, MsgType, Content, MsgId } = xml;
        if (MsgType == 'text') {
            const responseMSg = await this.message(Content[0], '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');
            let str = ''
            responseMSg.choices.forEach(element => {
                str += element.text;
            })
            ctx.body = this.sendMsg(xml, str);
        } else {
            ctx.body = this.sendMsg(xml, '机器人正在检修中');
        }
    }
}

module.exports = new gpt();