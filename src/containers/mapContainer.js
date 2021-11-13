import React,{Component} from "react";
import {  TileLayer, Marker, Popup,Map  } from "react-leaflet";
import {getPlaces,createNewPlace,updatePlace,deletePlace} from "../api/crud"
import {Button} from "antd"
import MapEdit from "../components/showObjDetails"
import "./mapStyle.css"


class MapComponent extends Component{
  constructor(props) {
    super(props);
    this.popup = React.createRef();
    this.state = {
      markers: [{
        id:12332,
        position:  [-0.02, 51.505],
        name:"intial Marker",
        image_url:"https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
      }],
      visible:false,
      selectedData:{}
    };
  }

  componentDidMount() {
    getPlaces().then(res=>{
      if(res.status===200){
        const {data} = res;
        let requireData = []
        data.map(d=>{
          requireData.push({
            id:d.id,
            name:d.name,
            position:[ Number(d.longitude),Number(d.latitude)],
            image_url:d.image_url
          })
          return requireData;
        })
        const {markers} = this.state
        this.setState({markers:[...markers,...requireData]})
      }
    }).catch(error=>{
      console.log(error)
    })
  }

  addMarker = (e) => {
    const {markers} = this.state
    let body = {
      "latitude":e.latlng.lat,
      "longitude":e.latlng.lng,
      "name":`test data ${e.latlng.lat}`,
      "image_url":"https://www.flytap.com/-/media/Flytap/new-tap-pages/destinations/europe/germany/dusseldorf/destinations-dusseldorf-banner-mobile-1024x553.jpg"
    }
    createNewPlace(body).then(res=>{
      if(res.status===200){
        markers.push({
            id:res.data.id,
            position:  [e.latlng.lng,e.latlng.lat],
            name:`test data ${e.latlng.lat}`,
            image_url:"https://www.flytap.com/-/media/Flytap/new-tap-pages/destinations/europe/germany/dusseldorf/destinations-dusseldorf-banner-mobile-1024x553.jpg"
          }
        )
        this.setState(markers)
      }
    }).catch(error=>console.log(error))
  }

  handleDelete = data =>{
    const {markers } = this.state
    deletePlace(data.id).then(res=>{
      if(res.status ===200){
        let afterDeleteData = markers.filter(el => {
          return el.id !== data.id;
        });
        this.setState({markers:afterDeleteData})
        this.popup.current.leafletElement.options.leaflet.map.closePopup();
      }
    }).catch(error=>{
      console.log("+++++++++can not be deleted",error)
    })
  }
  handleUpdate = data =>{
    this.setState({visible:true,selectedData:data})
  }
  onFinish = (values) => {
    const {selectedData,markers} = this.state;
    console.log('Success:', values);
    updatePlace(values,selectedData.id).then(res=>{
      if(res.status===200){
        let stateCopy = markers.map((data) => {
          const { name,image_url } = values;
          if (data.id === selectedData.id) {
            data.name = name;
            data.image_url = image_url;
          }
          return data;
        });
        this.setState({visible:false})
        this.setState({markers:stateCopy})
        this.popup.current.leafletElement.options.leaflet.map.closePopup();

      }
    }).catch(error=>{
      console.log("eror",error)
    })
   };

   onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    this.setState({visible:false})
  };

  //lng and lat in position
  render() {
    const {visible} = this.state
    return <React.Fragment>
      <MapEdit key={visible} visible={visible} selectedData={this.state.selectedData} onCancel={this.onFinishFailed} onCreate={this.onFinish}/>
      <Map
        center={[51.505, -0.02]}
        onClick={this.addMarker}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {this.state.markers.map((markerLocation, idx) =>
          <Marker key={`marker-${idx}`}
                  position={
                    [markerLocation.position[1], markerLocation.position[0]]
                  }
          >
            <Popup ref={this.popup}>
              <div>
                <h3>Details of Marker</h3>
                <div style={{display:"flex",flexDirection:"column"}}>
                   <span>{markerLocation.name}<br/>
                Latitude:{markerLocation.position[1]}
                     <br/>
                Longitude:{markerLocation.position[0]}
                </span>
                  <img src={markerLocation.image_url} alt={"img"} style={{width:"150",height:"150"}}/>
                </div>
                <div style={{display:"flex"}}>
                  <Button onClick={()=>this.handleUpdate(markerLocation)} >Update</Button>
                  <Button onClick={()=>this.handleDelete(markerLocation)} >Delete</Button>
                </div>

              </div>


            </Popup>
          </Marker>
        )}
      </Map>
    </React.Fragment>
  }
}

export default MapComponent;
