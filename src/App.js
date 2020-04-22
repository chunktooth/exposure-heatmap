import React from 'react';
import sampleBatchMap from './sampleData/sampleBatchMap.json';
import { 
  Map as LeafletMap,
  TileLayer,
  Marker,
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
      // bounds: [
      //   [27.693538, -167.402592],
      //   [27.693538, 175.546622]
      // ],
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

  render() {
    const { center, zoom, popupInfo } = this.state;

    const basemap = `http://{s}.tile.osm.org/{z}/{x}/{y}.png`;
    const attribution = `&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`;

    const icon1 = new Icon({
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-and-shapes-6/177800/262-512.png',
      iconSize: [25, 25]
    });
    const icon2 = new Icon({
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-and-shapes-6/177800/263-512.png',
      iconSize: [25, 25]
    });

    // works
    // const polyline = [
    //   [ 38.897959, -77.036514 ],
    //   [ 38.898342, -77.016488 ]
    // ];
    
    return (
      <LeafletMap 
        center={center} 
        zoom={zoom}
        // bounds={bounds}
        attributionControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}>

        <TileLayer
          url={basemap}
          attribution={attribution}/>

        {
          sampleBatchMap && sampleBatchMap.features.map(exp => {
            let exposure = [
              exp.geometry.coordinates[1],
              exp.geometry.coordinates[0]
            ];

            let falseExposure = [
              exp.properties.falseCoordinates[1],
              exp.properties.falseCoordinates[0]
            ];

            let displacementVal  = this.calculateDisplacementValue(
              exposure[0], exposure[1], 
              falseExposure[0], falseExposure[1]
            ).toFixed();

            const polyline = [ 
              exposure,
              falseExposure
            ];

            return <React.Fragment>
              <Marker
                icon={icon1}
                key={exp.properties.AddressLine}
                position={[
                  exp.geometry.coordinates[1],
                  exp.geometry.coordinates[0]
                ]}
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
                  position={[
                    // sampleBatchData json file coordinates are lng first then lat
                    exp.properties.falseCoordinates[1],
                    exp.properties.falseCoordinates[0]
                  ]}
                  onClick={() => { 
                    this.setPopupInfo(exp) 
                  }}>

                {
                  popupInfo &&
                  <Popup>
                    <strong>{`Displacement Value ${displacementVal} m`}</strong>
                    <p></p>
                    <p>{`${falseExposure[0]}, ${falseExposure[1]} `}</p>
                  </Popup>  
                }
              </Marker>
            </React.Fragment>
          })
        }

      </LeafletMap>
    );
  }
}


export default App;