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

  render() {
    const { center, zoom, popupInfo } = this.state;

    const basemap = `http://{s}.tile.osm.org/{z}/{x}/{y}.png`;
    const attribution = `&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`;

    const icon1 = new Icon({
      iconUrl: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/pug-563422.png',
      iconSize: [25, 25]
    });
    const icon2 = new Icon({
      iconUrl: 'https://cdn.iconscout.com/icon/premium/png-512-thumb/pet-food-1-536294.png',
      iconSize: [35, 35]
    })

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

            const polyline = [ 
              exposure,
              falseExposure
              // [ 38.898342, -77.016488 ]
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
                  exp.properties.falseCoordinates[1],
                  exp.properties.falseCoordinates[0]
                ]}
                onClick={() => { 
                  this.setPopupInfo(exp) 
                }}>
            </Marker>
            </React.Fragment>
          })
        }

      </LeafletMap>
    );
  }
}


export default App;