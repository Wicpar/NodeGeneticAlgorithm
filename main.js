/**
 * Created by Frederic Nieto on 06/09/2016.
 */

var possibleChars = `n0123456789()!|^&. +-*/%`;
var fn = new Function("return 'lol'");
var x = fn();
console.log(x);
var strs = [{
    str: `return n
`, val: testString(`return n`)
}];

console.log("original: " + strs[0].val);

function oneGeneration() {
    var newstrs = [];
    strs.forEach((str) => {
        newstrs.push(str);
        var newstr = tryMutate(str.str, str.val);
        var res;
        try {
            res = testString(newstr);
            //console.log(res);
        } catch (e) {
            return;
        }
        //console.log(res);
        newstrs.push({str: newstr, val: res});
    });
    if (newstrs.length > 100) {
        if (strs[0].val) {
            newstrs = newstrs.reverse().sort((a, b) => (a.val - b.val) || (a.str.length - b.str.length)).slice(0, 100);
        } else {
            newstrs = newstrs.reverse().sort((a, b) => (a.val - b.val) || (a.str.length - b.str.length)).slice(0, 100);
        }
    }
    strs = newstrs;
}

var iter = 0;

function tryMutate(str, originVal) {
    while (true) {
        var mutated = mutate(str);
        try {
            var ret = (new Function("n", mutated))(1);
            if (!ret || typeof ret != 'number' || mutated == str || ret == originVal || mutated.lastIndexOf('n') < 6) {
                throw new EventException();
            }
            //console.log(ret);
        } catch (e) {
            iter = (iter || 0) + 1;
            if (!(iter % 100000)) {
                console.log("" + iter + '\n');
            }
            continue;
        }
        return mutated;
    }
}


function mutate(str) {
    var a = str.split("");
    for (var i = 0; i < Math.floor(Math.random() * (possibleChars.length - 6)); ++i) {
        a[Math.floor(Math.random() * a.length)] = "";
    }
    for (var i = 0; i < Math.floor(Math.random() * (possibleChars.length - 6)); ++i) {
        var newint = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        a[Math.floor(Math.random() * a.length)] += newint;
    }
    return a.join("").replace(/\/\//g, "").replace(/\/\//g, "").replace(/\/\*/g, "");
}


function testString(str) {
    var fn = new Function("n", str);
    return test100(fn);
}

function test100(fn) {
    var ret = 0;
    for (var i = -50; i < 50; i++) {
        var res = fn(i);
        var target = (i * i * i * i);
        var toAdd = Math.abs(Math.abs(target) - Math.abs(res));
        toAdd += (target != res);
        if (isNaN(toAdd))
            ret += 10000000000;
        else
            ret += toAdd;
    }
    return ret;
}

function testAlgorithm(fn, testValue, diffFn) {
    return diffFn(fn(testValue));
}
var generation = 0;
for (var i = 0; i < 1000000; ++i) {
    oneGeneration();
    generation = (generation || 0) + 1;
    console.log("generation: " + generation + '\n');
    console.log("START/////////////////\n" + strs[0].str + "\n/////\n" + strs[0].val + "\nEND///////////////////\n");

}
strs.forEach((elem) => {
    console.log("START/////////////////\n" + elem.str + "\n/////\n" + elem.val + "\nEND///////////////////\n");
});