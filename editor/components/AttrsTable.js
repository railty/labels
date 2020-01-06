import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
//import { fabric } from 'fabric';
import { SketchPicker } from 'react-color';
import { getOffset, saveCanvasState, selectObject } from './Helpers'
import { Container, Collapse } from "reactstrap";
import $ from 'jquery';
import FontPicker from 'font-picker-react';
var FontFaceObserver = require('fontfaceobserver');

class AttrsTable extends React.Component {
  state = {
      attrs: this.props.attrs
  };

  componentDidMount() {
    $(".strokeeff").hide();
    $(".iconbar").hide();
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    //console.log("did update");
    /*
    var canvas = this.props.state.canvas;
    var activeObject = canvas.getActiveObject();
    if(activeObject) {
      let attrs = {};
      if (activeObject.type == "text"){
        ["fontSize", "fontFamily"].forEach((k)=>{
          let v = activeObject.get(k);
          attrs[k] = v;
        });

        if (JSON.stringify(this.state.attrs) != JSON.stringify(attrs)) {
          this.setState({attrs: attrs});
        }    
      }
    }
    */
  }

  onChange = (e) => {
    let idx = parseInt(e.target.getAttribute('idx'));
    let name = e.target.name;
    let value = e.target.value;

    let attrs = [...this.state.attrs];     // create the copy of state array
    attrs[idx].value = value;                  //new value
    this.setState({ attrs });         
  }

  enter = (e) => {
    if (e.key === 'Enter') {
      let name = e.target.name;
      let value = e.target.value;
      this.props.changeCanvas(name, value);
    }
  }
  
  setTextFont = (idx, fontFamily) => {

    let attrs = [...this.state.attrs];     // create the copy of state array
    attrs[idx].value = fontFamily;                  //new value
    this.setState({ attrs });         

    this.props.changeCanvas('fontFamily', fontFamily);

    /*
    var self = this;
    const { canvas } = this.props.state;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {

        let me = this;
        var myfont = new FontFaceObserver(fontfamily);
        myfont.load().then(function() {
          activeObject.set('fontFamily', fontfamily);
          activeObject.setCoords();
          canvas.renderAll();

          let attrs = {};
          attrs['fontFamily'] = fontfamily;
//          me.setState({attrs: attrs});
        })
        .catch(function(e) {
          console.log(e);
        });    
      }
    }
    */
    //let attrs = {};
    //attrs['fontFamily'] = fontfamily;
    //this.setState({attrs: attrs});

    //let idx = parseInt(e.target.getAttribute('idx'));
    //let name = e.target.name;
    //let value = e.target.value;

  }

  render() {
    let trs = null;
    if (this.state.attrs){
      trs = this.state.attrs.map(function(attr, idx){
        let tr = null;
        if (attr.name == "fontFamily"){
          tr = (<tr key={attr.name} ><td>{attr.name}</td><td>
                <FontPicker ref={c => this.pickerRef = c} 
                  apiKey="AIzaSyCOyeDUsAnL-jnWudXBKNNma9cXmXsT4tM" 
                  activeFontFamily={this.state.attrs[idx].value}     
                  limit="150"
                  onChange={nextFont => this.setTextFont(idx, nextFont.family)}/>
                </td></tr>);
        }
        else{
          tr = (<tr key={idx} ><td>{attr.name}</td><td><input idx={idx} type="text" value={attr.value} name={attr.name} onChange={this.onChange.bind(this)} onKeyDown={this.enter} /></td></tr>);
        }

        return tr;
      }.bind(this));

    }

/*
<input type="text" list="browsers" />

<datalist id="browsers">
    <option value="Internet Explorer">
    <option value="Firefox">
    <option value="Chrome">
    <option value="Opera">
    <option value="Safari">
</datalist>
*/

    return (
      <table className="table is-bordered is-narrow">
        <thead>
            <tr><th>Name</th><th>Value</th></tr>
        </thead>

        <tbody>
          {trs}
        </tbody>
      </table>

    );
  }
}

export default AttrsTable;