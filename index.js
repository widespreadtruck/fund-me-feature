import {ethers} from './ethers-5.6.esm.min.js'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')

connectButton.onclick = connect
fundButton.onclick = fund

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    document.getElementById("connectButton").innerHTML = "You are connected!"
  } else {
    document.getElementById("connectButton").innerHTML = "Install MM"
  }
}

async function fund() {
  if (typeof window.ethereum !== "undefined") {
    //provider / connection to BChain
const provider = new ethers.providers.Web3Provider(window.ethereum)
console.log(provider)
//signer / wallet
const signer = provider.getSigner()
console.log(signer)
    //contract that we interact with
    // ^ ABI && Address
  }
}
