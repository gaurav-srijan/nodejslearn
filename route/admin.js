const express = require('express');
const router = express.Router();
const {protect ,roleCheck} = require('./../middleware/auth');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controller/admin');
router.use(protect);
router.use(roleCheck('admin'));

  router.get('/admin/user' , getUsers);
  router.get('/admin/user' , createUser);

  router.get('/admin/user/:id' , getUser);
  router.put('/admin/user/:id' , updateUser);
  router.delete('/admin/user/:id' , deleteUser);

module.exports = router;
