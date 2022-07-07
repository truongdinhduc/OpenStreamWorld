import { useState } from "react";

function AddProperty(props){
    const [property, setProperty] = useState({})

    const handleChange = (event) => {
        setProperty({...property, [event.target.name]: event.target.value,})
    }

    function addNewProperty(){
        props.setIsAdd(false)
        props.properties.push(property)
        console.log(props.properties)
    }

    return (
        <form className="add-property-form">
            <h2>Add Property</h2>
            <div className="small-field">
                Properties show up underneath your item, are clickable, and can be filtered in your collection's sidebar.
            </div>
            <div>
            <input 
                placeholder="Type" 
                name="trait_type" 
                className="text-input-field" 
                style={{margin:"20px", width:"200px"}} 
                type="text"
                onChange={handleChange}></input>
            <input 
                placeholder="Name" 
                name="value" 
                className="text-input-field" 
                style={{margin:"20px", width:"200px"}} 
                type="text"
                onChange={handleChange}></input>
            </div>
            <div className="add-property-btn" onClick={addNewProperty}>Add</div>  
        </form>
    )
}

export default AddProperty;