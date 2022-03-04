import Joi from 'joi';

const categorySchema = Joi.object({
  name: Joi.string().trim().min(4).required().label("Nome da categoria"),
});

const gameSchema = Joi.object({
    name: Joi.string().trim().min(4).required().label("Nome do jogo"),
    imageUrl: Joi.string().trim().required().label("URL da imagem"),
    stockTotal: Joi.number().positive().required().label("Em estoque"),
    idCategory: Joi.number().positive().required().label("Categoria"),
    pricePerDay: Joi.number().positive().required().label("Preço por dia")
  });

  const customerSchema = Joi.object({
    id: Joi.number().positive().label("ID"),
    name: Joi.string().trim().min(5).required().label("Nome do cliente"),
    phone: Joi.string().required().min(10).max(11).label("Telefone"),
    cpf: Joi.string().trim().min(11).max(11).required().label("CPF"),
    birthday: Joi.date().required().label("Data de nascimento")
  });

  const rentalSchema = Joi.object({
    customerId: Joi.number().positive().required().label("Cliente"),
    gameId: Joi.number().positive().required().label("Jogo"),
    rentDate: Joi.string().trim().required().label("Data do aluguel"),
    daysRented: Joi.number().positive().required().label("Período de aluguel"),
    returnDate: Joi.string().trim().label("Data da devolução"),
    originalPrice: Joi.number().positive().required().label("Preço total do aluguel"),
    delayFee: Joi.number().positive().label("Total da multa por atraso")
  });

export {
    categorySchema,
    gameSchema,
    customerSchema,
    rentalSchema
}