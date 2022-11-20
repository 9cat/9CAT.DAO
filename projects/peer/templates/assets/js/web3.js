'use strict'

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */


  

// Unpkg imports
const Web3Modal = window.Web3Modal.default
const WalletConnectProvider = window.WalletConnectProvider.default
const Fortmatic = window.Fortmatic
const evmChains = window.evmChains



// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider

// Address of the selected account
let selectedAccount

let web3Session

/**
 * Setup the orchestra
 */
function init() {
  console.log('Initializing example')
  console.log('WalletConnectProvider is', WalletConnectProvider)
  console.log('Fortmatic is', Fortmatic)
  console.log(
    'window.web3 is',
    window.web3,
    'window.ethereum is',
    window.ethereum,
  )

  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  // if(location.protocol !== 'https:') {
  //   // https://ethereum.stackexchange.com/a/62217/620
  //   const alert = document.querySelector("#alert-error-https");
  //   alert.style.display = "block";
  //   document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  //   return;
  // }

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Mikko's test key - don't copy as your mileage may vary
        // infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
        infuraId: '5dabcf25487f4c33b69531f2ecf0a04f',
      },
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // Mikko's TESTNET api key
        // key: "pk_test_391E26A3B43A3350"
        key: 'pk_live_18A627011F33AD0A',
      },
    },
  }

  web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  })

  if (web3Modal.cachedProvider) {
    // console.log("Web3Modal cachedProvider is", web3Modal.cachedProvider);
    onConnect()
  }

  console.log('Web3Modal instance is', web3Modal)
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {
  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider)

  console.log('Web3 instance is', web3)

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId()
  //const chainId = 70;

  // Load chain information over an HTTP API
  const chainData = evmChains.getChain(chainId)
  document.querySelector('#network-name').textContent = chainData.name

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts()

  // MetaMask does not give you all accounts, only the selected account
  console.log('Got accounts', accounts)
  selectedAccount = accounts[0]

  // const message = "helloworld";
  // // Sign message with Metamask (private key)
  // const signedMessage =  await web3.eth.personal.sign(
  //   message,
  //   selectedAccount
  // );
  // console.log("sign:", signedMessage);

  document.querySelector('#selected-account').textContent = selectedAccount



  // Get a handl
  const template = document.querySelector('#template-balance')
  const accountContainer = document.querySelector('#accounts')

  // Purge UI elements any previously loaded accounts
  accountContainer.innerHTML = ''

  // Go through all accounts and get their ETH balance
  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address)
    // ethBalance is a BigNumber instance
    // https://github.com/indutny/bn.js/
    const ethBalance = web3.utils.fromWei(balance, 'ether')
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4)
    // Fill in the templated row and put in the document
    const clone = template.content.cloneNode(true)
    clone.querySelector('.address').textContent = address
    clone.querySelector('.balance').textContent = humanFriendlyBalance
    accountContainer.appendChild(clone)
  })

  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  await Promise.all(rowResolvers)

  // Display fully loaded UI for wallet data
  document.querySelector('#prepare').style.display = 'none'
  document.querySelector('#connected').style.display = 'block'
}

/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {
  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  document.querySelector('#connected').style.display = 'none'
  document.querySelector('#prepare').style.display = 'block'

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector('#btn-connect').setAttribute('disabled', 'disabled')
  await fetchAccountData(provider)
  document.querySelector('#btn-connect').removeAttribute('disabled')
}

async function onSignMessage() {
  const message = '9CAT Community Personal Sign in Processing ID=' + Date.now()
  // Sign message with Metamask (private key)
  const web3 = new Web3(provider)
  const signedMessage = await web3.eth.personal.sign(message, selectedAccount)
  // const signedMessage = await web3.eth.sign(message, selectedAccount)

  console.log('sign:', signedMessage)

  const verifyJSON = JSON.stringify({
    a: selectedAccount,
    m: message,
    s: signedMessage, //'i am dump',//
  })

  console.log('verifyJSON:', verifyJSON)

  // const settings = {
  //   mode: 'cors',
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': 'https://master.9cat.work',
  //   },
  //   body: verifyJSON,
  // }

  // try {
  //   const fetchResponse = await fetch(
  //     `https://master.9cat.work/session`,
  //     settings,
  //   )
  //   const data = await fetchResponse.json()

  //   console.log('reps data:', data)
  //   web3Session = data.session
  //   console.log('session:', web3Session)
  //   document.querySelector('#wechat-session').textContent = web3Session

  //   var encrypted = CryptoJS.AES.encrypt('Message', web3Session)

  //   console.log('encrypted:', encrypted.toString())
  // } catch (e) {
  //   console.log('get session err:', e)
  //   return e
  // }

  

axios.defaults.headers.post['Content-Type'] =  'application/json; charset=UTF-8'
// axios.defaults.headers.post['Access-Control-Allow-Origin'] =  '*'
axios.defaults.headers.post['Access-Control-Allow-Headers'] =  'access-control-allow-origin, access-control-allow-headers'
// axios.defaults.headers.post['Access-Control-Allow-Credentials'] =  'true'

// axios.defaults.headers.common['Access-Control-Allow-Origin'] =  '*'

console.log(axios.defaults.headers)
try {
    axios
   .post('https://dao.9cat.net/session/', {    //
        // .post('https://master.9cat.work/session/', {

        // Address: selectedAccount,
        // Message:message,
        // Signature:signedMessage,

        a: selectedAccount,
        m:message,
        s:signedMessage,

      })
      .then(function (response) {       
            console.log(`response:` , JSON.stringify(response))
            console.log('reps data :', response.data)      
            console.log('reps data verify:', response.data.verify)      
            console.log('reps data session:', response.data.session)  

            var element = document.getElementById('wechat-session');
            element.value ='@9cat '+response.data.session;

            // document.querySelector('input[name = "wechat-session"]').vaule = "wechat-session"
            // document.querySelector('input[name = "wechat-session"]').setAttribute('placeholder',  response.data.session)
            // document.querySelector('input[name = "wechat-session"]').textContent = response.data.session
      })
      .catch(function (error) {
        console.log(error)
      }) //end-axios
  } catch (err) {
    console.log(` catch error!`+err)
  }



  // let whoSigned1 = await web3.eth.accounts.recover(message, signedMessage)
  // console.log('whoSigned1:', whoSigned1)
}

