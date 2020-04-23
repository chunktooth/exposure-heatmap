import React from 'react';
import sampleBatchMap from './sampleData/sampleBatchMap.json';
import { 
  Map as LeafletMap,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  Polyline
} from 'react-leaflet';
import { Icon } from 'leaflet';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      center: [5.3753, 35],
      zoom: [3],
      popupInfo: undefined
    }
  }

  setPopupInfo = (exposure) => {
    return this.setState({ popupInfo: exposure })
  }

  calculateDisplacementValue = (lat1, lon1, lat2, lon2) => {
      // generally used geo measurement function
      let R = 6378.137; // Earth radius in KM
      let dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
      let dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
      let a = Math.sin(dLat/2) * Math.sin(dLat/2) 
        + Math.cos(lat1 * Math.PI / 180) 
        * Math.cos(lat2 * Math.PI / 180) 
        * Math.sin(dLon/2) * Math.sin(dLon/2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      let d = R * c;
      return d * 1000; // To meters
  }

  calculateMidPoint = (lat1, lon1, lat2, lon2) => {
    return {
      lat: (lat1 + lat2) / 2,
      lon: (lon1 + lon2) / 2
    }
  }

  renderMarkers = (exp, exposure, falseCoords, displacementVal, polyline) => {
    const { popupInfo } = this.state;

    const icon1 = new Icon({
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-and-shapes-6/177800/262-512.png',
      iconSize: [15, 15]
    });
    const icon2 = new Icon({
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-and-shapes-6/177800/263-512.png',
      iconSize: [15, 15]
    });

    return <React.Fragment>
      <Marker
        icon={icon1}
        key={exp.properties.AddressLine}
        position={exposure}
        onClick={() => { 
          this.setPopupInfo(exp) 
        }}>

        <Polyline 
          positions={polyline} 
          color='red' />

        {
          popupInfo &&
          <Popup>
            <strong>{ popupInfo.properties.AddressLine }</strong>
            <p>{` ${exposure[0]}, ${exposure[1]} `}</p>
          </Popup>  
        }
      </Marker>
          
      <Marker
        icon={icon2}
        key={exp.properties.AddressLine}
        position={falseCoords}
        onClick={() => { 
          this.setPopupInfo(exp) 
        }}>

        {
          popupInfo &&
          <Popup>
            <strong>{`Displacement Value ${displacementVal} m`}</strong>
            <p>{`${falseCoords[0]}, ${falseCoords[1]} `}</p>
          </Popup>  
        }
      </Marker>
    </React.Fragment>
  }

  render() {
    const { center, zoom } = this.state;

    const basemap = `http://{s}.tile.osm.org/{z}/{x}/{y}.png`;
    const attribution = `&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`;
    
    return (
      <LeafletMap 
        center={center} 
        zoom={zoom}
        attributionControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}>

        <TileLayer
          url={basemap}
          attribution={attribution}/>

        {
          sampleBatchMap && sampleBatchMap.features.map((exp, idx) => {
            let exposure = [
              exp.geometry.coordinates[1],
              exp.geometry.coordinates[0]
            ];

            let falseCoords = [
              exp.geometry.coordinates[1] - 0.00013,
              exp.geometry.coordinates[0]
            ];

            let displacementVal  = this.calculateDisplacementValue(
              exposure[0], exposure[1], 
              falseCoords[0], falseCoords[1]
            ).toFixed();

            let midPoint = this.calculateMidPoint(
              exposure[0], exposure[1], 
              falseCoords[0], falseCoords[1]
            );

            const polyline = [ 
              exposure,
              falseCoords
            ];

            return <CircleMarker
              key={idx}
              center={[midPoint.lat, midPoint.lon]}
              radius={(displacementVal/2) * 8}
              fillOpacity={0.5}
              stroke={false}>
              { this.renderMarkers(exp, exposure, falseCoords, displacementVal, polyline) }
            </CircleMarker>
          })
        }

      </LeafletMap>
    );
  }
}


export default App;