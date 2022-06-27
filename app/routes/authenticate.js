

module.exports=function(express, pool, jwt, secret, crypto){

    let authRouter = express.Router();

    authRouter.post('/', async function(req, res){

      pool.getConnection(async function(err, conn) {
        if (err) {
          console.log('error in post auth');
          throw err;
        }
        let nmbOfResults = 0;
        conn.query('SELECT * FROM users WHERE username = ?', req.body.username, function(err, result) {

          nmbOfResults = result.length;
          if (result.length == 0) {
            if (req.body.email) {
              delete req.body._id;

              let salt = crypto.randomBytes(128).toString('base64');
              let hash = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64, 'sha512');

              req.body.password = hash.toString('hex');
              req.body.salt = salt;

              conn.query('INSERT INTO users SET ?', req.body, function(err__, result__) {

                conn.release();
                if (err__) {
                  console.log('error in post users');
                }
                res.json(result__.insertId);
              });


            } else {
              res.json({status: 'NOT OK', description: 'Username does not exist!'});
            }
          } else {
            if (req.body.email != undefined) {
              res.json({status: 'NOT OK', description: 'User already exists.'});
            } else {
              let compare = false;

              if (result[0].salt) {
                let hash = crypto.pbkdf2Sync(req.body.password, result[0].salt, 10000, 64, 'sha512');
                compare = hash.toString('hex') == result[0].password;
              }

              if (compare) {
                const token = jwt.sign({
                  _id: result[0]._id,
                  username: result[0].username,
                  firstname: result[0].firstname,
                  lastname: result[0].lastname,
                  email: result[0].email,
                  level: result[0].level
                }, secret, {
                  expiresIn: 1440
                });
                res.json({status: 200, token: token, user: result[0]});
              } else {
                res.json({status: 150, description: 'Wrong password!'});
              }
            }
          }
        });
      });
    });

    return authRouter;

};
