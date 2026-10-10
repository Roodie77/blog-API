const joi = require('joi');

const createArticleSchema = joi.object({
    title: joi.string().min(5).max(200).required().trim(),
    content: joi.string().min(20).required(),
    
}
);
const validatearticle = (req, res, next) => {
    const { error } = createArticleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
const updateArticleSchema = joi.object({
    title: joi.string().min(5).max(200).optional().trim(),
    content: joi.string().min(20).trim(),
    
}
);
const validateUpdateArticle = (req, res, next) => {
    const { error } = updateArticleSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
