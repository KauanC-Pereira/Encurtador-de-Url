const express = require('express');
const router = express.Router();
const sequelize = require('../config/sequelize');
const LinkModel = require('../models/link');
const Link = LinkModel(sequelize);

sequelize.sync();

router.get('/:code/hits', async (req, res, next) => {
  const code = req.params.code;
  const resultado = await Link.findOne({ where: { code } });

  if (!resultado) return res.sendStatus(404);
  res.json(resultado);
});

router.get('/:code/stats', async (req, res, next) => {
  const code = req.params.code;
  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);
  res.render('stats', resultado.dataValues);
});

router.get('/:code', async (req, res) => {
  const code = req.params.code;

  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);

  resultado.hits++;
  await resultado.save();

  res.redirect(resultado.url);
});

router.get('/', async (req, res, next) => {
  const links = await Link.findAll();
  const topLinks = await Link.findAll({
    order: [['hits', 'DESC']],
    limit: 10
  });
  res.render('index', { title: 'Encurtador', links, topLinks });
});

function generateCode() {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

router.post('/new', async (req, res, next) => {
  const url = req.body.url;
  const code = generateCode();

  const resultado = await Link.create({
    url,
    code
  });

  res.redirect('/');
});

router.post('/:id/delete', async (req, res, next) => {
  const resultado = await Link.findByPk(req.params.id);

  if (!resultado) return res.sendStatus(404);

  await resultado.destroy();
  res.redirect('/');
});

router.get('/:id/edit', async (req, res, next) => {
  const resultado = await Link.findByPk(req.params.id);

  if (!resultado) return res.sendStatus(404);

  res.render('edit', { link: resultado });
});

router.post('/:id/update', async (req, res, next) => {
  const { url } = req.body;
  const resultado = await Link.findByPk(req.params.id);

  if (!resultado) return res.sendStatus(404);

  resultado.url = url;
  await resultado.save();

  res.redirect('/');
});

module.exports = router;
