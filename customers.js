

module.exports = function (app, CustomersModel, OrdersModel, EmployersModel, EmployersDatesForStatisticModel, nev, TelegramBot, PromoCodeModel) {
    // replace the value below with the Telegram token you receive from @BotFather
    
    var tokenTelegram = '315189207:AAE5EHJwvkIskY5iBB65G6XIKB1LdQe-kzg';

    // Create a bot that uses 'polling' to fetch new updates
    var bot = new TelegramBot(tokenTelegram, {polling: true});

    // Matches "/echo [whatever]"
    var chatId = "-298713268";
    bot.onText(/\/(.+)/, (msg, match) => {
      var resp = match[1]; // the captured "whatever"


      if(resp.indexOf("help") != -1){
        bot.sendMessage(chatId, "/revOrd - показать задания, которые требуют проверки \n/runOrd - показать работающие задания \n/modOrd order_id state - промодерировать заказ, state - это 1/-1 ");
      }

      if(resp.indexOf("revOrd") != -1){
        OrdersModel.find()
            .select("bundle name owner_email count_money_r")
            .where('moderated').equals(0)
            .exec(function(err, orders) {
                if (err) {
                    //return handleError(err);
                }
                if (orders) {
                    //console.log("orders = " + orders);
                    bot.sendMessage(chatId, "Задания требующие проверки: \n" + orders );
                }
            });
          }
      if(resp.indexOf("runOrd") != -1){
        OrdersModel.find()
                    .select("bundle name owner_email count_money_r")
                    .where('moderated').equals(1) // должна быть 1 (0 это не отмодерированные заказы)
                    .where('type_os').equals("android")
                    .where('state').equals(1)
                    .where('count_money_r').gt(3)
                    .exec(function(err, orders) {
                        console.log("orders = " + orders);
                       bot.sendMessage(chatId, "Задания которые в данный момент выполняются: \n" + orders );
                    });
      }
      if(resp.indexOf("modOrd") != -1){
        var arrayResp = resp.split(" ");
            if(arrayResp.length == 3){
                OrdersModel.findOne({
                '_id': arrayResp[1]
                }).exec(function(err, order) {
                    if (order) {
                        CustomersModel.findOne({
                            'email': order.owner_email
                        }, function(err, user) {
                            if (user) {
                                if(user.count_money_r >= 0){
                                    OrdersModel.findOneAndUpdate({
                                        '_id': arrayResp[1]
                                    }, {
                                        "moderated": arrayResp[2],
                                        "state": 1,
                                        "date_run": new Date()
                                    }).exec(function(err, orders) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            bot.sendMessage(chatId, "Ок");
                                        }
                                    });
                                }else{
                                    bot.sendMessage(chatId, "Недостаточно денег на счете");
                                }
                            }
                        });
                    }else{
                        bot.sendMessage(chatId, "Нет юзера");
                    }
                });
        }else{
            bot.sendMessage(chatId, "Неверный формат");
        }
      }
    });

    app.post('/api/registerCustomer', function(req, res) {
        var validator = require("email-validator");
        if (!validator.validate(req.body.email)) {
            return res.send({
                status: 'Не верный формат email',
                response: -2
            });
        }
        
        CustomersModel.findOne({
            'email': req.body.email
        }, function(err, user) {
            if (err) {
                return handleError(err);
            }
            if (user) {
                return res.send({
                    status: 'Ошибка - такой почтовый ящик уже используется',
                    response: -1
                });
            } else {
                var sha1 = require('sha1');
                var token = sha1(req.body.email + "mountainHeads");
                var customer = new CustomersModel({
                    email: req.body.email,
                    pass_hash: req.body.pass_hash,
                    first_name: req.body.first_name,
                    phone: req.body.phone,
                    startPromoCode: req.body.promocode,
                    ip: req.connection.remoteAddress,
                    token: token
                });

                if(req.body.promo_id){
                    customer.promo_id = req.body.promo_id;
                }

                nev.createTempUser(customer, function(err, existingPersistentUser, newTempUser) {
                    // some sort of error
                    if (err){
                        // handle error...
                        console.log(err);
                    }

                    // user already exists in persistent collection...
                    if (existingPersistentUser){
                        // handle user's existence... violently.
                        //console.log("existingPersistentUser = " + existingPersistentUser);
                    }

                    // a new user
                    //console.log("newTempUser = " + newTempUser);
                    if (newTempUser) {
                        var URL = newTempUser[nev.options.URLFieldName];
                        nev.sendVerificationEmail(req.body.email, URL, function(err, info) {
                            if (err){
                                // handle error...
                                console.log("err = " + err);
                            }
                            //console.log("URL = " + URL);
                            //console.log("info = " + info);

                            // flash message of success
                        });
                        return res.send({
                            status: 'OK',
                            email: req.body.email,
                            token: token,
                            response: 1
                        });
                    } else {
                        return res.send({
                            status: 'Ошибка - такой почтовый ящик уже используется',
                            response: -1
                        });
                        // nev.resendVerificationEmail(req.body.email, function(err, userFound) {
                        //     if (err){
                        //         // handle error...
                        //         console.log("err = " + err);
                        //     }
                        //     console.log("userFound = " + userFound);
                        //     if (userFound){
                        //         // email has been sent
                        //     }else{
                        //         // flash message of failure...
                        //     }
                        // });
                    }
                });

                // customer.save(function(err) {
                //     if (err) {
                //         console.log(err);
                //     }
                // });
                
            }
        });
    });

    app.post('/api/forgotPassword', function(req, res) {
        CustomersModel.findOne({
            'email': req.body.email
        }, function(err, user) {
            if (err) {
                return handleError(err);
            }
            if (user) {
                var mailOptions, nodemailer, transporter;
                nodemailer = require('nodemailer');
                transporter = nodemailer.createTransport({
                  service: 'yandex',
                  auth: {
                     user: 'no-reply@upmob.ru',
                     pass: 'fkdfnfvuu2EH88em'
                  }
                });
                mailOptions = {
                    from: 'no-reply@upmob.ru',
                    to: req.body.email,
                    subject: 'Восстановление пароля.',
                    html: '<p>Чтобы поменять свой пароль пройдите по следующей ссылке.</p><p> https://upmob.ru/auth?hash=' + user.pass_hash + '</p><p>Если вы не запрашивали восстановление пароля, то проигнорируйте это письмо.</p>',
                    text: 'Чтобы поменять свой пароль пройдите по следующей ссылке - https://upmob.ru/auth?hash=' + user.pass_hash + ' Если вы не запрашивали восстановление пароля, то проигнорируйте это письмо.'
                };
                transporter.sendMail(mailOptions, function(err, info) {
                  if (err) {
                    return console.log(err);
                  }
                  return res.send({
                    status: 'Письмо успешно отправлено',
                    response: 1
                  });
                });
            } else {
                return res.send({
                    status: 'Ошибка - нет такого пользователя',
                    response: -1
                });
            }
        });
    });

    app.post('/api/setPassword', function(req, res) {
        CustomersModel.findOneAndUpdate({
                                'pass_hash': req.body.old_pass_hash
                                }, {
                                    "pass_hash": req.body.new_pass_hash
                                }).exec(function(err, orders) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        return res.send({
                                            status: 'OK',
                                            response: 1
                                        });
                                    }
        });
    });
    app.post('/api/sendContact1', function(req, res) {
        console.log("sendContact1 = " + req.body);
        var botTemp = new TelegramBot(tokenTelegram);
        botTemp.sendMessage(chatId, "Запрос на продвижение 'ТОП 5 В ПОИСКЕ' от " + req.body.contact);
    });

    app.post('/api/sendContact2', function(req, res) {
        var botTemp = new TelegramBot(tokenTelegram);
        botTemp.sendMessage(chatId, "Запрос на продвижение 'ТОП 10 В КАТЕГОРИИ' от " + req.body.contact);
    });

    app.post('/api/sendContact3', function(req, res) {
        var botTemp = new TelegramBot(tokenTelegram);
        botTemp.sendMessage(chatId, "Запрос на продвижение 'ТОП 5 В КАТЕГОРИИ' от " + req.body.contact);
    });

    app.post('/api/authCustomer', function(req, res) {
        CustomersModel.findOne({
            'email': req.body.email,
            'pass_hash': req.body.pass_hash
        }, function(err, user) {
            if (err) {
                return handleError(err);
            }
            if (user) {
                return res.send({
                    status: 'OK',
                    response: 1,
                    token: user.token,
                    email: user.email
                });
            } else {
                return res.send({
                    status: 'Ошибка - не верный логин или пароль',
                    response: -1
                });
            }
        });
    });

    app.post('/api/addNewOrder', function(req, res) {
        console.log("req.body.version_os = " + req.body.version_os);
        console.log("req.body.version_os = " + parseFloat(req.body.version_os));
        
        CustomersModel.findOne({
            'token': req.body.token
        }, function(err, customer) {
            if (err) {
                return handleError(err);
            }
            if (customer) {
                if (req.body.count_money_r < 0) {
                    return res.send({
                        status: 'Ошибка - недопустимое значение бюджета',
                        response: -3
                    });
                }

                // if (customer.count_money_r < req.body.count_money_r) {
                //     return res.send({
                //         status: 'Ошибка - недостаточно средств',
                //         response: -2
                //     });
                // }
                var order = new OrdersModel({
                    count_money_r: req.body.count_money_r,
                    review_words: req.body.review_words,
                    review_wish: req.body.review_wish,
                    with_review: req.body.with_review,
                    good_review_top: req.body.good_review_top,
                    price_one_install: req.body.price_one_install,
                    price_app_in_store: req.body.price_app_in_store,
                    open_3_day: req.body.open_3_day,
                    max_count_installs: req.body.max_count_installs,
                    search_request: req.body.search_request,
                    limit_day: req.body.limit_day,
                    limit_hour: req.body.limit_hour,
                    limit_minute: req.body.limit_minute,
                    bundle: req.body.bundle,
                    name: req.body.name,
                    icon: req.body.icon,
                    category: req.body.category,
                    type_os: req.body.type_os,
                    version_os: parseFloat(req.body.version_os),
                    search_position: req.body.search_position,
                    owner_email: customer.email,
                    cutomer: customer._id
                });

                order.save(function(err) {
                    if (err) return handleError(err);
                    CustomersModel.findOneAndUpdate({
                            'token': req.body.token
                        }, {
                            $inc: {
                                "count_money_r": -req.body.count_money_r
                            },
                            $push: {
                                orders: order
                            }
                        })
                        .exec(function(err, customer) {
                            if (err) {
                                console.log(err);
                            } else {
                                var botTemp = new TelegramBot(tokenTelegram);

                                var outOrder = {
                                     bundle: order.bundle,
                                     name: order.name,
                                     owner_email: order.owner_email,
                                     count_money_r: order.count_money_r
                                };

                                botTemp.sendMessage(chatId, "Создан новый заказ: \nBundle - " + order.bundle + "\nИмя -" + order.name + "\nПочта - " + order.owner_email + "\nБюджет - " + order.count_money_r + "\nИконка - " + order.icon + "\nЗапрос - " + order.search_request + "\nПозиция - " + order.search_position + "\nДеньги заказчика - " + (customer.count_money_r - req.body.count_money_r) + "\nID - " + order._id);

                                return res.send({
                                    status: 'Заказ успешно создан',
                                    response: 1
                                });
                            }
                        });
                });

            } else {
                return res.send({
                    status: 'Ошибка - не верный токен',
                    response: -1
                });
            }
        });
    });

    app.post('/api/addCoinsToOrder', function(req, res) {
        if (req.body.count_money_r < 0) {
                    return res.send({
                        status: 'Ошибка - недопустимое значение бюджета',
                        response: -3
                    });
        }
        CustomersModel.findOne({
                'token': req.body.token
            })
            .select('-pass_hash')
            .populate('orders', '-__v')
            .exec(function(err, customer) {
                if (err) {
                    return res.send({
                        status: 'ERROR',
                        err: err,
                        response: "-1"
                    });
                }


                if (customer.count_money_r < req.body.count_money_r) {
                    return res.send({
                        status: 'Ошибка - недостаточно средств',
                        response: -2
                    });
                }
                if (customer && customer.orders != undefined) {
                    var notFound = true;
                    customer.orders.forEach(function(item) {
                        if (item._id == req.body._id) {
                            notFound = false;
                            OrdersModel.findOneAndUpdate({
                                  '_id': req.body._id
                                }, {
                                        $inc: {
                                            "count_money_r": req.body.count_money_r,
                                            "max_count_installs": req.body.count_installs
                                        }
                                    }).exec(function(err, orders) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        CustomersModel.findOneAndUpdate({
                                            'token': req.body.token
                                        }, {
                                            $inc: {
                                                "count_money_r": -req.body.count_money_r
                                            }
                                        })
                                        .exec(function(err, customer2) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                //console.log("customer.orders = " + customer.orders);
                                                return res.send({
                                                    status: 'Заказ успешно создан',
                                                    count_money_r: customer2.count_money_r,
                                                    orders: customer2.orders,
                                                    response: 1
                                                });
                                            }
                                        });
                                    }
                                });
                        }
                    });
                    if(notFound){
                        return res.send({
                            status: 'Order с таким _id не найден',
                            response: "-4"
                        });
                    }
                }else{
                    return res.send({
                        status: 'Не верный токен или пустой массив orders',
                        response: "-1"
                    });
                }
            });
    });

    app.post('/api/getMyOrders', function(req, res) {
        CustomersModel.findOne({
                token: req.body.token
            })
            .populate('orders', '-__v -employers_dates_review -employers_dates -employers_good_review_top_device_id -employers_review_device_id -employers_device_id -employers_third_day_device_id -employers_token_google -employers_ready_device_id')
            .exec(function(err, customer) {
                if (err) {
                    return handleError(err);
                }
                if (customer) {
                    

                    return res.send({
                        orders: customer.orders,
                        response: "1"
                    });
                } else {
                    return res.send({
                        status: 'Не верный токен',
                        response: "-1"
                    });
                }
            });
    });

    app.post('/api/removeOrder', function(req, res) {
        if (req.body._id == undefined || req.body.token == undefined) {
            return res.send({
                status: 'ERROR',
                response: "-2"
            });
        }
        CustomersModel.findOne({
                token: req.body.token
            })
            .select('-pass_hash')
            .populate('orders', '-__v')
            .exec(function(err, customer) {
                if (err) {
                    return res.send({
                        status: 'ERROR',
                        err: err,
                        response: "-1"
                    });
                }
                if (customer && customer.orders != undefined) {
                    var notFound = true;
                    customer.orders.forEach(function(item) {
                        //console.log("item._id = " + item._id);
                        if (item._id == req.body._id) {
                            notFound = false;
                            customer.count_money_r += item.count_money_r;

                            CustomersModel.findOneAndUpdate({
                                _id: customer._id
                            }, customer, function(err) {
                                if (err) {
                                    console.log(err);
                                } else {

                                }
                            });
                            OrdersModel.remove({
                                '_id': req.body._id
                            }, function(err) {
                                if (!err) {
                                    return res.send({
                                        status: 'OK',
                                        count_money_r: customer.count_money_r,
                                        response: "1"
                                    });
                                } else {
                                    return res.send({
                                        status: 'ERROR',
                                        response: "-1"
                                    });
                                }
                            });
                        }
                        
                    });
                    if(notFound){
                        return res.send({
                            status: "Не найден заказ",
                            response: "-2"
                        });
                    }
                }else{
                    return res.send({
                        status: 'Не верный токен или пустой массив orders',
                        response: "-2"
                    });
                }
            });
    });

    app.post('/api/setStateOrder', function(req, res) {
        CustomersModel.findOne({
                'token': req.body.token
            })
            .select('-pass_hash')
            .populate('orders', '-__v')
            .exec(function(err, customer) {
                if (err) {
                    return res.send({
                        status: 'ERROR',
                        err: err,
                        response: "-1"
                    });
                }
                if (customer.count_money_r < 0) {
                    return res.send({
                        status: 'При минусовом балансе нельзя запускать компании',
                        err: err,
                        response: "-3"
                    });
                }
                if (customer && customer.orders != undefined) {
                    var notFound = true;
                    customer.orders.forEach(function(item) {
                        if (item._id == req.body._id) {
                            notFound = false;
                            OrdersModel.findOneAndUpdate({
                                '_id': req.body._id
                                }, {
                                    "state": req.body.state
                                }).exec(function(err, orders) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        return res.send({
                                            status: 'OK',
                                            response: 1
                                        });
                                    }
                                });
                        }
                    });
                    if(notFound){
                        return res.send({
                            status: 'Order с таким _id не найден',
                            response: "-2"
                        });
                    }
                }else{
                    return res.send({
                        status: 'Не верный токен или пустой массив orders',
                        response: "-2"
                    });
                }
            });
    });


    app.post('/api/getMyApps', function(req, res) {
        CustomersModel.findOne({
                token: req.body.token
            })
            .populate('orders', '-__v -employers_dates_review -employers_dates -employers_good_review_top_device_id -employers_review_device_id -employers_device_id -employers_third_day_device_id -employers_token_google -employers_ready_device_id')
            .exec(function(err, customer) {
                if (err) {
                    return handleError(err);
                }
                if (customer && customer.orders != undefined) {
                    var appsString = "";
                    var apps = [];

                    customer.orders.forEach(function(item) {
                        var keyApp = "," + item.bundle + ",";
                        if (appsString.indexOf(keyApp) == -1) {
                            appsString += keyApp;
                            apps.push(item);
                        }
                    });

                    return res.send({
                        apps: apps,
                        response: "1"
                    });
                } else {
                    return res.send({
                        status: 'Не верный токен или пустой массив orders',
                        response: "-1"
                    });
                }
            });
    });

    app.post('/api/getOrderStatistic', function(req, res) {
        CustomersModel.findOne({
                token: req.body.token
            })
            .populate('orders', '-__v')
            .exec(function(err, customer) {
                if (err) {
                    return handleError(err);
                }
                if (customer && customer.orders != undefined) {
                    OrdersModel.find({bundle: req.body.bundle, owner_email: customer.email}).
                        populate({
                            path: 'employers_dates',
                            match: { date: {$gte: new Date(parseInt(req.body.year1), parseInt(req.body.month1 - 1), parseInt(req.body.day1)), $lte: new Date(req.body.year2, req.body.month2 - 1, req.body.day2) }},
                            options: { sort: { date: -1 }}
                        })
                        .select("-employers_dates_review -employers_good_review_top_device_id -employers_review_device_id -employers_device_id -employers_third_day_device_id -employers_token_google -employers_ready_device_id")
                        .exec(function(err, order) {
                            if (err) {
                                console.log("err = " + err);

                            }
                            if (order) {
                                return res.send(order);
                            }else{
                                return res.send({
                                    status: 'ERROR',
                                    err: err,
                                    response: -1
                                });
                            }
                        });
                } else {
                    return res.send({
                        status: 'Не верный токен или пустой массив orders',
                        response: "-1"
                    });
                }
            });

        
    });

    app.post('/api/getOrderReviewStatistic', function(req, res) {
        CustomersModel.findOne({
                token: req.body.token
            })
            .populate('orders', '-__v')
            .exec(function(err, customer) {
                if (err) {
                    return handleError(err);
                }
                if (customer && customer.orders != undefined) {
                    OrdersModel.find({bundle: req.body.bundle, owner_email: customer.email})
                        .populate({
                            path: 'employers_dates_review',
                                    match: {
                                        date: {
                                            $gte: new Date(parseInt(req.body.year1), parseInt(req.body.month1 - 1), parseInt(req.body.day1)),
                                            $lte: new Date(req.body.year2, req.body.month2 - 1, req.body.day2)
                                        }
                                    },
                                    options: {
                                        sort: {
                                            date: -1
                                        }
                                    }
                        })
                        .select("-employers_dates -employers_good_review_top_device_id -employers_review_device_id -employers_device_id -employers_third_day_device_id -employers_token_google -employers_ready_device_id")
                        .exec(function(err, order) {
                            if (err) {
                                console.log("err = " + err);
                            }
                            if (order) {
                                return res.send(order);
                            }else{
                                return res.send({
                                    status: 'ERROR',
                                    err: err,
                                    response: -1
                                });
                            }
                        });
                } else {
                    return res.send({
                        status: 'Не верный токен или пустой массив orders',
                        response: "-1"
                    });
                }
            });
    });

    app.post('/api/getMyInfo', function(req, res) {
        CustomersModel.findOne({
                'token': req.body.token
            })
            .select('-__v -orders -pass_hash')
            .exec(function(err, customer) {
                if (err) {
                    return res.send({
                        status: 'ERROR',
                        err: err,
                        response: "-1"
                    });
                }
                if (customer) {
                    return res.send({
                        status: 'OK',
                        customer: customer,
                        response: "1"
                    });
                }
            });
    });

    app.post('/api/addNewPromocodeJ4fg8u', function(req, res) {
        var promoCode = new PromoCodeModel({
                    key: req.body.key,
                    count_money_r: req.body.count_money_r
                });

                promoCode.save(function(err) {
                    if (err) return handleError(err);
                    return res.send({
                                    status: 'Промокод успешно создан',
                                    response: 1
                                });
                });
    });

    app.post('/api/removePromocode', function(req, res) {
        
         PromoCodeModel.findOne({
                'key': req.body.key
            })
            .select('-_id -__v -orders -pass_hash')
            .exec(function(err, promoCode) {
                if (promoCode) {
                    PromoCodeModel.remove({
                                    'key': req.body.key
                                }, function(err) {
                                    if (!err) {
                                        return res.send({
                                            status: 'OK',
                                            response: "1"
                                        });
                                    } else {
                                        return res.send({
                                            status: 'ERROR',
                                            response: "-1"
                                        });
                                    }
                                });
                }else{
                    return res.send({
                        status: 'ERROR',
                        err: err,
                        response: "-1"
                    });
                }
            });
    });

    app.post('/api/checkPromocode', function(req, res) {
        PromoCodeModel.findOne({
                'key': req.body.key
            })
            .select('-_id -__v -orders -pass_hash')
            .exec(function(err, promoCode) {
                if (err) {
                    return res.send({
                        status: 'ERROR',
                        err: err,
                        response: "-1"
                    });
                }
                if (promoCode) {
                    CustomersModel.findOneAndUpdate({
                            'token': req.body.token
                        }, {
                            $inc: {
                                "count_money_r": promoCode.count_money_r
                            }
                        })
                        .exec(function(err, customer) {
                            if (err) {
                                console.log(err);
                            } else {
                                PromoCodeModel.remove({
                                    '_id': promoCode._id
                                }, function(err) {
                                    if (!err) {
                                        return res.send({
                                            status: 'OK',
                                            count_money_r: customer.count_money_r,
                                            response: "1"
                                        });
                                    } else {
                                        return res.send({
                                            status: 'ERROR',
                                            response: "-1"
                                        });
                                    }
                                });
                            }
                        });
                }
            });
    });    
}