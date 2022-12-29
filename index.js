// import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")


connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw


async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    document.getElementById("connectButton").innerHTML = "You are connected!"
  } else {
    document.getElementById("connectButton").innerHTML = "Install MM"
  }
}

async function withdraw() {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
      // await transactionResponse.wait(1)
    } catch (error) {
      console.log(error)
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask"
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    //provider / connection to BChain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // console.log(provider)
    //signer / wallet
    const signer = provider.getSigner()
    // console.log(signer)
    //contract that we interact with
    const contract = new ethers.Contract(contractAddress, abi, signer)
    // console.log(contract)
    // ^ ABI && Address
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      // listen/wait for trx to be mined/finished
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done!")
    } catch (error) {
      console.log(error)
    }
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      const balance = await provider.getBalance(contractAddress)
      console.log(ethers.utils.formatEther(balance))
    } catch (error) {
      console.log(error)
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask"
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  // return new Promise()
  // listen/wait for trx to be mined/finished
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      try {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        )
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  })
}
