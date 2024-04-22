const http = require("http");
const cat_datas = require("./cat.json");
const dog_datas = require("./dog.json");
const horse_datas = require("./horse.json");
const snail_datas = require("./snail.json");
const all_datas = cat_datas.concat(dog_datas, horse_datas, snail_datas);

const port = 8080;

function get_random_facts(number, animal_type){
    let datas;
    switch (animal_type){
        case "cat":
            datas = cat_datas;
            break;
        case "dog":
            datas = dog_datas;
            break;
        case "horse":
            datas = horse_datas;
            break;
        case "snail":
            datas = snail_datas;
            break;
    }
    let facts = [];
    for (let i=0;i<number;i++){
        const id = Math.floor(Math.random()*datas.length);
        facts.push(datas[id]);
    }
    if (facts.length===1)return facts[0];
    return facts;
}

function get_animal_type(url){
    const reg = /[\?\&]animal_type=([a-zA-Z]*)($|\&)/;
    if (!reg.test(url))return false;
    return url.match(reg)[1];
}
function get_amount(url){
    const reg = /[\?\&]amount=([a-zA-Z0-9]*)($|\&)/;
    if (!reg.test(url))return false;
    return url.match(reg)[1];
}

function return_http_error(error_code, res, status_message=null){
	if (status_message)res.writeHead(error_code, status_message);
	else res.writeHead(error_code);
	res.end();
}
function return_http_result(res, code, headers, data){
	res.writeHead(code, headers);
	res.write(data);
	res.end();
}

const server = http.createServer(function (req, res){
	const url = req.url;
	const parameters = url.replace(/\?.*/gm, "");
    console.log(url);
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000,
        'Content-Type': 'application/json'
    };


	switch (parameters){
		case "/facts":
            const facts_data = `[{"status":{"verified":true,"sentCount":1},"_id":"58e00b5f0aac31001185ed24","user":"58e007480aac31001185ecef","text":"When asked if her husband had any hobbies, Mary Todd Lincoln is said to have replied \"cats.\"","__v":0,"source":"user","updatedAt":"2020-08-23T20:20:01.611Z","type":"cat","createdAt":"2018-02-19T21:20:03.434Z","deleted":false,"used":false},{"status":{"verified":true,"feedback":"","sentCount":1},"_id":"5887e1d85c873e0011036889","user":"5a9ac18c7478810ea6c06381","text":"Cats make about 100 different sounds. Dogs make only about 10.","__v":0,"source":"user","updatedAt":"2020-09-03T16:39:39.578Z","type":"cat","createdAt":"2018-01-15T21:20:00.003Z","deleted":false,"used":true},{"status":{"verified":true,"sentCount":1},"_id":"58e008780aac31001185ed05","user":"58e007480aac31001185ecef","text":"Owning a cat can reduce the risk of stroke and heart attack by a third.","__v":0,"source":"user","updatedAt":"2020-08-23T20:20:01.611Z","type":"cat","createdAt":"2018-03-29T20:20:03.844Z","deleted":false,"used":false},{"status":{"verified":true,"sentCount":1},"_id":"58e009390aac31001185ed10","user":"58e007480aac31001185ecef","text":"Most cats are lactose intolerant, and milk can cause painful stomach cramps and diarrhea. It's best to forego the milk and just give your cat the standard: clean, cool drinking water.","__v":0,"source":"user","updatedAt":"2020-08-23T20:20:01.611Z","type":"cat","createdAt":"2018-03-04T21:20:02.979Z","deleted":false,"used":false},{"status":{"verified":true,"sentCount":1},"_id":"58e00af60aac31001185ed1d","user":"58e007480aac31001185ecef","text":"It was illegal to slay cats in ancient Egypt, in large part because they provided the great service of controlling the rat population.","__v":0,"source":"user","updatedAt":"2020-09-16T20:20:04.164Z","type":"cat","createdAt":"2018-01-15T21:20:02.945Z","deleted":false,"used":true}]`
            return return_http_result(res, 200, headers, facts_data);
		case "/facts/random":
            const animal_type = get_animal_type(url);
            const amount = get_amount(url);

            if (!animal_type)return return_http_error(404, res, "the parameter animal_type is missing");
            if (!amount)return return_http_error(404, res, "the parameter amount is missing");
            if (!/^[0-9]+$/.test(amount) || Number(amount)>500 || Number(amount)<1)return return_http_error(404, res, "incorrect value for amount");
            if (!["cat", "dog", "horse", "snail"].includes(animal_type))return return_http_error(404, res, "incorrect value for animal_type");

            const json_datas = get_random_facts(amount, animal_type);
            return return_http_result(res, 200, headers, JSON.stringify(json_datas));
        //by id
        default:
            if (!/facts\/[a-zA-Z0-9]+$/.test(parameters)){
                return return_http_error(404, res, "invalid url");
            }
            const id = parameters.substring(7);
            const fact = all_datas.filter((el)=>el["_id"]===id);
            if (fact.length===0)return return_http_error("404", res, "fact not found");
            return return_http_result(res, 200, headers, JSON.stringify(fact[0]));
    }
});

server.listen(port, function(error){
	if (error) {
		console.log(error);
	}else {
		console.log("server is listening on port: " + port);
	}
})