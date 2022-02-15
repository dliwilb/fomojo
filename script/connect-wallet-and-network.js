// connectWalletAndNetwork.js
// connect wallet and switch network

let isWalletConnected = false;
let isNetworkConnected = false;
let connected0xAccount = '';

async function connectWallet() {

    if (window.ethereum) {
        try {
            connected0xAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });
            isWalletConnected = true;
            console.log(`log: wallet connected to ${connected0xAccount}`);
        }
        catch (error) {
            if (error.code === 4001) {
                isWalletConnected = false;
                console.log('log: connection rejected by user');
            }

            isWalletConnected = false;
            console.log('log: cannot connect to wallet');
        }
    }

}

async function switchNetwork(){
 
    // const chainIdTo = '0x2710';
    // const chainIdToName = 'smartBCH';
    const chainIdTo = '0x4';
    const chainIdToName = 'Testnet Rinkeby';

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdTo }],
        });

        isNetworkConnected = true;
        console.log(`log: switched to ${chainIdToName}`);
    }
    catch (error) {
        if (error.code === 4001) {
            console.log(`log: user rejected network switch to ${chainIdToName}`);
        }

        console.log(`log: cannot switch to ${chainIdToName}`);
        console.log(isWalletConnected);
        console.log(isNetworkConnected);
    }    
}