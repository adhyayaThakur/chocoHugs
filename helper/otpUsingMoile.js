let springedge = require('springedge');

const otpSend = () => {
    let params = {
        'apikey': '', // API Key 
        'sender': 'SEDEMO', // Sender Name 
        'to': [
            '919019xxxxxxxx' //Moblie Number 
        ],
        'message': 'test+message'
    };

    springedge.messages.send(params, 5000, function(err, response) {
        if (err) {
            return console.log(err);
        }
        console.log(response);
    });
}

let params = {
    'apikey': '', // API Key 
    'sender': 'SEDEMO', // Sender Name 
    'to': [
        '919019xxxxxxxx' //Moblie Number 
    ],
    'message': 'test+message'
};

springedge.messages.send(params, 5000, function(err, response) {
    if (err) {
        return console.log(err);
    }
    console.log(response);
});