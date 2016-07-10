fs = require('fs');
co = require('co');

var readFile = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFile('./hi.txt');
  console.log(r1.toString());
  var r2 = yield readFile('./hello.txt');
  console.log(r2.toString());
};
var gen2 = function* (){
  var r1 = yield 1;
  console.log(r1.toString());
  var r2 = yield 2;
  console.log(r2.toString()); 
};

/*console.log('------------------run thunk-----------------');
run(gen);*/
console.log('------------------run co--------------------');
console.log('-----------gen------------');
co(gen);
console.log('-----------gen2-----------');
co(gen2);

function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    console.log('--------next in thunk----------');
    if (result.done) return;
    result.value(next);
  }

  next();
}
function thunkify(fn){
  return function(){
    var args = new Array(arguments.length);
    var ctx = this;

    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function(done){
      var called;

      args.push(function(){
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    };
  };
}
