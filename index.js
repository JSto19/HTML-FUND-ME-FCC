// in nodejs
// require()

// in front-end javascript you can't use require
// import const { ethers } = require("")
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"
//import { resolveConfig } from "prettier"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = balance
withdrawButton.onclick = witdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({method: "eth_requestAccounts"})
        connectButton.innerHTML = "Connected!"
    } else {
        connectButton.innerHTML = "Please install metamask!"
    }
}

async function getBalance() {
    if(typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}
// fund
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}`)
        if (typeof window.ethereum !== "undefined") {
            // provider / connection to blockchain
            // signer / wallet / someone with gas
            // contract that we are interacting with
            // ^ ABI & Address       
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer) //?
            try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount)
            })
            // Wait for TX to finish
            await listenForTransactionMine(transactionResponse, provider)
        } catch(error) {
            console.log(error)
        }
    }
    
}
function listenForTransactionMine(transactionResponse, provider){
    console.log(`mining ${transactionResponse.hash}...`)
    //return new Promise()
    // Creates a listener for Blockchain
    // listen for finish transaction
    return new Promise((resolve, reject) => {
        provider.once( transactionResponse.hash , (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
     
}

// withdraw
async function withdraw() {
    if(typeof window.ethereum != "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer) 
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch {
            console.log(error)
        }
    }
}