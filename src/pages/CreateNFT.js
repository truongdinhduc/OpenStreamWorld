import { useState } from 'react'
import { ethers }  from 'ethers'
import { NFTStorage} from 'nft.storage'
import AddProperty from './components/Add_property'

const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQ5MzJiODlDOTBFMzY4M0JFMzVCNEQwQTdmZUZDNDliZmZFOGM0N2UiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1Njg0MTk0MTU2OCwibmFtZSI6Ik5GVCBBUEkgZXkifQ.aS9ZBecOQxRaKGERi_ZTrV1hn_PNfTEY0Euj1w7mLOk'

const contractAddr = require("../contracts_infomation/nft_contract_addr.json");
const contractABI = require("../contracts_infomation/nft_contract_abi.json");

function CreatNFT(props){
    const [inputs, setInputs] = useState({});
    const [isCreating, setIsCreating] = useState(false)
    const [isAddingProperty, setIsAddingProperty] = useState(false)
    const [properties, setProperties] = useState([])
    const [isFileLoaded, setIsFileLoaded] = useState(false)

    const handleChange = (event) => {
        setInputs({...inputs, [event.target.name]: event.target.value,});
    }

    async function getImgaeFromUrl(imageUrl){
        const r = await fetch(imageUrl)
        if (!r.ok) {
            throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`)
        }
        return r.blob()
    }

    async function handleSubmit(event){
        event.preventDefault()
        setIsCreating(true)
        const uploadedImage = document.getElementById('display-img')
        const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })
        const image = await getImgaeFromUrl(uploadedImage.src)
        const tokenUri = await nftstorage.store(
            {
                name: inputs.name,
                description: inputs.description,
                image,
                attributes: properties
            }
        )
        const _tokenUri = "https://ipfs.io/ipfs/" + String(tokenUri.url).slice(7)
        console.log(_tokenUri)
        mint(String(_tokenUri))
    }

    async function mint(tokenUri){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nft_contract = new ethers.Contract(contractAddr, contractABI, signer);

        const tokenId = await nft_contract.mintTo(props.accAddr, tokenUri);
        setIsCreating(false)
        console.log(tokenId)
    }

    function handleFileUpload(event){
        var image = document.getElementById('display-img')
	    image.src = URL.createObjectURL(event.target.files[0])
        setIsFileLoaded(true)
    }

    function removeLoadedFile(event){
        document.getElementById('display-img').src=""
        document.getElementById('file-upload').value = null
        setIsFileLoaded(false)
    }

    function displayProperties(properties){
        return (
            <div className="flex-left">
                {
                    properties.map(x => 
                        <div className='property' key={x.trait_type}>
                            <div>{x.trait_type}</div>
                            <div style={{color:"rgb(85, 153, 213)", fontSize:"20px"}}>{x.value}</div>
                        </div>    
                    )
                }
                
            </div>
        )
    }

    return (
        <div className='flex-center'>
            <div>
                {props.accAddr===""?<h1>Connect to Your Wallet First</h1>:
                <form onSubmit={handleSubmit}>
                    <h1>Create New Item</h1>
                    <div className='small-field'>*Required fields</div>
                    
                    <div className='main-field'>Image, Video, Audio, or 3D Model</div>
                    <div className='small-field'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</div>
                    <div>
                        {!isFileLoaded&&<label className='file-upload-label' htmlFor='file-upload'><i className='fa fa-cloud-upload' style={{fontSize:"40px"}}></i></label>}
                        <input id="file-upload" type="file" hidden onChange={handleFileUpload}/>
                        <div className='flex-left'>
                            <img id="display-img" alt=""></img>
                            {isFileLoaded&&<div onClick={removeLoadedFile}><i className='fa fa-close'></i></div>}
                        </div>
                        
                        
                    </div>

                    <div style={{marginTop:"30px"}}>
                        <div className='main-field'>Name*</div>
                        <input className='text-input-field ' placeholder="Item name" type="text" name="name" onChange={handleChange} required></input>    
                    </div>

                    <div style={{marginTop:"30px"}}>
                        <div className='main-field'>External link</div>
                        <div className='small-field'>OpenSea will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.</div>
                        <input className='text-input-field ' placeholder="External link" type="text" name="externallink" onChange={handleChange}></input>    
                    </div>

                    <div style={{marginTop:"30px"}}>
                        <div className='main-field'>Description*</div>
                        <div className='small-field'>The description will be included on the item's detail page underneath its image. Markdown syntax is supported.</div>
                        
                        <input 
                            className='text-input-field ' 
                            placeholder="Provide a detailed description of your item." 
                            type="text" 
                            name="description" 
                            onChange={handleChange} 
                            required
                        /> 
                    </div>
                    <div style={{marginTop:"30px"}}>
                        <div className='main-field'>Properties</div>
                        <div className='small-field'>Textual traits that show up as rectangles.</div>
                        <div className='add-property' onClick={()=>{setIsAddingProperty(true)}}><i className='fa fa-plus' style={{fontSize:"20px", color:"rgb(86, 86, 255)"}}></i></div>
                        {isAddingProperty && <div className='backdrop' onClick={()=>{setIsAddingProperty(false); console.log(properties)}} />}
                        {isAddingProperty && <AddProperty setIsAdd={setIsAddingProperty} properties={properties}></AddProperty>}
                        {displayProperties(properties)}
                        
                    </div>
                    <div style={{borderBottom:"1px solid gray", margin:"20px 0 10px 0"}}></div>    

                    {isCreating?
                    <div className='loader'></div>:<button className='explore-btn' style={{border:"none"}} type="submit">Create</button>
                    }
                </form>
                }                      
            </div>
        </div>
    )
}

export default CreatNFT;