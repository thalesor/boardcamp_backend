import db  from '../services/db.js';

async function getRentals(req, res)
{
	try 
	{
		const {customerId} = req.query;
		const {gameId} = req.query;
		let result = null;

        if(customerId)
		{
			result = await db.query(`SELECT * FROM rentals WHERE "customerId" = $1`, [customerId]);
		}
		
        else if(gameId)
		result = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1`, [gameId]);
        
		res.status(200).send(result.rows);
    }
    catch(err)
    {
        res.status(400).send('erro no banco de dados: '+err);
    }
}


async function finishRental(req, res)
{

}

async function postRental(req, res)
{

}

async function deleteRental(req, res)
{

}

export {
    getRentals,
	finishRental,
	postRental,
	deleteRental
}

