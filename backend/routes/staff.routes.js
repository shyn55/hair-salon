const express = require('express');
const router = express.Router();
const {
    getWorkingHours, updateWorkingHours, bulkUpdateWorkingHours, addBreak, removeBreak
} = require('../controllers/staff.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

router.use(authenticate, requireAdmin);

router.get('/working-hours', getWorkingHours);
router.put('/working-hours/:id', updateWorkingHours);
router.put('/working-hours', bulkUpdateWorkingHours);
router.post('/breaks', addBreak);
router.delete('/breaks/:id', removeBreak);

module.exports = router;
