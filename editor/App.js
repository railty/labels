// File Imports
import './bootstrap.css';
import './react-web-tabs.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'react-web-tabs/dist/react-web-tabs.css';

import React, { Component } from 'react';
import FabricCanvas from './components/FabricCanvas';
import { Row, Col, Container } from "reactstrap";
import { Tabs, Tab, TabList } from 'react-web-tabs';
import Toolbar from './components/Toolbar';
import AttrsTable from './components/AttrsTable';
import LeftPanel from './components/LeftPanel';
import { initCenteringGuidelines } from './components/Helpers'
import FontPicker from 'font-picker-react';

var FontFaceObserver = require('fontfaceobserver');
//import { fabric } from 'fabric';

import './App.scss';
import './Styles/Navbar.scss'
import './Styles/TabView.scss'
import './Styles/LeftSidePanel.scss'
import './Styles/Footer.scss'
import './Styles/FabricCanvas.scss'
import './Styles/Toolbar.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.oid = 1;

    this.state = {
      canvas: null,
      isSnap: false,
      isOverlap: false,
      isGrid: true,
      canvaswidth: 1100,
      canvasheight: 850,
      defaultbg: null, //require('./images/main-img.jpg'),
      fontBoldValue: 'normal',
      fontItalicValue: '',
      fontUnderlineValue: '',
      gridsize: 30,
      savestateaction: true,
      canvasScale: 1,
      SCALE_FACTOR: 1.2,
      attrs2: {
        'rect': ['name', 'left', 'top', 'width', 'height', 'stroke', 'strokeWidth', 'fill'],
        'text': ['name', 'left', 'top', 'width', 'height', 'backgroundColor', 'text', 'fontFamily', 'fontStyle', 'fontSize', 'fontWeight'],
      },
      numberAttrs: ['left', 'top', 'width', 'height', 'strokeWidth', 'fontSize', 'fontWeight'],
      attrs: []
    };
  }

  updateCanvas = (canvas) => {
    if (canvas) {

      WebFont.load({
        google: {
          families: ['Pacifico', 'Roboto', 'ABeeZee']
        },
        active: function() {
          canvas.loadFromJSON(data);
          canvas.renderAll();
          this.arrangeCanvas(canvas);
        }.bind(this),
      });

    }

    this.setState({
      canvas: canvas
    });
  }

  updateState = (stateoptions) => {
    this.setState(stateoptions);
  }

  downloadAsPNG = () => {
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var fileName = month + '' + day + '' + year + '' + hours + '' + minutes + '' + seconds;
    const canvasdata = document.getElementById('main-canvas');
    const canvasDataUrl = canvasdata.toDataURL().replace(/^data:image\/[^;]*/, 'data:application/octet-stream'),
      link = document.createElement('a');
    fileName = fileName + ".png";
    link.setAttribute('href', canvasDataUrl);
    link.setAttribute('crossOrigin', 'anonymous');
    link.setAttribute('target', '_blank');
    link.setAttribute('download', fileName);
    if (document.createEvent) {
      var evtObj = document.createEvent('MouseEvents');
      evtObj.initEvent('click', true, true);
      link.dispatchEvent(evtObj);
    } else if (link.click) {
      link.click();
    }
  }

  downloadAsJSON = () => {
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var fileName = month + '' + day + '' + year + '' + hours; // + '' + minutes + '' + seconds;

    var canvasdata = this.state.canvas.toSVG({
      suppressPreamble: true,
    });

    
    var file = new Blob([canvasdata], {
      type: 'image/svg+xml'
    });

    var a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  saveOrOpenBlob = (blob, fileName) => {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function(fs) {
        fs.root.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.addEventListener("writeend", function () {
                    window.location = fileEntry.toURL();
                }, false);
                fileWriter.write(blob, "_blank");
            }, function () { });
        }, function () { });
    }, function () { });
  }

  download = (url, filename, svg) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.target = 'arget="_blank"';
    form.action = url;   

    const elem1 = document.createElement("input"); 
    elem1.name = "_csrf";
    elem1.value = csrf;
    form.appendChild(elem1);  
    
    const elem2 = document.createElement("input");  
    elem2.name = "filename";
    elem2.value = filename;
    form.appendChild(elem2);  

    const elem3 = document.createElement("input");  
    elem3.name = "svg";
    elem3.value = svg;
    form.appendChild(elem3);  

    const elem4= document.createElement("input");  
    elem4.name = "mode";
    //elem4.value = 'attachment';  //attachment or disposition
    elem4.value = 'inline';  //attachment or disposition
    form.appendChild(elem4);  

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  downloadAsPDF = () => {
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var fileName = month + '' + day + '' + year + '' + hours; // + '' + minutes + '' + seconds;

    var canvasData = this.state.canvas.toSVG({
      suppressPreamble: true,
    });

    this.download('/s2p', fileName, canvasData);
  }

  save = () => {
    let jsonCanvas = this.state.canvas.toJSON(['name', 'constraints', 'subType', 'text', , 'bcid']);
    
    jsonCanvas = JSON.stringify(jsonCanvas);

    var http = new XMLHttpRequest();
    http.open("POST", 'save', true);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.setRequestHeader("Accept", "application/json");
  
    http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
        var res = JSON.parse(http.responseText);
        console.log(res);
        //$('#status').text(res.status+'|'+res.store);
      }
    }
    var data = {
      '_csrf': csrf,
      'id': id,
      'json': jsonCanvas
    };
    var params = JSON.stringify(data);
    http.send(params);
  }

  refresh = () => {
    let canvas = this.state.canvas;

    let fontFamily = 'ABeeZee';
    var font = new FontFaceObserver();
    console.log(`loading ${fontFamily} Font`);
    font.load(null, 10000).then(function () {
      console.log('Font is available');
      canvas.renderAll();
      console.log("refreshed");
    }).catch(function(e) {
      console.log("Font is not available");
    });;
  }

  changeCanvas = (name, value) => {
    var canvas = this.state.canvas

    let object = canvas.getActiveObject();

    if (!object) return;
    
    object.set(name, value);
    if (object.type=="image" && object.subType=="barcode"){
      if (name=="text" || name=="bcid"){
        let text = object.text;
        let bcid = object.bcid;
        let url = `/code/${text}.png?bcid=${bcid}`;
        object.setSrc(url, (obj)=>{
          object.setCoords();
          canvas.renderAll();
        });
      }
    }
    object.setCoords();
    canvas.renderAll();
  }

  arrange = () => {
    let canvas = this.state.canvas;
    this.arrangeCanvas(canvas);
  }

  arrangeCanvas = (canvas) => {
    let constraints = [];
    let objects = {
      'Page': {
        left: 0,
        top: 0,
        width: 1100,
        height: 850
      }
    };

    canvas.forEachObject((o)=>{
      if (o.constraints){
        let cs = o.constraints.map((c)=>{
          c.object = o.name;
          return c;
        });
        constraints = constraints.concat(cs);
      }
      if (o.name) objects[o.name] = o;
    });

    let len1 = 1;
    let len2 = 0;
    do {
      let leftObjs = constraints.reduce((hash, constraint)=>{
        hash[`${constraint.object}.${constraint.myCorner}`] = true;
        return hash;
      }, {});

      for (let constraint of constraints){
        if (leftObjs[`${constraint.ref}.${constraint.corner}`]){
          //depend on another constraint
        }
        else{
          let me = objects[constraint.object];
          let v;
          if (constraint.corner == 'left' || constraint.corner == 'left'){
            v = objects[constraint.ref][constraint.corner] + parseFloat(constraint.offset);
          }
          else if (constraint.corner == 'right'){
            v = objects[constraint.ref]['left'] + objects[constraint.ref]['width'] + parseFloat(constraint.offset);
          }
          else if (constraint.corner == 'bottom'){
            v = objects[constraint.ref]['top'] + objects[constraint.ref]['height'] + parseFloat(constraint.offset);
          }

          if (constraint.myCorner == 'left' || constraint.myCorner == 'left'){
            me[constraint.myCorner] = v;
          }
          else if (constraint.myCorner == 'right'){
            me['width'] = v - me['left'];
          }
          else if (constraint.myCorner == 'bottom'){
            me['height'] = v - me['top'];
          }
          
          console.log(`${constraint.myCorner} = ${v}`);
          me.setCoords();
    
          constraint.done = true;
        }
      }
      len1 = constraints.length;
      constraints = constraints.filter((c)=>{
        return !c.done;
      });
      len2 = constraints.length;
    } while (len1>len2);

    canvas.renderAll();
    console.log(constraints);
    console.log(objects);
  }

  addCanvasConstraint = (constraint) => {
    var canvas = this.state.canvas

    let object = canvas.getActiveObject();

    if (!object) return;

    let constraints = object.get('constraints');
    
    let i = constraints.findIndex(function(c){
      return c.myCorner == constraint.myCorner;
    })
    //console.log(i);
    if (i>=0) constraints[i] = constraint;
    else constraints.push(constraint);
    console.log(constraints);

    constraints = object.set('constraints', constraints);
    object.setCoords();
    canvas.renderAll();

  }

  delCanvasConstraint = (idx) => {
    var canvas = this.state.canvas

    let object = canvas.getActiveObject();

    if (!object) return;

    let constraints = object.get('constraints');
    
    constraints.splice(idx, 1);
    console.log(constraints);

    constraints = object.set('constraints', constraints);
    object.setCoords();
    canvas.renderAll();

  }
  setSnap = () => {
    this.setState({
      isSnap: !this.state.isSnap,
    });
    var offstate = document.querySelectorAll('#snapswitch');
    for (var j = 0; j < offstate.length; j++) {
      offstate[j].checked = this.state.isSnap;
    }
  }

  showhideGrid = () => {
    var isGrid = !this.state.isGrid;
    this.setState({
      isGrid: isGrid,
    });
    if (isGrid) {
      for (var i = 0; i < (650 / this.state.gridsize); i++) {
        this.state.canvas.add(new fabric.Line([i * this.state.gridsize, 0, i * this.state.gridsize, 650], {
          stroke: '#ccc',
          selectable: false
        }));
        this.state.canvas.add(new fabric.Line([0, i * this.state.gridsize, 650, i * this.state.gridsize], {
          stroke: '#ccc',
          selectable: false
        }))
      }
    } else {
      this.clearGrid();
    }
    var offstate = document.querySelectorAll('#gridswitch');
    for (var j = 0; j < offstate.length; j++) {
      offstate[j].checked = this.state.isGrid;
    }
    this.state.canvas.renderAll();
  }

  clearGrid = () => {
    var objects = this.state.canvas.getObjects('line');
    for (let i in objects) {
      this.state.canvas.remove(objects[i]);
    }
  }

  setOverlap = () => {
    this.setState({
      isOverlap: !this.state.isOverlap,
    });
    var offoverlap = document.querySelectorAll('#overlapswitch');
    for (var j = 0; j < offoverlap.length; j++) {
      offoverlap[j].checked = this.state.isOverlap;
    }
  }

  undo = () => {
    var canvas = this.state.canvas;
    canvas.stateaction = false;
    var index = canvas.index;
    var state = canvas.state;
    if (index > 0) {
      index -= 1;
      this.removeObjects();
      canvas.loadFromJSON(state[index], function() {
        canvas.renderAll();
        canvas.stateaction = true;
        canvas.index = index;
      });
    }
    else {
      canvas.stateaction = true;
    }
  }

  removeObjects = () => {
    var canvas = this.state.canvas;
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    if (activeObject.type === 'activeSelection') {
      activeObject.forEachObject((object) => {
        canvas.remove(object);
      });
    }
    else {
      canvas.remove(activeObject);
    }
  }

  redo = () => {
    var canvas = this.state.canvas;
    var index = canvas.index;
    var state = canvas.state;
    console.log(index);
    canvas.stateaction = false;
    if (index < state.length - 1) {
      this.removeObjects();
      canvas.loadFromJSON(state[index + 1], function() {
        canvas.renderAll();
        canvas.stateaction = true;
        index += 1;
        canvas.index = index;
      });
    }
    else {
      canvas.stateaction = true;
    }
  }
  
  zoomToPercent = (event) => {
    var percentage = Number(event.target.value) / 100;
    this.setCanvasSize(percentage)
  }

  setCanvasSize = (percentage) => {
    console.log(percentage);
    var canvas = this.state.canvas;

    canvas.setHeight(canvas.getHeight() * (percentage / this.state.canvasScale));
    canvas.setWidth(canvas.getWidth() * (percentage / this.state.canvasScale));
    const objects = canvas.getObjects();

    for (var i in objects) {
      const  scaleX = objects[i].scaleX;
      const  scaleY = objects[i].scaleY;
      const  left = objects[i].left;
      const  top = objects[i].top;
      const  tempScaleX = scaleX * (percentage / this.state.canvasScale);
      const  tempScaleY = scaleY * (percentage / this.state.canvasScale);
      const  tempLeft = left * (percentage / this.state.canvasScale);
      const  tempTop = top * (percentage / this.state.canvasScale);
      objects[i].scaleX = tempScaleX;
      objects[i].scaleY = tempScaleY;
      objects[i].left = tempLeft;
      objects[i].top = tempTop;
      objects[i].setCoords();
    } 
    this.setState({ canvasScale: percentage });
    canvas.renderAll();
  }

  zoomIn = () => {
    const canvas = this.state.canvas;

    if (this.state.canvasScale < 4) {
      const percentage = this.state.canvasScale + 0.25;
      this.setCanvasSize(percentage);
      initCenteringGuidelines(canvas);
    }
  }

  // Zoom Out
  zoomOut = () => {
    const canvas = this.state.canvas;
    if (this.state.canvasScale > 0.25) {
      const percentage = this.state.canvasScale - 0.25;
      this.setCanvasSize(percentage);
      initCenteringGuidelines(canvas);
    }
  }

  resetState = () => {
    var canvas = this.state.canvas;
    canvas.state = [];
    canvas.index = 0;
  }

  grpungrpItems() {
    var canvas = this.state.canvas;
    var actObj = canvas.getActiveObject();
    if (!actObj) {
      return false;
    }
    if (actObj.type === 'group') {
      actObj.toActiveSelection();
    } else if (actObj.type === 'activeSelection') {
      actObj.toGroup();
    }
    canvas.renderAll();
  }

  initKeyboardEvents = () => {
    let self = this;
    document.onkeyup = function(e) {
      e.preventDefault(); // Let's stop this event.
      e.stopPropagation(); // Really this time.
      if (e.which === 46) {
        self.removeObject();
      }
      if (e.ctrlKey && e.which === 90) {
        self.undo();
      }
      if (e.ctrlKey && e.which === 89) {
        self.redo();
      }
      if (e.which === 71) {
        //group / ungroup items
        self.grpungrpItems();
      }
    };
  }

  componentDidMount() {
    console.log(data);
    const canvas = this.state.canvas;
    if (canvas) {
//      canvas.loadFromJSON(data);
//      canvas.renderAll();
    }
    this.initKeyboardEvents();
  }

  selectionUpdated = () => {
    

    let canvas = this.state.canvas;
    let actObj = canvas.getActiveObject();
    if (actObj) {
      console.log(`selection updated (${actObj.type})`);

      if (actObj.type == "text"){
        this.oid++;
        let attrs = [
          {
            name: "name", 
            type: "keyin"
          }, 
          {
            name: "fontSize", 
            type: "keyin"
          }, 
          {
            name: "fontFamily", 
            type: "list",
            list: []
          },
        ].map((attr)=>{
          let v = actObj.get(attr.name);
          attr["value"] = v;
          return attr;
        });

        if (JSON.stringify(this.state.attrs) != JSON.stringify(attrs)) {
          this.setState({attrs: attrs});
        }
      }
      else if (actObj.type == "path" || actObj.type == "group"){  //qrcode is path and barcode is group
        if (actObj.subType == "barcode"){
          this.oid++;
          let attrs = [
            {
              name: "text", 
              type: "keyin"
            }, 
            {
              name: "bcid", 
              type: "keyin"
            }, 
            {
              name: "width", 
              type: "keyin"
            }, 
            {
              name: "height", 
              type: "keyin"
            }, 
          ].map((attr)=>{
            let v = actObj.get(attr.name);
            attr["value"] = v;
            return attr;
          });
  
          if (JSON.stringify(this.state.attrs) != JSON.stringify(attrs)) {
            this.setState({attrs: attrs});
          }
  
        }
      }
      else if (actObj.type == "image"){
        if (actObj.subType == "barcode"){
          this.oid++;
          let attrs = [
            {
              name: "text", 
              type: "keyin"
            }, 
            {
              name: "bcid", 
              type: "keyin"
            }, 
            {
              name: "src", 
              type: "keyin"
            }, 
            {
              name: "width", 
              type: "keyin"
            }, 
            {
              name: "height", 
              type: "keyin"
            }, 
          ].map((attr)=>{
            if (attr.name=="src"){
              let v = actObj.getSrc();
              attr["value"] = v;
            }
            else{
              let v = actObj.get(attr.name);
              attr["value"] = v;
            }
            return attr;
          });
  
          if (JSON.stringify(this.state.attrs) != JSON.stringify(attrs)) {
            this.setState({attrs: attrs});
          }
  
        }
      }

      
    }
  }

  render() {
    const sidebarWidth = 200;

    let options = []
    for (let i = 1; i < 17; i ++) {
     options.push(<option key={i} value={i * 25}>{i * 25}%</option>)
    }

    return (
      <Container fluid={true}>
        <Row className="navbar-container">
          <Col>          
            <nav className="navbar navbar-expand-lg header-bar">
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="navbar-nav ml-md-auto">
  
                  <li className="nav-item active">
                    <span className="btn btn-outline" onClick={this.zoomOut}>-</span>
                  </li>                    

                  <li className="nav-item active">
                    <div className="select-container">
                      <select className="zoom" onChange={this.zoomToPercent} value={this.state.canvasScale * 100}>
                        {options}
                        <option value="100">FIT</option>
                        <option value="200">FILL</option>
                      </select>
                    </div>
                  </li>
                  <li className="nav-item active">
                    <span className="btn btn-outline" onClick={this.zoomIn}>+</span>
                  </li>                    

                  <li className="nav-item active">
                    <span className="btn btn-outline" onClick={this.undo}>Undo</span>
                  </li>
                  <li className="nav-item active">
                    <span className="btn btn-outline" onClick={this.redo}>Redo</span>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link switch" href="{null}" title="Display Grid">Grid <input type="checkbox" id="gridswitch" />
                    <label htmlFor="gridswitch" onClick={this.showhideGrid}>Toggle</label>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link switch" href="{null}" title="Snap to Grid">Snap <input type="checkbox" id="snapswitch" />
                    <label htmlFor="snapswitch" onClick={this.setSnap}>Toggle</label>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link switch" href="{null}" title="Overlap">Overlap <input type="checkbox" id="overlapswitch" />
                    <label htmlFor="overlapswitch" onClick={this.setOverlap}>Toggle</label>
                    </a>
                  </li>
                  <li className="nav-item active download">
                    <span className="btn btn-outline" onClick={this.downloadAsJSON}>Export JSON</span>
                  </li>
                  <li className="nav-item active download">
                    <span className="btn btn-fill" onClick={this.downloadAsPNG}>Export Artwork</span>
                  </li>
                  <li className="nav-item active download">
                    <span className="btn btn-fill" onClick={this.downloadAsPDF}>Export PDF</span>
                  </li>
                  <li className="nav-item active download">
                    <span className="btn btn-fill" onClick={this.save}>Save</span>
                  </li>
                  <li className="nav-item active download">
                    <span className="btn btn-fill" onClick={this.refresh}>Refresh</span>
                  </li>
                  <li className="nav-item">
                    <span className="nav-link btn-close" href="/"><img src={require('./images/close.jpg')} alt="" /></span>
                  </li>
                </ul>
              </div>
            </nav>
          </Col>
        </Row>

        <Row className="main-container">
          <div className="tabpanel">
            <Tabs defaultTab="vertical-tab-one" vertical className="vertical-tabs">
              <TabList>
                <Tab tabFor="vertical-tab-one" className="lasttab" >
                  <div className="edit-box">
                    <img src={require('./images/textbg.jpg')} alt="" />
                    <span>TEXT</span>
                  </div>
                </Tab>
                <Tab tabFor="vertical-tab-two" className="lasttab" >
                  <div className="edit-box">
                    <img src={require('./images/bg.jpg')} alt="" />
                    <span>BKGROUND</span>
                  </div>
                </Tab>
                <Tab tabFor="vertical-tab-three" className="lasttab" >
                  <div className="edit-box">
                    <img src={require('./images/bg.jpg')} alt="" />
                    <span>PHOTOS</span>
                  </div>
                </Tab>
                <Tab tabFor="vertical-tab-four" className="lasttab" >
                  <div className="edit-box">
                    <img src={require('./images/bg.jpg')} alt="" />
                    <span>ELEMENTS</span>
                  </div>
                </Tab>
              </TabList>
              <div style={{ width: sidebarWidth }} className="left-side-panel">
                <LeftPanel canvas={this.state.canvas} />
              </div>
            </Tabs>   
          </div>

          <div className="canvas-panel">
            <Toolbar state={this.state} updateCanvas={this.updateCanvas} />

            <FabricCanvas state={this.state} updateCanvas={this.updateCanvas} updateState={this.updateState} selectionUpdated={this.selectionUpdated}/>
          </div>


            <div style={{ width: 400 }} className="left-side-panel">
              <AttrsTable 
                key={this.oid} 
                attrs={this.state.attrs} 
                changeCanvas={this.changeCanvas} 
                addCanvasConstraint={this.addCanvasConstraint} 
                delCanvasConstraint={this.delCanvasConstraint} 
                arrange={this.arrange} 
                canvas={this.state.canvas} 
              />
            </div>

        </Row>

        <FontPicker
                ref={c => this.pickerRef = c}
                apiKey="AIzaSyCOyeDUsAnL-jnWudXBKNNma9cXmXsT4tM"
                activeFontFamily={this.state.activeFontFamily}
                limit="150"
              />

      </Container>
    );
  }
}

export default App;