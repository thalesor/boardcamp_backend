import db  from '../services/db.js';
import dayjs from 'dayjs';

async function getCustomers(req, res)
{
    try {
        let result = null;
        const { cpf } = req.query;
        if(cpf)
        {
            result = await db.query(`SELECT * FROM customers
            WHERE cpf LIKE $1
        ;`, [`%${cpf}%`]);
        }
        else
        result = await db.query(`SELECT * FROM customers`);

        res.status(200).send(result.rows);
    }
    catch(err)
    {
        res.status(400).send('erro no banco de dados: '+err);
    }
}

async function getCustomer(req, res)
{
    const { id } = req.params;
    try {
        const result = await db.query("SELECT * FROM customers WHERE id=$1", [id]);
        if( result?.rowCount === 0)
        {
            res.status(404).send("Não foram cadastrados clientes com o ID especificado!");
            return;
        }
        res.status(200).send(result.rows[0]);
    }
    catch(err)
    {
        res.status(500).send('erro no banco de dados: '+err);
    }
}

async function postCustomer(req, res)
{
    try {
        const { name, phone, cpf, birthday } = res.locals.postData;
       
        const result = await db.query("SELECT * FROM customers WHERE cpf=$1", [cpf]);

        if( result?.rowCount > 0)
        {
            res.status(409).send("Já existe um cliente cadastrado com esse cpf!");
            return;
        }
        
        await db.query(`
        INSERT INTO
        customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4)
        `, [name, phone, cpf, birthday]);
        res.sendStatus(201);
    }
    catch(err)
    {
        res.status(500).send('erro no banco de dados: '+err);
    }
}

async function updateCustomer(req, res)
{
    try {
        let {id, name, phone, cpf, birthday } = res.locals.postData;
        let result = await db.query("SELECT * FROM customers WHERE cpf=$1 AND id!=$2", [cpf, id]);
        if( result?.rowCount > 0)
        {
            res.status(409).send("Já existe um cliente cadastrado com esse cpf!");
            return;
        }
        birthday = dayjs(birthday);
        result = await db.query("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5", [name, phone, cpf, birthday.format('YYYY-MM-DD'), id]);
        res.sendStatus(200);
    }
    catch(err)
    {
        res.status(500).send('erro no banco de dados: '+err);
    }
}

export {
    getCustomers,
    getCustomer,
    postCustomer,
    updateCustomer
}

