//var sql = require('../js/sql.js');
var sql = require('../js/sql.js');

var assert = require('assert');

describe('character tokenizer', function() {
    var db;
    before(function() {
      db = new sql.Database();
    });

    it('should create simple fts4', function() {
      db.exec('CREATE VIRTUAL TABLE t2 USING fts4(content TEXT);');
    })

    it('should create a new fts4 table with a tokenize=character', function() {
        //console.log(db);
        db.register_character_tokenizer(null);
        db.exec('CREATE VIRTUAL TABLE t1 USING fts4(content TEXT,tokenize=character);');
    });


    it('should allow phrase queries to match substrings', function() {
      db.exec('insert into t1 values ("aaabbbccc")');
      db.exec('insert into t1 values ("vvv aaabbbccc")');
      db.exec('insert into t1 values ("aaazzzccc")');

      var res = db.exec('select * from t1 where t1 match \"bbb\"');
      assert.deepEqual(res,[{"columns":["content"],"values":[["aaabbbccc"],["vvv aaabbbccc"]]}]);

      res = db.exec('select * from t1 where t1 match \"ccc\"');
      assert.deepEqual(res,[{"columns":["content"],"values":[["aaabbbccc"],["vvv aaabbbccc"],["aaazzzccc"]]}]);
    })

    it('should allow some more phrase queries to match substrings', function() {

      var res = db.exec('select * from t1 where t1 match \"aaa\"');
      assert.deepEqual(res,[{"columns":["content"],"values":[["aaabbbccc"],["vvv aaabbbccc"],["aaazzzccc"]]}]);
    })

});
