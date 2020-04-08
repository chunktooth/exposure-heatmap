import React from 'react';
import mapboxgl from 'mapbox-gl';
import sampleBatchMap from './exposureData/sampleBatchMap.geojson';
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        lng: 5.3753,
        lat: 29.6213,
        zoom: 1.49
      };
    }

  async componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    await this.storeCoordinates(map);
  }

  storeCoordinates = (map) => {
    map.on('move', () => {
      this.setState({
        // get center of map coordinates to fixed digits
      lng: map.getCenter().lng.toFixed(4),
      lat: map.getCenter().lat.toFixed(4),

        // determin map zoom level to fixed digits
      zoom: map.getZoom().toFixed(2)
      });
    });

    map.on('load', () => {
      map.loadImage(
        'https://cdn.iconscout.com/icon/premium/png-256-thumb/pug-563422.png', (error, image) => {
          if (error) throw error;
          
            map.addImage('pug', image);
            map.addSource('point', {
            'type': 'geojson',
            'data': sampleBatchMap
          });
    
          map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'point',
            'layout': {
              'icon-image': 'pug',
              'icon-size': 0.25
            }
          })
        }
      )
    });
  }
      
  render() {
    return (
      <div className='App'>
        <div className='sidebarStyle'>
          Longitude: {this.state.lng} | 
          Latitude: {this.state.lat} | 
          Zoom: {this.state.zoom}
        </div>      
        <div 
          ref={el => this.mapContainer = el} 
          className='mapContainer'/>
      </div>
    )
  }
}

export default App;
