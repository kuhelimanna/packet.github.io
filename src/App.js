import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import Search from "./search";
//import Location from "./location";
import axios from "axios"

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Container,
  Col,
  Row,
  FormGroup,
  Label,
  Input,
  Button
  
} from "reactstrap";

import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as tt from "@tomtom-international/web-sdk-maps";

const MAX_ZOOM = 17;

function App(prop) {
  const mapElement = useRef();
  const[currlocation,setcurrlocation]=useState({});
  const [mapLongitude] = useState(null);
  const [mapLatitude] = useState(null);
  const [map, setMap] = useState({});
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);
  const [Acc, setAcc] = useState(false);
  const [toggle, setToggle] = useState(false);
  
  const [mapZoom,setMapZoom] = useState(13);
  const color = App.markerColor ?? '#FF0000';
  const [markerText ] = useState(App.markerText ?? 'Current location');
  //const style = prop.style ?? 'basic_main';

  const handleClick = () => {
    
    setToggle(!toggle);
    updateMap(toggle); 
     //moveMap();
       
      
  };

  const increaseZoom = () => {
    if (mapZoom < MAX_ZOOM) {
      setMapZoom(mapZoom + 1);
    }
  };

  const decreaseZoom = () => {
    if (mapZoom > 1) {
      setMapZoom(mapZoom - 1);
    }
  };


var moveMap=(Lng,Lat) =>{
  map.flyTo({
    center:[Lng,Lat],
    zoom:14
  })
}


var successHandler=function(position){
  setStatus('Locating...');
  
    setStatus(null);
    setLat(position.coords.latitude);
    setLng(position.coords.longitude);
    setAcc(position.coords.accuracy);
    if(position.coords.accuracy>40){
    setStatus("The GPS accuracy is Low");
    }else{
      setStatus("The GPS accuracy is HIGH");
    }

}
var errorHandler= function(errorObj){
  setStatus('Unable to retrieve your location');
  alert(errorObj.code +":"+errorObj.message);
  getlocation();

}
const getlocation = async() => {
  const location=await axios.get("http://ipapi.co/json");
  setcurrlocation(location.data);
  setLat(currlocation.latitude);
  setLng(currlocation.longitude);
  setAcc(currlocation.accuracy);


}
  const getLocation = () => {
    
      navigator.geolocation.getCurrentPosition( successHandler,errorHandler,
        {enableHighAccuracy:true,
        
            accuracy:{
          android:'high',
          ios:'bestForNavigation'
        },
        
        timeout:35000,
        maximumAge:1000,distanceFilter:10,
      }
      );
    }
    

  
  
 
  // Function for adding a marker on the map
  const addMarker = () => {
    const targetCoordinates = [lng, lat];

    const marker = new tt.Marker({
      color: color
    })
      .setLngLat(targetCoordinates)
      .addTo(map);

    var popupOffsets = {
      top: [0, 0],
      bottom: [0, -50],
      left: [25, -35],
      right: [-25, -35],
    };

    var popup = new tt.Popup({
      offset: popupOffsets,
    }).setHTML(markerText);

    marker.setPopup(popup);
    marker.togglePopup();
  };


  const updateMap = (toggle) => {
    if(toggle){
     // map.setCenter([parseFloat(mapLongitude), parseFloat(mapLatitude)]);
     // map.setZoom(mapZoom);
     moveMap(mapLongitude,mapLatitude);
      addMarker();
    }
    else{
     // map.setCenter([parseFloat(lng), parseFloat(lat)]);
     // map.setZoom(mapZoom);
     getLocation();
     moveMap(lng,lat);
      addMarker();

    }
    
  };
  const updateMaps2 = () => {
    map.setCenter([parseFloat(lng), parseFloat(lat)]);
    map.setZoom(mapZoom);
    addMarker();
  };

  useEffect(() => {
    
    let map = tt.map({
      /* 
      This key will API key only works on this Stackblitz. To use this code in your own project,
      sign up for an API key on the TomTom Developer Portal.
      */
     
      key: "lA2ONWjNjuFjGxJC4oAlV2IQJrgTpAXi",
      container: mapElement.current,
      center: [mapLongitude,mapLatitude],
      //style: 'tomtom://vector/1/basic-main',

      zoom: 12,
      language: "en-GB",
    });
  
    
    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());
    
    setMap(map);
    
   
    getLocation();
    return () => map.remove();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Col xs="2" className="update">
            <h4>Map Controls</h4>
            <FormGroup>
              <Label for="longitude">Longitude</Label>
              <Input
                type="text"
                name="longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            
              <Label for="latitude">Latitude</Label>
              <Input
                type="text"
                name="latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </FormGroup>
            
              <Row className="updateButton">
                <button color="primary" onClick={updateMaps2}>
                  Update Map
                </button>
              </Row>
            </Col>
      
      
     
      <Container className="mapContainer">
       
          <div>
            
          <label class="switch">My current location
            <input type="checkbox"  onClick={handleClick} class="btn btn-warning mb-5" />
            
            <span class="slider round"> </span>
            
            </label>
            
          </div>
          
          <Row>
          <ul class="list-group" style={{ display: toggle ? 'block' : 'none' }}>
            <p>{status}</p>
            {lat && <p>Latitude: {lat}</p>}
            {lng && <p>Longitude: {lng}</p>}
            {Acc && <p>Accuracy: {Acc}</p>}
  
          </ul>
          
        
            <div ref={mapElement}  className="mapDiv" />
          
          
        </Row>
        
      </Container>
    </div>
  );
}

export default App;
