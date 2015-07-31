var models = require('../models/models.js');

// Autoload :id - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
		where: {
			id: Number(quizId)
		},
		include: [{
			model: models.Comment
		}]
	}).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId=' + quizId));
		}
	}).
	catch (function(error) {
		next(error);
	});
};


// GET /author
exports.author = function(req, res) {
	res.render('author', {
		nombre: 'David Sabalete',
		email: 'dsabalete@gmail.com',
		twitter: 'https://twitter.com/dsabalete',
		skype: 'skype:dsabalete?add',
		about_url: 'http://about.me/david.sabalete',
		errors: []
	});
};

// GET /quizes?search=texto_a_buscar
// GT  /quizes
exports.index = function(req, res) {
	var search = "%";
	if (req.query.search !== undefined) {
		search = "%" + req.query.search + "%";
		search = search.trim().replace(/\s/g, "%");

	}
	models.Quiz.findAll({
		where: ["upper(pregunta) like ?", search.toUpperCase()],
		order: 'pregunta ASC'
	}).then(function(quizes) {
		res.render('quizes/index.ejs', {
			quizes: quizes,
			errors: []
		});
	}).
	catch (function(error) {
		next(error);
	});
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show.ejs', {
		quiz: req.quiz,
		errors: []
	});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer.ejs', {
		quiz: req.quiz,
		respuesta: resultado,
		errors: []
	});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // crea objeto quiz
		{
			pregunta: "Pregunta",
			respuesta: "Respuesta",
			tema: "Tema"
		}
	);

	res.render('quizes/new.ejs', {
		quiz: quiz,
		errors: []
	});
};

// POST /quizes/create
exports.create = function(req, res) {
	
	var quiz = models.Quiz.build(req.body.quiz);

	quiz
		.validate()
		.then(function(err) {
			if (err) {
				res.render('quizes/new.ejs', {
					quiz: quiz,
					errors: err.errors
				});
			} else {
				quiz // save: guarda  en DB campos pregunta, respuesta y tema de quiz
				.save({
					fields: ["pregunta", "respuesta", "tema"]
				})
					.then(function() {
						res.redirect('/quizes');
					}); // Redirección HTTP (URL relativo) lista de preguntas
			}
		});
};

// GET /quizes/:quizId/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // Autoload de instancia de quiz

	res.render('quizes/edit.ejs', {
		quiz: quiz,
		errors: []
	});
};

// PUT /quizes/:quizId
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz
		.validate()
		.then(
			function(err) {
				if (err) {
					res.render('quizes/edit.ejs', {
						quiz: req.quiz,
						errors: err.errors
					});
				} else {
					req.quiz // save: guarda campos pregunta, respuesta y tema en la DB
					.save({
						fields: ["pregunta", "respuesta", "tema"]
					})
						.then(function() {
							res.redirect('/quizes');
						});
				} // Redirección HTTP a lista de preguntas (URL relativo)
			}
	);
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).
	catch (function(error) {
		next(error);
	});
};