var models = require('../models/models.js');

var statistics = {
	num_quizes: 0,
	num_comments: 0,
	avg_comments: 0,
	num_quizes_no_comment: 0,
	num_quizes_with_comment: 0
};

var errors = [];

exports.calculate = function(req, res, next) {
	errors = [];
	statistics.num_quizes_no_comment = 0;
	statistics.num_quizes_with_comment = 0;

	models.Quiz.count().then(function(quizes) {
		statistics.num_quizes = quizes;
		return models.Comment.count();
	}).then(function(comments) {
		statistics.num_comments = comments;
		statistics.avg_comments = Math.floor(statistics.num_comments / statistics.num_quizes);
		return models.Quiz.findAndCountAll({
			include: [{
				model: models.Comment,
				required: true
			}]
		}); // num quizes con comentario
	}).then(function(quizes) {
		statistics.num_quizes_with_comment = quizes.rows.length;
		statistics.num_quizes_no_comment = statistics.num_quizes - statistics.num_quizes_with_comment;
	}).
	catch (function(err) {
		next(err);
	}).
	finally(function() {
		next();
	});
};

// GET /quizes/statistics
exports.show = function(req, res) {
	res.render('statistics/show.ejs', {
		statistics: statistics,
		errors: errors
	});
};