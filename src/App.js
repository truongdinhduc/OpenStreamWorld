import './index.css';
import {BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Nft_marketplace from './pages/Nft_marketplace';
import CreatNFT from './pages/CreateNFT.js';
import { useState, useEffect } from 'react';
import { ethers }  from "ethers";

function App() {
  const [accountInfo, setAccountInfo] = useState({address: "", balance: 0});

  async function connectWallet(){
    if (window.ethereum) {
      const addr = await window.ethereum.request({ method: "eth_requestAccounts" });
      const bal = await window.ethereum.request({
        method: "eth_getBalance", 
        params: [addr[0], "latest"] 
      })
      setAccountInfo({address: String(addr), balance: ethers.utils.formatEther(bal)});
    }
    else alert("Install metamask extension.")
  }

  window.ethereum.on('accountsChanged', async (accounts) => {
    const addr = await window.ethereum.request({ method: "eth_requestAccounts" });
    const bal = await window.ethereum.request({
      method: "eth_getBalance", 
      params: [addr[0], "latest"] 
    })
    setAccountInfo({address: String(addr), balance: ethers.utils.formatEther(bal)});
  });

  return (
    <BrowserRouter>
      <div className='flex-left header'>
        <div className='flex-left '>
          <img alt="openstreamworld" src="https://static.opensea.io/Logos/opensea-pride.svg" className="logo"/>
          <div className='name'>OpenStreamWorld</div>
        </div>
        <div className='menu'>
          <nav>
            <Link to="" className='link'>Home</Link>
            {(accountInfo.address!=="")&&<Link to="/nft_marketplace" className='link'>NFT Marketplace</Link>}
            <Link to="/createNFT" className='link'>Create</Link>
            {
              accountInfo.address === ""?
              <button className='connect-wallet-btn' onClick={connectWallet}>
                Connect Wallet
              </button>
              :
              <Link to="" className='link'>
                <i className="fa fa-user-circle-o" style={{fontSize:"20px"}}></i>
                {" "+accountInfo.address.slice(0,5)+"..."+accountInfo.address.slice(-4)}
              </Link>
            }
          </nav>
        </div>
      </div>
      <Routes> 
        <Route path="" element={<Home />} /> 
        <Route path="nft_marketplace" element={<Nft_marketplace setAccountInfo={setAccountInfo}/>} /> 
        <Route path="createNFT" element={<CreatNFT accAddr={accountInfo.address}/>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
