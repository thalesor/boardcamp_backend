const validation = (schema) => {
    return (req, res, next) => 
    {
        let data = null;
        if(req.method === 'GET')
            data = req.headers.data;
        else if(req.method === 'POST')
            data = req.body;

        const validation = schema.validate(data, { messages, abortEarly: false });
        if(validation.error)
        {
            const errors = validation.error.details.map(err => `*${err.message} 
                
                `);
            res.status(422).send(`Erros durante a validação dos dados no servidor:
            ${errors}`);
            return;
        }
        res.locals.postData = data;
        next();
        return;
    };
  };

  export { validation };