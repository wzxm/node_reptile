// 这句的意思就是引入 `express` 模块，并将它赋予 `express` 这个变量等待使用。
let express = require('express');
// let utility = require('utility');
let superagent = require('superagent');
let cheerio = require('cheerio');
let fs = require('fs');
let varpath = require('path');
// 调用 express 实例，它是一个函数，不带参数调用时，会返回一个 express 实例，将这个变量赋予 app 变量。
let app = express();

// app 本身有很多方法，其中包括最常用的 get、post、put/patch、delete，在这里我们调用其中的 get 方法，为我们的 `/` 路径指定一个 handler 函数。
// 这个 handler 函数会接收 req 和 res 两个对象，他们分别是请求的 request 和 response。
// request 中包含了浏览器传来的各种信息，比如 query 啊，body 啊，headers 啊之类的，都可以通过 req 对象访问到。
// res 对象，我们一般不从里面取信息，而是通过它来定制我们向浏览器输出的信息，比如 header 信息，比如想要向浏览器输出的内容。这里我们调用了它的 #send 方法，向浏览器输出一个字符串。
app.get('/', function(req, res, next) {
    // 用 superagent 去抓取 https://cnodejs.org/ 的内容
    superagent.get('https://cnodejs.org/?tab=all&page=1')
        .end(function(err, sres) {
            // 常规的错误处理
            if (err) {
                return next(err);
            }
            // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
            // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
            // 剩下就都是 jquery 的内容了
            let $ = cheerio.load(sres.text);
            let items = [];
            $('#topic_list img').each(function(idx, element) {
                let $element = $(element);
                let $url = $element.attr('src');
                items.push({
                    img: $url
                });
            });
            res.send(items);
        });
});

// 定义好我们 app 的行为之后，让它监听本地的 3000 端口。这里的第二个函数是个回调函数，会在 listen 动作成功后执行，我们这里执行了一个命令行输出操作，告诉我们监听动作已完成。
app.listen(3000, function(req, res) {
    console.log('app is listening at port 3000');
});
