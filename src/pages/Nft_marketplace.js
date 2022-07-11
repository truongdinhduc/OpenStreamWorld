import { useState, useEffect } from 'react'

const nftItem = (item, btnText, price, makeOffer=false) => {
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
            {makeOffer?<a href={item.permalink} target="_blank" rel="noreferrer" className='sell-now-link'>{btnText}</a>
            :<a href={price?item.permalink:item.permalink+"/sell"} target="_blank" rel="noreferrer" className='sell-now-link'>{btnText}</a>}
        </div>
    </div>
    )
}

function Nft_marketplace(props){

    const [nftList, setNftList] = useState([])
    const [sellingNfts, setSellingNfts] = useState([])
    const [notSellingNfts, setNotSellingNfts] = useState([])

    useEffect(() => {
        props.accAddr&&getNftList()
    }, );

    async function accountAddress(){
        return props.accAddr
    }

    async function getNftList(){
        const options = {method: 'GET'}
        const url = "https://testnets-api.opensea.io/api/v1/assets?owner=" + await accountAddress() + "&order_direction=desc&offset=0&limit=20&include_orders=true"
        
        await fetch(url, options)
        .then(response => response.json())
        .then(response => setNftList(response.assets))
        .catch(err => console.error(err))
        //console.log(nftList)

        setSellingNfts(nftList.filter((x)=>{
            return x.seaport_sell_orders != null
        }))

        setNotSellingNfts(nftList.filter((x)=>{
            return x.seaport_sell_orders == null
        }))
    }

    const [otherNFTs, setOtherNFTs] = useState([])

    async function searchNfts(event){
        event.preventDefault()

        const ownerAddr = document.getElementById("owner-address").value
        
        const options = {method: 'GET'}
        const url = "https://testnets-api.opensea.io/api/v1/assets?owner=" + ownerAddr + "&order_direction=desc&offset=0&limit=20&include_orders=true"
        
        await fetch(url, options)
        .then(response => response.json())
        .then(response => setOtherNFTs(response.assets))
        .catch(err => console.error(err))
        //console.log(otherNFTs)
    }

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

            <div className='my-nft'>
                <h1>Other NFTs</h1>
                <form onSubmit={searchNfts}>
                    <input type="text" placeholder="Owner address" id="owner-address"></input> 
                    <button type="submit" id="search-nft-btn"><i className='fa fa-search'></i></button>
                </form>
                <div className='nft-list'>
                    {
                        otherNFTs&&otherNFTs.filter((x)=>{return x.seaport_sell_orders != null}).map(x => nftItem(x, "Buy Now", x.seaport_sell_orders[0].current_price))
                    }
                    {
                        otherNFTs&&otherNFTs.filter((x)=>{return x.seaport_sell_orders == null}).map(x => nftItem(x, "Make Offer", false, true))
                    }
                </div>
            </div>   
        </div>
    )
}
export default Nft_marketplace;