/**
* @file methodDecode
* Makes calling contracts easier, by adding the contracts to every instance of Web3.
* Changing the network is automatically dealt with.
* New way of using: web3.contract_name.method_name(parameters).call() or .send()
* @function addContract
*/

function addContract(name, abi, addresses) {
    Object.defineProperty(Web3.prototype, name, {
        get: function () {
            let web3 = this;
            let chainId = web3.currentProvider.chainId == "1" ? "0x1" : web3.currentProvider.chainId
            return new Proxy({}, {
                get: function (target, method) {
                    if (method == "address") {
                        return addresses[chainId];
                    }

                    return function (...params) {
                        let contract = new web3.eth.Contract(abi, addresses[chainId]);
                        return contract.methods[method](...params)
                    }
                }
            });
        }
    });
}

Web3.prototype.contract = function (abi_name, address) {
    return new this.eth.Contract(abis[abi_name], address);
}

/** 
* decoder
* @param defineProperty - Web3.prototype
* Add a decode method to all web3 instances
* To get the ABI decoder, use web3.decode.abi_name
*/

Object.defineProperty(Web3.prototype, "decode", {
    get: function () {
        let web3 = this;
        return new Proxy({}, {
            get: function (target, name) {
                let decoder = new Decoder(web3);
                decoder.addABI(abis[name]);
                return decoder;
            }
        });
    }
});
