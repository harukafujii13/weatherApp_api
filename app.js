const express = require("express"); //requireするためにexpressというconstを作成。新規のexpressアプリを初期化するためにappというconstを作成。
const https = require("https");
const bodyParser = require("body-parser"); //cityNameという名前に基づいたデータを取得するためのパッケージ 'npm i body-parser'
                                          //bodyPasserとはHTML(ejs)のformのinputに入力された値を受け取れるようにするもの

const app = express();

app.use(bodyParser.urlencoded({extended: true})); //リクエストの本文の解析を開始できるようにするために必要なコード


app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req, res){　//action="/"を受け取った時に発火
  const query = req.body.cityName;
  const apiKey = "5f2d79e990d3a4b784ba2bef98e959b0";
  const unit = "metric"
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query +"&appid=" + apiKey + "&units=" + unit;
  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){　//onメゾットを呼び出し、onメゾット内で特定の瞬間、何らかのデータを受け取った時にそれを利用することができる
                                        //受け取ったデータを格納するcallback functionを作成し、ログに記録する
      const weatherData = JSON.parse(data)       //parse日付やJSONなどのデータを文字列に変換する
      const temp = weatherData.main.temp
      const weatherDescription = weatherData.weather[0].description
      const icon = weatherData.weather[0].icon
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<p>The weather is currently " + weatherDescription + "<p>");
      res.write("<h1>The temperature in "+ query +" is " + temp + "degree Celcius.</h1>");
      res.write("<img src=" + imageURL +">")
      res.send();
    })
  })
})



app.listen(3000, function(){
  console.log("Server is running on port 3000.")
})