'use strict';

var express = require('express');
var controller = require('./transaction.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/deleteAll', controller.deleteAll);
router.get('/:id', controller.show);
router.get('/searchByDate/:start/:end', controller.searchByDate);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;