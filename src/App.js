import React from 'react';
import mapboxgl from 'mapbox-gl';
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

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    this.storeCoordinates(map);
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
