const sequelize = require('../config/sequelize');
var express = require('express');
var router = express.Router();
const LinkModel = require('../models/link');
const Link = LinkModel(sequelize)
const { where, DataTypes } = require('sequelize');
const link = require('../models/link');

const db = {
  Link,
  sequelize
}

module.exports = db

router.get('/:code/hits', async (req, res, next) =>{
  const code = req.params.code;
  
  const resultado = await Link.findOne({where: {code}});
  if(!resultado) return res.sendStatus(404);
  
  resultado.hits++;
  await resultado.save();

  res.redirect(resultado.url);
})

router.get('/:code/stats', async (req,res ,next) =>{
  const code= req.params.code;
  const resultado = await Link.findOne({where: {code}});
  if(!resultado) return res.sendStatus(404);
  res.render('stats',resultado.dataValues);
})

router.get('/:code', async (req, res) => {
  const code = req.params.code;
  const resultado = await Link.findOne({where: {code}});

  const encontra = res.json(resultado);
  return encontra;
 
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Encurtador' });
});

function generateCode(){
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for(let i=0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text
}

router.post('/new', async (req, res, next) => {
  const url = req.body.url;
  const code = generateCode();

const resultado = await Link.create({
  url,
  code
})

  res.render('stats', resultado.dataValues);
})

router.delete('/:id/delete', async (req, res, next) => {
  const resultado = await Link.findByPk(req.params.id);

  if (!resultado) return res.sendStatus(404);

  await resultado.destroy();
  res.sendStatus(200); // Enviar uma resposta de sucesso
});

module.exports = router;