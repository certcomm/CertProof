import React from 'react';
import Comment from "./Comment";
// import Section from "./Sections";

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
                return <Comment comment={this.json} data={this.data} store={this.store} />
            break;
            case "section":
                // return <Section comment={this.json} data={this.data} store={this.store} />
            break;
        }
	}
}

module.exports = RenderComponents;