const Joi = require("joi");

const incrementSchema = Joi.object({
    amount: Joi.number().integer().min(1).default(1),
});

exports.validateIncrement = (req, res, next) => {
    const { error } = incrementSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    next();
};
