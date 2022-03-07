import db  from '../services/db.js';
import dayjs from 'dayjs';
const today = dayjs().format('YYYY-MM-DD');
async function getRentals(req, res)
{
	try 
	{
		const {customerId, gameId} = req.query;
		let result = null;
		
        if(customerId)
		{
			result = await db.query(`SELECT r.*, cust.name AS "customerName", g.name AS "gameName", cat.name AS "categoryName", cat.id AS "categoryId" FROM rentals r INNER JOIN customers cust ON r."customerId" = cust.id
			INNER JOIN games g ON r."gameId" = g.id
			INNER JOIN categories cat ON g."categoryId" = cat.id
			WHERE "customerId" = $1`, [customerId]);
		}
		
        else if(gameId)
		result = await db.query(`SELECT r.*, cust.name AS "customerName", g.name AS "gameName", cat.name AS "categoryName", cat.id AS "categoryId" FROM rentals r INNER JOIN customers cust ON r."customerId" = cust.id
			INNER JOIN games g ON r."gameId" = g.id
			INNER JOIN categories cat ON g."categoryId" = cat.id
			WHERE "gameId" = $1`, [gameId]);

		else
		{
			result = await db.query(`SELECT r.*, cust.name AS "customerName", g.name AS "gameName", cat.name AS "categoryName", cat.id AS "categoryId" FROM rentals r INNER JOIN customers cust ON r."customerId" = cust.id
			INNER JOIN games g ON r."gameId" = g.id
			INNER JOIN categories cat ON g."categoryId" = cat.id
			;`);
		}
		
		const newDataSet = result.rows.map(row => {
			const rowSet = {...row,
			customer: {
				id: row.customerId,
				name: row.customerName
			},
			game:{
				id: row.gameId,
				name: row.gameName,
				categoryId: row.categoryId,
				categoryName: row.categoryName
			}
		};
		return rowSet;
	});
        
		res.status(200).send(newDataSet);
    }
    catch(err)
    {
        res.status(500).send('erro no banco de dados: '+err);
    }
}


async function finishRental(req, res)
{
	const { id } = req.params;
	let result = await db.query("SELECT * FROM rentals WHERE id=$1", [id]);

        if( result?.rowCount === 0)
        {
            res.status(404).send("Não existe nenhum aluguel com o ID especificado!");
            return;
        }

        result = await db.query(`SELECT "returnDate" FROM rentals WHERE id=$1`, [id]);

        if( result?.rows[0].returnDate !== null)
        {
            res.status(400).send("Não será possível fazer a devolução pois o aluguel já foi finalizado!");
            return;
        }

		result = await db.query(`SELECT r."rentDate", r."daysRented", g."pricePerDay" FROM rentals r INNER JOIN games g ON r."gameId" = g.id WHERE r.id=$1`, [id]);
		let { rentDate, daysRented, pricePerDay } = result.rows[0];
		const deliveryDay = dayjs();
		let expireDate = dayjs(rentDate).add(daysRented, 'day');
		let delayFee = 0;

		if(deliveryDay.isAfter(expireDate))
		{
			let diff = deliveryDay.diff(expireDate);
			diff = parseInt(diff / (1000 * 3600 * 24));
			delayFee = pricePerDay*diff;
		}

	    result = await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`, [ today, delayFee, id]);
        res.sendStatus(200);
		return;
}

async function postRental(req, res)
{
	try {
        const { customerId, gameId, daysRented } = res.locals.postData;
		
        let result = await db.query("SELECT * FROM customers WHERE id=$1", [customerId]);

        if( result?.rowCount === 0)
        {
            res.status(400).send("Não existe nenhum cliente com o ID especificado!");
            return;
        }

        result = await db.query("SELECT * FROM games WHERE id=$1", [gameId]);

        if( result?.rowCount === 0)
        {
            res.status(400).send("Não existe nenhum jogo com o ID especificado!");
            return;
        }

		const game = await db.query(`SELECT name, "pricePerDay" from games where id=$1`, [gameId]);
        const originalPrice = daysRented * game.rows[0].pricePerDay;
		const returnDate = null;
		const delayFee = null;

		result = await db.query(`select count(r.*) as rented, g."stockTotal" AS "originalStock", g.name AS "gameName" from rentals r INNER JOIN games g ON g.id = r."gameId"
		 where r."gameId"=$1 AND "returnDate" IS NULL group by g.id;`, [gameId]);
		
		const { rented, originalStock, gameName } = result.rows[0];

		if(rented >= originalStock)
		{
			res.status(422).send(`Lamentamos mas todos os jogos '${gameName}' estão emprestados, retorne em alguns dias`);
			return;
		}
		
        await db.query(`
        INSERT INTO
        rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [customerId, gameId, today, Number(daysRented), returnDate, Number(originalPrice), delayFee]);
        res.sendStatus(201);
    }
    catch(err)
    {
        res.status(500).send('erro no banco de dados: '+err);
    }
}

async function deleteRental(req, res)
{
	const { id } = req.params;
	let result = await db.query("SELECT * FROM rentals WHERE id=$1", [id]);

        if( result?.rowCount === 0)
        {
            res.status(404).send("Não existe nenhum aluguel com o ID especificado!");
            return;
        }

		result = await db.query(`SELECT "returnDate" FROM rentals WHERE id=$1`, [id]);

        if( result?.rows[0].returnDate !== null)
        {
            res.status(400).send("Não será possível deletar o aluguel pois esse já foi finalizado!");
			return;
		}

	    result = await db.query(`DELETE FROM rentals WHERE id=$1`, [id]);
        res.sendStatus(200);
		return;	
}

export {
    getRentals,
	finishRental,
	postRental,
	deleteRental
}

