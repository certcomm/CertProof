import React from 'react';
import Comment from "./Comment";
import RenderOutDatedView from "./RenderOutDatedView";

class RenderComponents extends React.Component {
	constructor(props) {
        super(props);

        this.store = props.store;
        this.type = props.type;
        this.json = props.json;
        this.data = props.data;

        this.state = {
            renderOutDatedView: false
        }
    }

	render() {
        switch(this.json.sacSchemaVersion){
            // default will always call `Comment instead of `RenderComponents` `
            default:
            case 10:
                return <Comment comment={this.json} data={this.data} store={this.store} />
            break;
            case 8:
                if(this.state.renderOutDatedView){
                    var RenderComponents =  require("./versions/8/RenderComponents")
                }else{
                    var RenderComponents =  require("./versions/8/RenderComponents")
                    // commented, may be we would need this in future
                    // return <RenderOutDatedView />
                }
            break;
        }
        return <RenderComponents type={this.type} json={this.json} data={this.data} store={this.store} />
	}
}

module.exports = RenderComponents;