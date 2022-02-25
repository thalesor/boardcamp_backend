import Joi from 'joi';
import pkg from 'joi-translation-pt-br';

const {messages} = pkg;

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
    name: Joi.string().trim().min(5).required().label("Nome do cliente"),
    phone: Joi.string().required().label("Telefone"),
    cpf: Joi.string().trim().required().label("CPF"),
    birthday: Joi.string().required().label("Data de nascimento")
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