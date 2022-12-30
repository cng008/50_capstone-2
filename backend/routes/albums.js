'use strict';

/** Routes for songs. */

const jsonschema = require('jsonschema');
const express = require('express');

const { BadRequestError } = require('../expressError');
// const { ensureLoggedIn } = require('../middleware/auth');
const Album = require('../models/album');

const albumNew = require('../schemas/albumNew.json');
const albumSearch = require('../schemas/albumSearch.json');

const router = express.Router({ mergeParams: true });

/** POST / { album } => { album }
 *
 * Album should be { name, image }
 *
 * Returns { id, name, handle, image }
 *
 * Authorization required: none
 */

router.post('/', async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, albumNew);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const album = await Album.add(req.body);
    return res.status(201).json({ album });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { albums: [ { id, name, handle, image }, ...] }
 *
 * Authorization required: none
 */

router.get('/', async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, albumSearch);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const albums = await Album.findAll();
    return res.json({ albums });
  } catch (err) {
    return next(err);
  }
});

/** GET /[albumId] => { album }
 *
 * Returns { id, name, handle, duration_ms, date_added, artist_id, album_id, image }
 *   where album is { id, name, handle, artist_id, release_date, image }
 *   where artist is { id, name, handle, image }
 *
 * Authorization required: none
 */

// router.get('/:id', async  (req, res, next) =>{
//   try {
//     const album = await Album.get(req.params.id);
//     return res.json({ album });
//   } catch (err) {
//     return next(err);
//   }
// });

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization required: none
 */

// router.delete('/:handle', async  (req, res, next) =>{
//   try {
//     await Album.remove(req.params.handle);
//     return res.json({ deleted: +req.params.handle });
//   } catch (err) {
//     return next(err);
//   }
// });

module.exports = router;
