const express = require('express');
const router = express.Router();
const folderServices = require('./folderServices');
const xss = require('xss');
router.use(express.json());

const serializeFolder = (folder) => ({
  id: folder.id,
  name: xss(folder.name)
});


router
  .route('/folders')
  .get((req, res, next) => {
    folderServices
      .getAllFolders(req.app.get('db'))
      .then((folders) => {
        res.json(folders.map(serializeFolder));
      })
      .catch(next);
  })
  .post((req, res) => {
    let { name } = req.body;
    if (!name) {
      return res.status(400).send('Name is required');
    }
    let newFolder = {
      name
    };
    folderServices
      .insertFolder(req.app.get('db'), newFolder)
      .then((folder) => {
        res.status(201)
          .location(`http://localhost/folders${folder.id}`)
          .json({ id: folder.id });
      });
  });
