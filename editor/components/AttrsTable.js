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
      attrs: this.props.attrs,
      currentTab: 'Position',
      offset: 0
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
  setTab = (e) => {
    let tab = e.target.title;
    console.log(tab);
    this.setState({currentTab: tab});
  }

  setOffset = (e) => {
   this.setState({offset: e.target.value});
    console.log(e);
  }
  
  delConstraint = (e) => {
    let idx = e.target.getAttribute('idx');
    console.log(e.target.idx);
    this.props.delCanvasConstraint(idx);
    this.forceUpdate();
  }

  addConstraint = (e) => {

    let myCorner = document.getElementById("my").value;
    let ref = document.getElementById("ref").value;
    let corner = document.getElementById("corner").value;
    let offset = document.getElementById("offset").value;

    let str = `me.${myCorner} = ${ref}.${corner} + ${offset}`;
    console.log(str);
    this.props.addCanvasConstraint({
      myCorner : myCorner,
      ref: ref,
      corner: corner,
      offset: offset
    });

    this.forceUpdate();
  }

  render() {

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

    let tabs = [
      {
        name: 'Attribute',
        label: 'A'
      },
      {
        name: 'Position',
        label: 'P'
      },
      {
        name: 'All',
        label: 'All'
      },
    ];
    
    tabs = tabs.map(function(t){
      let style = {};
      if (this.state.currentTab == t.name) style.backgroundColor = 'lightblue';
      
      return (<button key={t.name} title={t.name} onClick={this.setTab} style={style} >{t.label}</button>);
    }.bind(this));

    let trs = null;

    if (this.state.currentTab == "Attribute"){
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
      return (
        <div>
          {tabs}

          <table className="table is-bordered is-narrow">
            <thead>
                <tr><th>Name</th><th>Value</th></tr>
            </thead>

            <tbody>
              {trs}
            </tbody>
          </table>
        </div>
      );
    }
    else if (this.state.currentTab == "Position"){
      let name = "";
      let constraints = [];
      let trs = null;
      let names = ['Page'];
      let canvas = this.props.canvas;
      if (canvas) {
        const activeObject = canvas.getActiveObject();
        if (activeObject) name = activeObject.name;
        canvas.forEachObject((o)=>{
          if (o.name) names.push(o.name);
          //console.log(o.name);
        });
        names = names.map((name)=>{
          return (<option key={name}>{name}</option>);
        });
        if (activeObject) {
          constraints = activeObject.constraints;
          if (constraints){
            trs = constraints.map((constraint, i)=>{
              return (<tr key={i}>
                <td>{constraint.myCorner}</td>
                <td>{constraint.ref}</td>
                <td>{constraint.corner}</td>
                <td>{constraint.offset}</td>
                <td><button idx={i} onClick={this.delConstraint}>X</button></td>
              </tr>);
            });
          }
        }
      }

      return (
        <div>
          {tabs}
          <div>
            <select id="my">
              <option value="left">Left</option>
              <option value="MH">Mid(H)</option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="MV">Mid(V)</option>
              <option value="bottom">Bottom</option>
            </select>

            <select id="ref" >{names}</select>

            <select id="corner">
              <option value="left">Left</option>
              <option value="MH">Mid(H)</option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="MV">Mid(V)</option>
              <option value="bottom">Bottom</option>
            </select>

            <input id="offset" type="text" value={this.state.offset} onChange={this.setOffset}/>
            <button onClick={this.addConstraint}>Add</button>

            <button onClick={this.props.arrange}>Arrange</button>

          </div>
          <table className="table is-bordered is-narrow">
            <thead>
                <tr><th>{name}</th><th>ref</th><th>refs</th><th>offset</th></tr>
            </thead>

            <tbody>
              {trs}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default AttrsTable;