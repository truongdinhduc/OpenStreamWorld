import './index.css';
import {BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Nft_marketplace from './pages/Nft_marketplace';
import CreatNFT from './pages/CreateNFT.js';
import { useState } from 'react';

function App() {
  const [accountAddress, setAccountAddress] = useState("");

  async function connectWallet(){
    if (window.ethereum) {
      const addr = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccountAddress(String(addr));
    }
    else alert("Install metamask extension.")
  }

  window.ethereum.on('accountsChanged', async (accounts) => {
    setAccountAddress(accounts[0]);
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
            <Link to="/nft_marketplace" className='link'>NFT Marketplace</Link>
            <Link to="/createNFT" className='link'>Create</Link>
            {
              accountAddress === ""?
              <button className='connect-wallet-btn' onClick={connectWallet}>
                Connect Wallet
              </button>
              :
              <Link to="" className='link'>
                <i className="fa fa-user-circle-o" style={{fontSize:"20px"}}></i>
                {" "+accountAddress.slice(0,5)+"..."+accountAddress.slice(-4)}
              </Link>
            }
          </nav>
        </div>
      </div>
      <Routes> 
        <Route path="" element={<Home />} /> 
        <Route path="nft_marketplace" element={<Nft_marketplace accAddr={accountAddress}/>}/> 
        <Route path="createNFT" element={<CreatNFT accAddr={accountAddress}/>}/> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
