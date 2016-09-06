/**
 * Created by Frederic Nieto on 06/09/2016.
 */

var possibleChars = `n0123456789\\"'{}()[]+-*/|^&><?:. `;
var fn = new Function("return 'lol'");
var x = fn();
console.log(x);
var strs = [{
    str: `return n;
`, val: testString(`return n;`)
}];

console.log("original: " + strs[0].val);

function oneGeneration() {
    var newstrs = [];
    strs.forEach((str) => {
        newstrs.push(str);
        var newstr = tryMutate(str.str);
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
        newstrs = newstrs.reverse().sort((a, b) => (a.val - b.val) ? (a.val - b.val) : (a.size - b.size)).slice(0, 100);
    }
    strs = newstrs;
}

var iter = 0;

function tryMutate(str) {
    while (true) {
        var mutated = mutate(str);
        try {
            var ret = (new Function("n", mutated))(1);
            if (!ret || typeof ret != 'number' || mutated == str) {
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
    for (var i = 0; i < Math.floor(Math.random() * 30); ++i) {
        a[Math.floor(Math.random() * a.length)] = "";
    }
    for (var i = 0; i < Math.floor(Math.random() * 5); ++i) {
        var newint = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        var newint2 = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        a[Math.floor(Math.random() * a.length)] += newint+newint2;
    }
    return a.join("").replace(/\/\//g, "").replace(/\/\//g, "");
}


function testString(str) {
    var fn = new Function("n", str);
    return test100(fn);
}

function test100(fn) {
    var ret;
    for (var i = 1; i < 100000; i *= 10) {
        var res = fn(i);
        var diff = Math.abs(Math.pow(res, 3) - i);
        if (ret)
            ret = Math.max(ret, diff);
        else
            ret = diff;
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