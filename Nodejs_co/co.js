fs = require('fs');
co = require('co');

var readFile = thunkify(fs.readFile);

var readFile2 = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var r1 = yield readFile('./hi.txt');
  console.log(r1.toString());
  var r2 = yield readFile('./hello.txt');
  console.log(r2.toString());
};

var gen2 = function* (){
  var f1 = yield readFile2('./hi.txt');
  console.log(f1.toString());
  var f2 = yield readFile2('./hello.txt');  
  console.log(f2.toString());
};

/*console.log('------------------run thunk-----------------');
run(gen);
console.log('---------------------co-----------------------');
co(gen);*/
console.log('-----------------run2 promise-----------------');
run2(gen2);

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


function run2(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }

  next();
} 

function co(gen) {
  var ctx = this;

  //如果是generatorFunction,就执行 获得对应的generator对象
  if (typeof gen === 'function') gen = gen.call(this);

  //返回一个promise
  return new Promise(function(resolve, reject) {

    //初始化入口函数，第一次调用
    onFulfilled();

    //成功状态下的回调
    function onFulfilled(res) {
      var ret;
      try {
        //拿到第一个yield返回的对象值ret
        ret = gen.next(res);
      } catch (e) {
        //出错直接调用reject把promise置为失败状态
        return reject(e);
      }
      //开启调用链
      next(ret);
    }

    function onRejected(err) {
      var ret;
      try {
        //抛出错误，这边使用generator对象throw。这个的好处是可以在co的generatorFunction里面使用try捕获到这个异常。
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }


    function next(ret) {
      //如果执行完成，直接调用resolve把promise置为成功状态
      if (ret.done) return resolve(ret.value);
      //把yield的值转换成promise
      //支持 promise，generator，generatorFunction，array，object
      //toPromise的实现可以先不管，只要知道是转换成promise就行了
      var value = toPromise.call(ctx, ret.value);

      //成功转换就可以直接给新的promise添加onFulfilled, onRejected。当新的promise状态变成结束态（成功或失败）。就会调用对应的回调。整个next链路就执行下去了。
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);

      //否则说明有错误，调用onRejected给出错误提示
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, ' + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}

function isPromise(obj) {
  return 'function' == typeof obj.then;
}

