const xml = require('./xmlTool')

exports.message = {

    text(msg, content) {

        return xml.jsonToXml({

            xml: {

                ToUserName: `<![CDATA[${msg.FromUserName}]]>` ,

                FromUserName: `<![CDATA[${msg.ToUserName}]]>`,

                CreateTime: Date.now(),

                MsgType: `<![CDATA[text]]>`,

                Content: `<Content><![CDATA[${content}]]></Content>`

            }

        });

    }

};