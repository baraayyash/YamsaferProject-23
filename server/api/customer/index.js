'use strict';

var express = require('express');
var controller = require('./customer.controller');

var router = express.Router();
//55726
router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/search/:id', controller.showbyname);
router.post('/', controller.create);
router.post('/getDataFromMixP', controller.getDataFromMixP);
router.get('/blocked/:id', controller.blocked);
router.post('/block', controller.block);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;