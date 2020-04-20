import React from 'react';
import sampleBatchMap from './sampleData/sampleBatchMap.geojson';
import { 
  Map as LeafletMap,
  Marker,
  Popup,
  GeoJSON
} from 'react-leaflet';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      center: [51.505, -0.09],
      zoom: 4
    }
  }

  onViewPortChanged = (viewport) => {
    return this.setState({ viewport })
  }

  render() {
    const { center, zoom } = this.state;
    const basemap = `https://a.tile.openstreetmap.org/${zoom}/${400}/${400}.png`;

    return (
      <LeafletMap 
        center={center} 
        zoom={zoom}
        // style={}
        // fitBounds={}
        doubleClickZoom={true}
        dragging={true}
        // viewport={viewport}
        // onViewportChange={this.onViewPortChanged}
        >
        <GeoJSON
          data={sampleBatchMap}
          style={() => ({
            color: '#4a83ec',
            weight: 0.5,
            fillColor: "#1a1d62",
            fillOpacity: 1,
          })}
        />
        <Marker position={[50, 10]}>
          <Popup>
            Popup for any custom information.
          </Popup>
        </Marker>
      </LeafletMap>
    );
  }
}


export default App;