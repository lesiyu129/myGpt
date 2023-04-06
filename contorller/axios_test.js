const axios = require('axios');

// Set the API endpoint and access token
const apiEndpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';
const accessToken = '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';

// Set the prompt text and parameters
const promptText = 'Hello, how are you today?';
const params = {
    prompt: promptText,
    temperature: 0.7,
    max_tokens: 60,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0.0
};

// Send the API request
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
};
axios.post(apiEndpoint, params, { headers })
    .then(response => {
        const responseText = response.data.choices[0].text;
        console.log(`ChatGPT response: ${responseText}`);
    })
    .catch(error => console.error(error));