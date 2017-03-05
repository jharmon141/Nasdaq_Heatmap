const express = require("express");
const app = express();
const PORT = 3000;
const exphbs = require("express-handlebars");
const stocks = require('yahoo-nasdaq');

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static(__dirname + '/public'));

stocks.getnasdaq100()
    .then((json) => {
        let stock = [];

        let toponehundred = json.sort(function(a,b) {
            return parseFloat(b.lastsale) - parseFloat(a.lastsale);
        });

        for (let i=0; i<toponehundred.length; i++) {
            if (i < 100) {
                if (toponehundred[i].pctchange > 0) {
                    toponehundred[i].pctchange = "+" + toponehundred[i].pctchange.toString();
                }
                stock.push(toponehundred[i]);
            }
        }

        // console.log(stock);
        app.get("/", function(req, res) {
            return res.render("index",{
                stock: stock 
            });
        })
    })
    .catch((err) => console.error(err));

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
