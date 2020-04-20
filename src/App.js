import React from 'react';
import sampleBatchMap from './sampleData/sampleBatchMap.json';
import { 
  Map as LeafletMap,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import './App.css';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      center: [51.505, -0.09],
      zoom: 4,
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
          sampleBatchMap && sampleBatchMap.features.map(exp => (
            <Marker
              key={exp.properties.AddressLine}
              position={[
                exp.geometry.coordinates[1],
                exp.geometry.coordinates[0]
              ]}
              onClick={() => {
                this.setPopupInfo(exp);
              }}>

              {
                popupInfo &&
                <Popup>
                  <p>
                    <strong>{ popupInfo.properties.AddressLine }</strong><br/>
                    { popupInfo.geometry.coordinates }
                  </p>
                
                
                </Popup>
              }

            </Marker>
          ))
        }

      </LeafletMap>
    );
  }
}


export default App;