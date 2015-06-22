var request = require('request');

request.post(
    'http://192.168.0.75:9000/api/messages/',
    { form: { udid: 'Naem' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);
