import React from 'react';

class RenderComponents extends React.Component {
	constructor(props) {
        super(props);

        this.store = props.store;
        this.type = props.type;
        this.json = props.json;
        this.data = props.data;
    }

	render() {
        switch(this.type){
            case "comment":
                var Comment = require("./Comment");
                return <Comment comment={this.json} data={this.data} store={this.store} />
            break;       
        }
	}
}

module.exports = RenderComponents;