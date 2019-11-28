const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'nodemysql'
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
/* DEO ZA API POZIVE */
// Select proizvoda
app.get('/getproizvod', (req, res) => {
    let sql = `
    SELECT a.ID_PROIZVODA as id, a.NAZIV as name, c.MESTO as production, a.JEDINICA_MERE as jedinicaMere, a.CENA as price, a.kolicina as quantity FROM proizvod a 
    INNER JOIN proizvodiujedinici b on a.ID_PROIZVODA = b.ID_PROIZVODA
    INNER JOIN proizvodna_jedinica c on b.ID_JEDINICE = c.ID_JEDINICE
    `;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

// Select proizvodnih jedinica "vezna tabela"
app.get('/getproizvodnajedinica', (req, res) => {
    let sql = `
    SELECT id_jedinice as id, mesto as production FROM proizvodna_jedinica
    `;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});


//  Insert proizvoda
app.post('/insertproizvod', (req, res) => {
    console.log(req.body);
    let sql1 = `CALL insertProductInfo(?,?,?,?,?,?)`;
    let query = db.query(sql1,[req.body.id, req.body.quantity,req.body.jedinicaMere,req.body.price, req.body.name, req.body.production], (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

//  UPDATE proizvoda
app.put('/updateproizvod', (req, res) => {
    console.log(req.body);
    let sql = `CALL updateProductInfo(?,?,?,?,?,?)`;
    let query = db.query(sql,[req.body.id, req.body.quantity,req.body.jedinicaMere,req.body.price, req.body.name, req.body.production], (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    });

});
// Delete proizvoda
app.delete('/deleteproizvod/:id', (req, res) => {    
    let sql = `CALL deleteProductInfo(?)`;
    let query = db.query(sql,[req.params.id], (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    });
});


app.get('/getskladiste', (req, res) => {
    let sql = `SELECT id_skladista as id , mesto as storage FROM skladiste`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    });
});

app.get('/getproizvod1', (req, res) => {
    let sql = `SELECT id_proizvoda as id,naziv as product  FROM proizvod`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    });
});

app.get('/getproizvodnajedinica1', (req, res) => {
    let sql = `SELECT id_jedinice as id,mesto as jedinica  FROM proizvodna_jedinica`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    });
});


app.get('/getnarudzbenicaset', (req, res) => {
    let sql = `CALL createJsonList(); `;

    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        //console.log(JSON.parse(results[0][0].jsonObj));
        
        let jsonObj =  JSON.parse(results[0][0].jsonObj).map(row => (row.data = JSON.parse(row.data), row));
        console.log(jsonObj);
        res.send(jsonObj);
    });
});

app.get('/getlastid', (req, res) => {
    let sql = `SELECT id_narudzbenice + 1 as id FROM narudzbenica order by id_narudzbenice desc limit 1;`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results[0]);
    });
});

//  Insert proizvoda
app.post('/insertorder', (req, res) => {

    let date = req.body.orderDate
    let day = date.slice(0, 2)
    let month = date.slice(3, 5)
    let year = date.slice(6, 10)
    let orderDate = `${year}${month}${day}`
    let queryString = ``;
    console.log(queryString)
    
    let sql = `INSERT INTO narudzbenica(id_narudzbenice, id_jedinice, id_skladista, datum) VALUES(?,?,?,?);`;
    let query = db.query(sql, [req.body.id,req.body.jedinica,req.body.storage,orderDate],(err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

app.post('/insertorderdata', (req, res) => {

    let products = '';
    
    req.body.data.forEach(element => {
    products += `(${req.body.id}, ${element.id} , ${element.quantity} ),`
    });
 
    let sql = 'INSERT INTO proizvodi_narudzbenice(id_narudzbenice, id_proizvoda, KOLICINA_PROIZVODA) VALUES ' + products.slice(0,-1);
    let query = db.query(sql,(err, results) => {
        if(err) throw err;
        res.send(results);
    });
});



app.listen('3000', () => {
    console.log('Server started on port 3000');
});