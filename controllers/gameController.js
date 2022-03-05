import db  from '../services/db.js';

async function getGames(req, res)
{
    try {
        let result = null;
        const { name } = req.query;
        if(name)
        {
            result = await db.query(`SELECT g.*, c.name AS "categoryName" FROM categories c INNER JOIN games g ON g."categoryId" = c.id
            WHERE g.name LIKE '$1%'
        ;`, [name]);
        }
        else
        result = await db.query(`SELECT g.*, c.name AS "categoryName" FROM categories c INNER JOIN games g ON g."categoryId" = c.id;`);
        res.status(200).send(result.rows);
    }
    catch(err)
    {
        res.status(500).send('erro no banco de dados: '+err);
    }
}

async function postGame(req, res)
{
    try {
        const { name, image,  stockTotal, categoryId, pricePerDay } = res.locals.postData;
       
        let result = await db.query("SELECT * FROM games WHERE name=$1", [name]);

        if( result?.rowCount > 0)
        {
            res.status(409).send("Já existe um jogo cadastrado com esse nome!");
            return;
        }

        result = await db.query("SELECT * FROM categories WHERE id=$1", [categoryId]);

        if( result?.rowCount === 0)
        {
            res.status(400).send("Não existe nenhuma categoria com o ID especificado!");
            return;
        }
        
        await db.query(`
        INSERT INTO
        games (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5)
        `, [name, image, Number(stockTotal), categoryId, Number(pricePerDay)]);
        res.sendStatus(201);
    }
    catch(err)
    {
        res.status(500).send('erro no banco de dados: '+err);
    }
}

export {
    getGames,
    postGame
}