async function onActionMessage() {
  const message = '{action:checkbalance,account:temple}'
  // const web3Session = '4ea8424745c586b91b28623934d0d0f8f5d983f8f1f2c7e3'

  const key = web3Session.substring(0, 15)

  // console.log('message :', message)
  // console.log('web3Session :', web3Session)
  // console.log('key :', key)

  // var encrypted = CryptoJS.AES.encrypt(message, web3Session)
  var encrypted = aseEncrypt(message, key)
  // console.log('encrypted :', encrypted)

  // console.log('action encrypted2:', encrypted)

  const actionJSON = JSON.stringify({
    a: selectedAccount,
    m: encrypted,
    // .ciphertext.toString(),
    // iv: encrypted.iv.toString(),
    // key: encrypted.key.toString(),
  })

  console.log('action JSON:', actionJSON)

  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: actionJSON,
  }


  try {
    const fetchResponse = await fetch(
      `https://master.9cat.work/action`,
      settings,
    )
    const data = await fetchResponse.json()

    console.log('reps data:', data)
  } catch (e) {
    console.log('do action err:', e)
    return e
  }

  // let whoSigned1 = await web3.eth.accounts.recover(message, signedMessage)
  // console.log('whoSigned1:', whoSigned1)
}

/**
 * Connect wallet button pressed.
 */
async function onConnect() {
  console.log('Opening a dialog', web3Modal)
  try {
    provider = await web3Modal.connect()
  } catch (e) {
    console.log('Could not get a wallet connection', e)
    return
  }

  // Subscribe to accounts change
  provider.on('accountsChanged', (accounts) => {
    fetchAccountData()
  })

  // Subscribe to chainId change
  provider.on('chainChanged', (chainId) => {
    fetchAccountData()
  })

  // Subscribe to networkId change
  provider.on('networkChanged', (networkId) => {
    fetchAccountData()
  })

  await refreshAccountData()
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {
  console.log('Killing the wallet connection', provider)

  // TODO: Which providers have close method?
  // if (provider.close) {
  // await provider.close();

  // If the cached provider is not cleared,
  // WalletConnect will default to the existing session
  // and does not allow to re-scan the QR code with a new wallet.
  // Depending on your use case you may want or want not his behavir.
  await web3Modal.clearCachedProvider()
  provider = null
  // }

  selectedAccount = null

  // Set the UI back to the initial state
  document.querySelector('#prepare').style.display = 'block'
  document.querySelector('#connected').style.display = 'none'
}

/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init()

  document.querySelector('#btn-connect').addEventListener('click', onConnect)

  document
    .querySelector('#sign-message')
    .addEventListener('click', onSignMessage)

  document
    .querySelector('#action-message')
    .addEventListener('click', onActionMessage)

  document
    .querySelector('#btn-disconnect')
    .addEventListener('click', onDisconnect)
})


//https://mojotv.cn/go/crypto-js-with-golang
//msg 需要被对称加密的明文
//key aes 对称加密的密钥  必须是16长度,为了和后端交互 key字符串必须是16进制字符串,否在给golang进行string -> []byte带来困难
function aseEncrypt(msg, key) {
  key = PaddingLeft(key, 16) //保证key的长度为16byte,进行'0'补位
  key = CryptoJS.enc.Utf8.parse(key)
  // console.log('key:', key)

  // 加密结果返回的是CipherParams object类型
  // key 和 iv 使用同一个值
  var encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: key,
    mode: CryptoJS.mode.CBC, // CBC算法
    padding: CryptoJS.pad.Pkcs7, //使用pkcs7 进行padding 后端需要注意
  })

  // console.log(' encrypted..iv:', encrypted.iv.toString(CryptoJS.enc.Hex))
  // console.log(' encrypted..key:', encrypted.key.toString())
  // console.log(' encrypted..salt:', encrypted.salt)

  // console.log(' encrypted:', encrypted.toString())

  // ciphertext是密文,toString()内传编码格式,比如Base64,这里用了16进制
  // 如果密文要放在 url的参数中 建议进行 base64-url-encoding 和 hex encoding, 不建议使用base64 encoding
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex) //后端必须进行相反操作
}
// 确保key的长度,使用 0 字符来补位
// length 建议 16 24 32
function PaddingLeft(key, length) {
  let pkey = key.toString()
  let l = pkey.length
  if (l < length) {
    pkey = new Array(length - l + 1).join('0') + pkey
  } else if (l > length) {
    pkey = pkey.slice(length)
  }
  return pkey
}
