# chatGtp

1. 请求api
    method: POST
    url:    http://localhost:3000/message
    body:   {
                prompt:"你的问题"，
                apiKey:"你的key"
            }
    Response:   {
    "code": 200,
    "message": {
        "id": "",
        "object": "",
        "created": ,
        "model": "",
        "choices": [
            {
                "text": "",
                "index": 0,
                "logprobs": null,
                "finish_reason": "stop"
            }
        ],
        "usage": {
            "prompt_tokens": 19,
            "completion_tokens": 99,
            "total_tokens": 118
        }
    }
}
2. 示例
``` shell
curl --location --request POST 'http://localhost:3000/message' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'prompt=你的问题' \
--data-urlencode 'apiKey=你的key'
```
```javascript
var axios = require('axios');
var qs = require('qs');
var data = qs.stringify({
  'prompt': '你的问题',
  'apiKey': '你的key' 
});
var config = {
  method: 'post',
  url: 'http://localhost:3000/message',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
```