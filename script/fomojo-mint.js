console.log("fomojo-mint.js loaded");

let isWalletConnected = false;
let isNetworkConnected = false;
// const nftContractAddress = '0xbd1DE8Eaa24e2Fec5325273E3a82739CC64E7344'; // picopix v1.1

async function onConnect() {

    await connectWallet();
    if (isWalletConnected == true){
        await switchNetwork();
        if (isNetworkConnected == true){
            await getMintFee();
        }
    }

}


async function connectWallet() {

    if (window.ethereum) {
        try {
            const connectedAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });
            isWalletConnected = true;
            document.getElementById('connected-address').value = connectedAccount;
            logToConsoleAndPage('log: wallet connected');
        }
        catch (error) {
            if (error.code === 4001) {
                logToConsoleAndPage('log: connection rejected by user');
            }

            logToConsoleAndPage('log: cannot connect to wallet');
        }
    }

}

async function switchNetwork(){
 
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4' }],
        });

        isNetworkConnected = true;
        logToConsoleAndPage('log: switched to Testnet Rinkeby');
    }
    catch (error) {
        if (error.code === 4001) {
            logToConsoleAndPage('log: user rejected network switch');
        }

        logToConsoleAndPage('log: cannot switch to Testnet Rinkeby');
        console.log(isWalletConnected);
        console.log(isNetworkConnected);
    }    
}


function logToConsoleAndPage(message){
    console.log(message);
    document.getElementById('js-log').innerHTML = message;
}


async function getMintFee(){
    const provider = ethers.getDefaultProvider(4);

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
        
    const nftMintFee = await contract.mintFee();
    document.getElementById('mint-cost').innerHTML = `${nftMintFee*1e-18} test-ETH per mint`;
}
// getMintFee();


async function mintFomojo() {

    if (document.getElementById('button-mint').innerHTML == 'Minted !'){
        document.getElementById('button-mint').innerHTML = 'MINT';

    } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        const nftMintFee = await contract.mintFee();
        const mintQuantity = document.getElementById('mint-quantity').value;
            
        document.getElementById('button-mint').innerHTML = 'Commiting Mint...';
        const txCommitMint = await contract.commitMint(mintQuantity, 
            { value: nftMintFee * mintQuantity });
        const receiptCommitMint = await txCommitMint.wait();
        const mintedTokenId = receiptCommitMint.events[0].args[2].toNumber();
        console.log(receiptCommitMint);
        console.log(mintedTokenId);

        document.getElementById('button-mint').innerHTML = 'Executing Mint...';
        const txExecuteMint = await executeMint(`https://dliwilb.herokuapp.com/mint?tokenID=${mintedTokenId}`);
        // const receiptExecuteMint = await txExecuteMint.wait();
        console.log(txExecuteMint);

        document.getElementById('button-mint').innerHTML = 'Minted !';
    }

    // http://127.0.0.1:3000/mint?tokenID=1
}


async function executeMint(api_uri) {
	// let response = await fetch(api_uri, {mode: 'no-cors'});
    let response = await fetch(api_uri, {mode: 'cors'});
	
	if (!response.ok) {
	    throw new Error(`HTTP error! status: ${response.status}`);
	}
	
	let myJSON = await response.json();
	
    // console.log(response);
    // console.log(myJSON);

	return myJSON;
}