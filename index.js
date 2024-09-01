const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const port = process.env.PORT || 3000;

const db = new sqlite3.Database('./personajes.db', (error) => {
    if (error) {
        console.error(error.message);

    }

    console.log('Conexion exitosa');

    });

app.use(express.json());

// get

app.get('/personajes', (req, res) => {
    db.all('select * from personajes', (error, pers) => {
        if (error) {
            console.error(error.message);
            res.status(500).send('Error');
        }
        else if (!pers){
            res.status(404).send('No existen personajes.');
        }

        else {
            res.send(pers);
        }
    });
});

// get/id

app.get('/personajes/:id', (req, res) => {
    const { id } = req.params;
    db.get('select * from personajes where id = ?', [id] ,(error, pers) => {
        if (error) {
            console.error(error.message);
            res.status(500).send('Error');
        }

        else if (!pers){
            res.status(404).send('No existe ese personaje.');
        }

        else {
            res.send(pers);
        }
    });
});

// post

app.post('/personajes', (req, res) => {
    const { nombre, clase } = req.body;

    if (!nombre || !clase) {
        res.status(400).send('Nombre o clase vacios.');
    }
    else {
        const sql = 'insert into personajes(nombre,clase) values(?,?)'
        db.run(sql, [nombre, clase], function (error) {
            if (error) {
                console.error(error.message);
                res.status(500).send('Error');
            }
            else {
                const id = this.lastID
                res.status(201).send({id, nombre, clase})
            }
        });
    }
});

// put

app.put('/personajes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, clase } = req.body;

    if (!nombre || !clase) {
        res.status(400).send('Nombre o clase vacios.');
    }
    else {
        const sql = 'UPDATE personajes SET nombre = ?, clase = ? WHERE id = ?'
        db.run(sql, [nombre, clase, id], function (error) {
            if (error) {
                console.error(error.message);
                res.status(500).send('Error');
            }

            else if (this.changes === 0){
                res.status(404).send('No existe ese personaje.');
            }

            else {
                const id = this.lastID
                res.status(201).send({id, nombre, clase})
            }
        });
    }
});

// delete

app.delete('/personajes/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'delete from personajes where id = ?';
        db.run(sql, [id], function (error) {
            if (error) {
                console.error(error.message);
                res.status(500).send('Error');
            }

            else if (this.changes === 0){
                res.status(404).send('No existe ese personaje.');
            }
            else {
                res.status(201).send("Personaje eliminado")
            }
        });

});

app.listen(port, () => {
    console.log(`Servidor iniciado en ${port}`);
})