import pkg from 'joi-translation-pt-br';
const {messages} = pkg;

const validation = (schema) => {
    return (req, res, next) => 
    {
        let data = null;
        if(req.method === 'GET')
            data = req.headers.data;
        else if(req.method === 'POST')
            data = req.body;
            else if(req.method === 'PUT')
            {
                data = req.body;
                data.id = req.params.id;
            }
            

        const validation = schema.validate(data, { messages, abortEarly: false });
        if(validation.error)
        {
            const errors = validation.error.details.map(err => `*${err.message} 
                
                `);
            res.status(400).send(`Erros durante a validação dos dados no servidor:
            ${errors}`);
            return;
        }
        res.locals.postData = data;
        next();
        return;
    };
  };

  export { validation };