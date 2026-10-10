const Joi = require("joi")
const Articlemodel = require("../models/article.model")

const postArticle = async (req, res,next) => {
const articleSchema = Joi.object({
    title: Joi.string().min(5).required(),
    content: Joi.string().min(20).required(),
    author: Joi.string().optional().default("Guest")
  });
  const { error , value} = articleSchema.validate(req.body)

    if (error) {
    return res.status(400).json("please provide article title and content")
  }

    try {
                const newArticle = new Articlemodel({
                    title: req.body.title,
                    content: req.body.content,
                    author: req.user._id
                });
        await newArticle.save();

         return res.status(200).json({
            message: "Article created successfully",
            data: newArticle
         })
        
    } catch (error) {
        console.error(error)
        next(error);   
    }
};



const getAllArticle = async (req, res,next) => {
    const{limit=10, page=1 } = req.query 

    const skip = (page -1) * limit;


    try {
        console.log(req.user);
        const articles = await Articlemodel.find({}).sort({createdAt: -1}).limit(limit).skip(skip)  
    return res.status(200).json({
        message: "Articles retrieved successfully",
        data: articles
    })
        
    } catch (error) {
        next(error);
    }
};

const searchArticles = async (req, res, next) => {
    try {
        const { error, value } = Joi.object({
            q: Joi.string().trim().min(1).required(),
            limit: Joi.number().integer().min(1).max(100).default(10),
            page: Joi.number().integer().min(1).default(1)
        }).validate(req.query);

        if (error) {
            return res.status(400).json({
                message: "Please provide a search keyword using ?q=keyword"
            });
        }

        const skip = (value.page - 1) * value.limit;
        const articles = await Articlemodel.find(
            { $text: { $search: value.q } },
            { score: { $meta: "textScore" } }
        )
            .sort({ score: { $meta: "textScore" } })
            .limit(value.limit)
            .skip(skip);

        return res.status(200).json({
            message: "Articles found successfully",
            data: articles
        });
    } catch (error) {
        next(error);
    }
};




const getArticleById = async (req, res,next) => {
    try {
        const article = await Articlemodel.findById(req.params.id)
        if (!article) {
            return res.status(404).json({
                message:`Article with ID ${req.params.id} not found`
            })
        }
        return res.status(200).json({
            message: "Article retrieved successfully",
            data: article
        })
    } catch (error) {
        console.error(error)
        next(error);
    }
};



const updateArticleById = async (req, res,next) => {
    const articleSchema = Joi.object({
    title: Joi.string().min(5).optional(),
    content: Joi.string().min(20).optional()
  });
    const { error , value} = articleSchema.validate(req.body);
    if (error) {
        return res.status(400).json("please provide valid article fields")
  }

    try {
    const existing = await Articlemodel.findById(req.params.id);
    if (!existing) {
        return res.status(404).json({ message: "Article not found" });
    }
    if (existing.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only edit your own articles" });
    }

    const updatedArticle = await Articlemodel.findByIdAndUpdate(
        req.params.id,
        {...req.body},
        {
            new: true,
            runValidators: true
        }
    );

if (!updatedArticle) {
    return res.status(404).json({
        message: "Article not found",
        data: updatedArticle
    })
}
    return res.status(200).json({
        message: "Article updated successfully",
        data: updatedArticle
    });
    } catch (error) {
        console.error(error)
        next(error);
    }
    }
;
const deleteArticleById = async (req, res,next) => {
    try {
        const article = await Articlemodel.findById(req.params.id)
        if (!article) {
            return res.status(404).json({
                message:'Article not found',
            });
        }
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You can only delete your own articles',
            });
        }
        await article.deleteOne();

        return res.status(200).json({
            message: 'Article deleted successfully',
        });
        
    } catch (error) {
        console.error(error)
        next(error);
    }
};
module.exports = {
    postArticle,
    getAllArticle,
    searchArticles,
    getArticleById,
    updateArticleById,
    deleteArticleById
};