const express = require('express');
const router = express.Router();
const NasabahController = require('./nasabah-controller')

router.get('/', NasabahController.getAll);

router.post('/counts', NasabahController.getCountsByUser);
routes.post('/specific', NasabahController.getSpecificSales);
router.get('/:id', NasabahController.getById);
router.put('/:id', NasabahController.update);
router.delete('/:id', NasabahController.deleteNasabah);


module.exports = router;