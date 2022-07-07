import { useState, useEffect } from 'react'

const nftItem = (item, btnText, price) => {
    return (
    <div className='nft-item' key={item.id}>
        <div className='nft-img'>
            <img alt="" src={item.image_url} />
        </div>
        <div className='nft-name'>{item.name}</div>
        {price?<div className='nft-price'>
            <img src="https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png" style={{height:"20px", marginRight:"5px"}} alt=""/>
            {price/10**18}
        </div>:
        <div className='nft-price'>
            <img src="https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png" style={{height:"20px", marginRight:"5px"}} alt=""/>
            
        </div>
        }
        <div className='sell-now-btn'>
            <a href={price?item.permalink:item.permalink+"/sell"} target="_blank" rel="noreferrer" className='sell-now-link'>{btnText}</a>
        </div>
    </div>
    )
}

function Nft_marketplace(props){

    async function connectWallet(){
        if (window.ethereum) {
            const addr = await window.ethereum.request({ method: "eth_requestAccounts" });
            props.setAccountInfo({
                address: String(addr), 
                balance: 0,
            })
            return String(addr)
        }
        else alert("Install metamask extension.")
    }

    const [nftList, setNftList] = useState([])
    const [sellingNfts, setSellingNfts] = useState([])
    const [notSellingNfts, setNotSellingNfts] = useState([])

    async function getNftList(){
        const options = {method: 'GET'};
        //https://testnets-api.opensea.io/api/v1/assets?owner=0x05eD6b1C84e0D9Dd31322bC45bb37929535D59a9&order_direction=desc&offset=0&limit=20&include_orders=false
        const url = "https://testnets-api.opensea.io/api/v1/assets?owner=" + await connectWallet() + "&order_direction=desc&offset=0&limit=20&include_orders=true"
        
        await fetch(url, options)
        .then(response => response.json())
        .then(response => setNftList(response.assets))
        .catch(err => console.error(err));
        //console.log(nftList)
        setSellingNfts(nftList.filter((x)=>{
            return x.seaport_sell_orders != null
        }))

        setNotSellingNfts(nftList.filter((x)=>{
            return x.seaport_sell_orders == null
        }))
    }

    useEffect(() => {
        getNftList()
    }, );

    return (       
        <div className="nft-page">
            <div className='my-nft'>
                <h1>My Listing NFTs</h1>
                <div className='nft-list'>
                    {
                        sellingNfts.map(x => nftItem(x, "View Detail", x.seaport_sell_orders[0].current_price))
                    }
                </div>
            </div>   

            <div className='my-nft'>
                <h1>My NFTs</h1>
                <div className='nft-list'>
                    {
                        notSellingNfts.map(x => nftItem(x, "Sell Now", false))
                    }
                </div>
            </div>   
        </div>
    )
}
export default Nft_marketplace;