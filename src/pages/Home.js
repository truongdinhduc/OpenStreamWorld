import { Link } from 'react-router-dom';

function Home(){
    return (
        <div className="nft-page">
            <div className="nft-intro flex-space-around">
                <div className="slogan">
                    <h1>Discover, collect, and sell extraordinary NFTs</h1>
                    <p>OpenSea is the world's first and largest NFT marketplace</p>
                    <div className="flex-left">
                        <Link className="explore-btn" to="/nft_marketplace">Explore</Link>
                        <Link className="create-btn" to="/createNFT">Create</Link>
                    </div>
                </div>
                <div className="intro-img"> 
                    <img alt="Opensea" src="https://lh3.googleusercontent.com/ww-PqtSiBG7aCNk4lAqw-ibenlcLKdmqsoCXenDDDagM2W9rQHoDVVzAoQBe9QQhElfy44G5u77ujePfWL8WtUkV05f_bAo6BR7Q=s550" />
                </div>
            </div>
        </div>
    )
}
export default Home;