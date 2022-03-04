import db  from '../services/db.js';

async function getCustomers(req, res)
{
    try {
        const result = await db.query(`SELECT * FROM customers`);
        res.send(result.rows);
    }
    catch(err)
    {
        res.status(400).send('erro no banco de dados: '+err);
    }
}
/*
async function getCustomer(req, res)
{

}

async function postCustomer(req, res)
{
    try {
        const { name, phone, cpf, birthday } = res.locals.postData;

        const result = await db.query(`SELECT * FROM customers
        WHERE cpf="$1"`, [cpf]);

        if(result.rowCount > 0)
        {
            res.status(401).send("Já existe um cliente cadastrado com esse cpf!");
            return;
        }

        await db.query(`
        INSERT INTO
        customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4)
        `, [name, phone, cpf, birthday]);
        res.sendStatus(200);
    }
    catch(err)
    {
        res.status(500).send(err);
    }
}

async function updateCustomer(req, res)
{

}
*/
export {
    getCustomers
    //getCustomer,
   // postCustomer,
   // updateCustomer
}

