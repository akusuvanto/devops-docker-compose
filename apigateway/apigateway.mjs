import http from 'http';

http.createServer(function (req, res) {
    res.write('API Gateway, Hello!');
    res.end();
}).listen(process.env.PORT);