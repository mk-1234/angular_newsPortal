module.exports=function(express,pool, jwt, secret){

  const apiRouter = express.Router();

  apiRouter.get('/', function(req, res) {
    console.log('Welcome to API!');
    res.json({ message: 'Welcome to API!' });
  });

  apiRouter.use(function(req, res, next){
    const token = req.body.token || req.params.token || req.headers['x-access-token'] || req.query.token;

    if (token){
      jwt.verify(token, secret, function (err, decoded){
        if (err){
          return res.status(403).send({
            success:false,
            message:'Wrong token'
          });
        } else {
          req.decoded=decoded;
          next();
        }
      });
    } else {
      next();
    }
  });


  // --- NEWS ---

  apiRouter.route('/news')

  .get(function(req, res) {
    pool.getConnection(function(err, conn) {
      if (err) {
        console.log('error in get news!');
        throw err;
      }
      let qr = 'SELECT * FROM news';
      conn.query(qr, (err, result) => {
        if (err) {
          console.log('error in get query --> ', err);
        }
        conn.release();
        if (result == null) {
          res.send({message: 'no results'});
        } else {
          res.send({message: 'all news', data: result});
        }
      });
    });
  })

  .post((req, res) => {
    delete req.body._id;
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in news post --> ', err);
        throw err;
      }
      let qr = 'INSERT INTO news SET ?';
      conn.query(qr, req.body, (err, result) => {
        if (err) {
          console.log('error in insert news --> ', err);
        }
        conn.release();
        res.send({message: 'inserted data', id: result.insertId});
      });
    });
  })

  .put((req, res) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in news put --> ', err);
        throw err;
      }
      conn.query(
        'UPDATE news SET author = ?, title = ?, category = ?, summary = ?, timestamp = ?, article = ?, photo = ? WHERE _id = ?', [
          req.body.author, req.body.title, req.body.category, req.body.summary,  req.body.timestamp,
          req.body.article, req.body.photo, req.body._id], (err, result) => {
            if (err) {
              console.log('error in update news --> ', err);
            }
            conn.release();
            res.send({message: 'completed update', affected: result.affectedRows});
          });
    });
  });

  apiRouter.route('/news/:id')

  .get((req, res) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in get id news');
        throw err;
      }
      let qr = 'SELECT * FROM news WHERE _id = ?';
      conn.query(qr, req.params.id, (err, result) => {
        if (err) {
          console.log('error in get id query --> ', err);
        }
        conn.release();
        if (result.length == 0) console.log('no results!');
        else res.send({message: 'news from id', data: result});
      });
    });
  })

  .delete((req, res) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in delete news');
        throw err;
      }
      let qr = 'DELETE FROM news WHERE _id = ?';
      conn.query(qr, req.params.id, (err, result) => {
        if (err) {
          console.log('error in delete query --> ', err);
        }
        conn.release();
        res.send({message: 'finished deleting'});
      });
    });
  });


  // --- USERS ---

  apiRouter.route('/users')

  .get(function(req, res) {
    pool.getConnection(function(err, conn) {
      if (err) {
        console.log('error in get users!');
        throw err;
      }
      let qr = 'SELECT * FROM users';
      conn.query(qr, (err, result) => {
        if (err) {
          console.log('error in get query --> ', err);
        }
        conn.release();
        if (result == null) {
          res.send({message: 'no results'});
        } else {
          res.send({message: 'all users', data: result});
        }
      });
    });
  })

  .put((req, res) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in users put --> ', err);
        throw err;
      }

      conn.query(
        'UPDATE users SET username = ?, firstname = ?, lastname = ?, email = ?, level = ? WHERE _id = ?', [
          req.body.username, req.body.firstname, req.body.lastname,
          req.body.email, req.body.level, req.body._id], (err, result) => {
            if (err) {
              console.log('error in update users --> ', err);
            }
            conn.release();
            res.send({message: 'completed update', affected: result.affectedRows});
          });

    });
  });

  apiRouter.route('/users/:id')

  .get((req, res) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in get id users');
        throw err;
      }
      let qr = 'SELECT * FROM users WHERE _id = ?';
      conn.query(qr, req.params.id, (err, result) => {
        if (err) {
          console.log('error in get id query --> ', err);
        }
        conn.release();
        if (result.length == 0) console.log('no results!');
        else res.send({message: 'users from id', data: result});
      });
    });
  })

  .delete((req, res) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in delete users');
        throw err;
      }
      let qr = 'DELETE FROM users WHERE _id = ?';
      conn.query(qr, req.params.id, (err, result) => {
        if (err) {
          console.log('error in delete query --> ', err);
        }
        conn.release();
        res.send({message: 'finished deleting'});
      });
    });
  });


  // --- COMMENTS ---

  apiRouter.route('/comments')

  .get((req, res) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in get comments!');
        throw err;
      }
      let qr = 'SELECT * FROM comments';
      conn.query(qr, (err, result) => {
        if (err) {
          console.log('error in get query --> ', err);
        }
        conn.release();
        if (result == null) {
          res.send({message: 'no results'});
        } else {
          res.send({message: 'all comments', data: result});
        }
      });
    });
  })

  .post((req, res) => {
    delete req.body._id;
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in comments post --> ', err);
        throw err;
      }
      let qr = 'INSERT INTO comments SET ?';
      conn.query(qr, req.body, (err, result) => {
        if (err) {
          console.log('error in insert comments --> ', err);
        }
        conn.release();
        res.send({message: 'inserted data', id: result.insertId});
      });
    });
  })

  .put((req, res) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in comments put --> ', err);
        throw err;
      }
      conn.query(
        'UPDATE comments SET _idNews = ?, _idUser = ?, timestamp = ?, comment = ? WHERE _id = ?', [
          req.body._idNews, req.body._idUser, req.body.timestamp, req.body.comment, req.body._id], (err, result) => {
            if (err) {
              console.log('error in update comments --> ', err);
            }
            conn.release();
            res.send({message: 'completed update', affected: result.affectedRows});
          });
    });
  });

  apiRouter.route('/comments/:id')

  .get((req, res) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in get id comments');
        throw err;
      }
      let qr = 'SELECT * FROM comments WHERE _id = ?';
      conn.query(qr, req.params.id, (err, result) => {
        if (err) {
          console.log('error in get id query --> ', err);
        }
        conn.release();
        if (result.length == 0) console.log('no results!');
        else res.send({message: 'comments from id', data: result});
      });
    });
  })

  .delete((req, res) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('error in delete comments');
        throw err;
      }
      let qr = 'DELETE FROM comments WHERE _id = ?';
      conn.query(qr, req.params.id, (err, result) => {
        if (err) {
          console.log('error in delete query --> ', err);
        }
        conn.release();
        res.send({message: 'finished deleting'});
      });
    });
  });

  apiRouter.get('/me', function (req, res) {
    res.send({status:200, user:req.decoded});
  });

  return apiRouter;
}
