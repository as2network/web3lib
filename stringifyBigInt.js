/*
* @file stringifyBigInt
* @summary Add ability to serialize BigInt as JSON
*/ 

JSON.stringifyBigInt = function (obj) {
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'bigint') {
            return value.toString() + 'n';
        } else {
            return value;
        }
    })
}

JSON.parseBigInt = function (str) {
    return JSON.parse(str, (key, value) => {
        if (typeof value === 'string' && /^-?\d+n$/.test(value)) {
            return BigInt(value.slice(0, -1));
        }
        return value;
    })
}

objAssign = function (to, from) {
    if (window.Vue) {
        for (let i in from) {
            Vue.set(to, i, from[i]);
        }
    }
    else {
        Object.assign(to, from);
    }
}

rpcToObj = function (rpc_obj, obj) {
    if (!obj) {
        obj = {};
    }
    for (let i in rpc_obj) {
        if (isNaN(i)) {
            // Not always correct, but overall useful
            try {
                obj[i] = isNaN(rpc_obj[i]) || i.indexOf("name") != -1 || i.indexOf("symbol") != -1
                    || (typeof (rpc_obj[i]) == "boolean")
                    || (typeof (rpc_obj[i]) == "string" && rpc_obj[i].startsWith("0x"))
                    || (typeof (rpc_obj[i]) == "object")
                    ? rpc_obj[i]
                    : BigInt(rpc_obj[i]);
            } catch (e) {
                console.log('pcToObj error', rpc_obj[i], typeof(rpc_obj[i]))
            }
        }
    }
    return obj;
}
