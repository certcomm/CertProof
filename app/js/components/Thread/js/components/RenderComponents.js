import React from 'react';
import Comment from "./Comment";

class RenderComponents extends React.Component {
	constructor(props) {
        super(props);

        this.store = props.store;
        this.type = props.type;
        this.json = props.json;
        this.data = props.data;
    }

	render() {
        switch(this.json.sacSchemaVersion){
            // default will always call `Comment instead of `RenderComponents` `
            default:
            case 10:
                return <Comment comment={this.json} data={this.data} store={this.store} />
            break;
            case 8:
                var RenderComponents = require("./versions/8/RenderComponents");
            break;
        }
        return <RenderComponents type={this.type} json={this.json} data={this.data} store={this.store} />
	}
}

module.exports = RenderComponents;