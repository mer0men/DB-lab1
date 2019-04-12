
connectDB = (sql) => {
    return db = new sql.Database('policlinic.db', sql.OPEN_READWRITE | sql.OPEN_CREATE, (err) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Connected to the chinook database.');
            
        }            
    });
}

module.exports = function(app, sql) {
    app.get('/db/create', (req, res) => {
        let db = connectDB(sql);
    })

    app.post('/db/tablecreate', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*')
        let db = connectDB(sql);

        console.log('body', Object.keys(req.body))
        let tableOptions = {
            'name' : req.body.tableName,
            'fields' : req.body.tableFields
        }

        console.log('option', tableOptions)
        //let body = JSON.parse(req.body)
        let resRows = [];
        let dataType = ""

        tableOptions.fields.forEach((key, index) => {
            dataType += key.name + ' '
            dataType += key.type + ' '
            dataType += key.option + ' '
            dataType += ((index != tableOptions.fields.length - 1) ? ', ' : '')
        });

        db.serialize(() => {
            db.run(`CREATE TABLE ${tableOptions.name}(${dataType})`, (err) => {
                if (err) {

                    console.log("req", dataType)
                    console.log('create table',err.message)
                    return res.send(err.message)
                }
            })
        });

        db.close((err)=> {
            if (err) {
                console.log(err.message)
                res.send(err)
            } else {
                console.log(resRows);
                res.send(resRows); 
            }
        })        
    })

    app.get('/db/tableschema/:tablename', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        let db = connectDB(sql);
        
        db.serialize(() => {
            db.all(`pragma table_info(${req.params.tablename})`, (err, rows) => {
                if (err) {
                    res.send(err.message)
                } else {
                    console.log('rows:', rows)
                    res.send(rows)
                }
            })
        })        
    })

    app.get('/db/viewtable/:tablename', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        let db = connectDB(sql);

        db.serialize(() => {
            db.all(`SELECT * FROM ${req.params.tablename}`, (err, rows) => {
                if (err) {
                    res.send(err.message);
                } else {
                    console.log('rows view', rows)
                    res.send(rows);
                }
            })
        })
    })

    app.get('/db/tablelist/', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*')
        let db = connectDB(sql)

        db.all(`SELECT name FROM sqlite_master WHERE type ='table'`, (err, rows) => {
            if (err) {
                console.log(err);
                res.send(err.message)
                return 1;
            } else {
                console.log(rows);
                res.send(rows)
            }
        })
    })

    app.post('/db/tableinsert/:tablename', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*')
        let db = connectDB(sql)
        console.log(req.body)
        let values = "("
        let cols = ""
        let sings = ""

        Object.keys(req.body.values).forEach((item, index) =>  {
            if (item != "undefined") {
                cols += (index > 0) ? ` ${item}` : `${item}`
                cols += (index < Object.keys(req.body.values).length - 1) ? ',' : ''
                console.log(item)

                values += `"${req.body.values[item]}"`
                values += (index < Object.keys(req.body.values).length - 1) ? ',' : ')'
            }
        })
        console.log(values)
        console.log('cols:', cols)
        console.log(sings)
        let string =  `INSERT INTO ${req.params.tablename}(${cols}) VALUES${values}`
        console.log('sql:', string)
        db.serialize(() => {
            db.run(`INSERT INTO ${req.params.tablename}(${cols}) VALUES${values}`, err => {
                if (err) {
                    console.log('err', err.message)
                    res.send(err.message)                    
                } else {
                    console.log('insert into table suc')
                    res.sendStatus(200)
                }   
            })
        })
    })

    app.post('/db/tabledelete', (req, res) => {        
        res.header('Access-Control-Allow-Origin', '*')
        let db = connectDB(sql)
        let error = []
        db.serialize(() => {
            req.body.forEach(item => {
                db.run(`DROP TABLE ${item}`, err => {
                    if (err) {
                        console.log(err.message)
                        error.push(err.message)
                    }
                }) 
            })
        })
        if (error.length > 0) {
            res.status(400).send(error)
        } else {
            res.send('OK')
        }

    })
};