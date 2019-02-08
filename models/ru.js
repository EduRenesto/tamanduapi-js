const request = require('request');
const cheerio = require('cheerio');
const redis = require('redis').createClient();

const URL_MENU = "http://proap.ufabc.edu.br/nutricao-e-restaurantes-universitarios/cardapio-semanal";
const DAY_IDX_TO_KEY = ["mon", "tue", "wed", "thu", "fri", "sat"];
const DISH_IDX_TO_KEY = ["lunch", "diner", "veggie", "garrison", "salad", "dessert"];

// TODO refatorar isso aqui
// eu simplesmente copiei do meu antigo ufabcli
// e coloquei o Redis
// tem MUITA coisa pra melhorar aqui!

module.exports = {
    thisWeek: () => {
        return new Promise((resolve) => {
            redis.get('ru', (err, reply) => {
                if(!reply) {
                    let menu = {};
                    request(URL_MENU, (err, res, body) => {
                        if(err) {
                            // TODO
                        } else {
                            const $ = cheerio.load(body);
                            const test = $(".cardapio-semanal > table")[0].children[0].next.children.filter((x) => x.name == "tr");

                            menu["sun"] = {};
                            DISH_IDX_TO_KEY.forEach((x) => menu["sun"][x] = "-");
                            for(let i = 1; i < test.length; i += 2) {
                                let dx = DAY_IDX_TO_KEY[(i + 1)/2 - 1];
                                menu[dx] = {};

                                const table = test[i].children[1].children[0].next.children;

                                for(let j = 1; j < table.length; j += 2) {
                                    let mx = DISH_IDX_TO_KEY[(j + 1)/2 - 1];
                                    menu[dx][mx] = table[j].children[1].data.replace(': ', '');
                                }
                            }
                            redis.set('ru', JSON.stringify(menu), 'EX', 3600);
                            resolve(menu);
                        }
                    });
                } else {
                    resolve(JSON.parse(reply));
                }
            })
        })
    }
}
