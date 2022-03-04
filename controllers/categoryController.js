import db  from '../services/db.js';

async function getCategories(req, res)
{
    try {
        const result = await db.query(`SELECT * FROM categories`);
        res.send(result.rows);
    }
    catch(err)
    {
        res.status(400).send('erro no banco de dados: '+err);
    }
}

async function postCategory(req, res)
{
    try {
        const { name } = res.locals.postData;
       
        const result = await db.query("SELECT * FROM categories WHERE name=$1", [name]);

        if( result?.rowCount > 0)
        {
            res.status(401).send("Essa categoria já está cadastrada!");
            return;
        }
        
        await db.query(`
        INSERT INTO
        categories (name)
        VALUES ($1)
        `, [name]);
        res.sendStatus(200);
    }
    catch(err)
    {
        res.status(500).send('erro no banco de dados: '+err);
    }
}

export {
    getCategories,
    postCategory
}

