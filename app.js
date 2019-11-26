const express = require("express");
const app = express();
const fs = require('fs');
const axios = require("axios");
const cheerio = require("cheerio");
var bodyParser = require('body-parser');
app.use("/public", express.static("./public/"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.set("view engine", "pug");



const link1 = `https://scholar.google.com/scholar_case?case=10702270479218690562&q=david+thompson+v.+heather+hebdon&hl=en&as_sdt=6,28`;
const link2 = `https://scholar.google.com/scholar_case?case=9394297197388356157&q=KARINGITHI&hl=en&as_sdt=6,28`;
const link3 = `https://scholar.google.com/scholar_case?case=17520573883474493310&q=Little+Sisters+of+the+Poor+Saints+Peter++v.+Pennsylvania&hl=en&as_sdt=6,28`;

app.get("/", function (req, res) {
    //res.set('Content-Type', 'text/html')
    res.render("index");
});

app.post("/data", function (req, res) {
    // console.log(req.body.make_book);
    // console.log(req.body.make_book.filename);

    let re = /(https:\/{2}scholar\.google\.com\/scholar_case\?case=)(.+){1,200}/

    let filename = req.body.make_book.filename;

    if(filename.match(re)){
        // ONLINE CAPTURE
        let url = filename;
        let headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0",
            "Content-Type": "application/x-www-form-urlencoded"
        };

        axios
            .post(url, headers)
            .then(function (response) {
                //console.log(response.data);
                const $ = cheerio.load(response.data, {
                    decodeEntities: true
                });
                let inner_div = $("#gs_opinion").html();
                res.render("data", {
                    inner_html: inner_div
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }else{
        // WORKING READ FILE EXAMPLE
        fs.readFile(filename, 'utf8',
            function (err, contents) {
                const $ = cheerio.load(contents, {
                    decodeEntities: true
                });
                $('a').contents().unwrap();
                var inner_div = $("#gs_opinion").html();

                


                res.render('data', {
                    inner_html: inner_div
                });
            });        
    }
    

});




const listener = app.listen(64386, function () {
    console.log("Your app is listening on port " + listener.address().port);
});