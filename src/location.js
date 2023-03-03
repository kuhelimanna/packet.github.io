import React from 'react';
import {useEffect,useState} from "react"
import axios from "axios"

const Location = () => {
    const[currlocation,setcurrlocation]=useState({});
    useEffect(()=>{
        getlocation();
    },[]);
    const getlocation = async() => {
        const location=await axios.get("http://ipapi.co/json");
        setcurrlocation(location.data);


    }
    return (
        <div>
            <h1>current Location</h1>
            <p>Latitude:{currlocation.latitude}</p>
            <p>Longitude:{currlocation.longitude}</p>
            <p>City:{currlocation.city}</p>
        </div>
    );
}

export default Location;
