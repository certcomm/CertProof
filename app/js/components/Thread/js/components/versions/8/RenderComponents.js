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
                return <div>
                    <div>Warning: The evidence file contains information that is best rendered with the latest version of CertProof. Do you want to go ahead anyway? [Yes|No]</div>
                    <Comment comment={this.json} data={this.data} store={this.store} />
                </div>
            break;
            case "section":
                return <div>
                    <div>Warning: The evidence file contains information that is best rendered with the latest version of CertProof. Do you want to go ahead anyway? [Yes|No]</div>
                    {/* <Section comment={this.json} data={this.data} store={this.store} /> */}
                </div>
            break;
        }
	}
}

module.exports = RenderComponents;