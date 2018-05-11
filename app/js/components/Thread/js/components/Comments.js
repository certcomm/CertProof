import React from 'react';

import RenderComponents from "./RenderComponents";

export default class Comments extends React.Component {
	constructor(props) {
        super(props);

        this.store = props.store;
        this.comments = props.comments;
        this.data = props.data;
    }

	render() {
        var comments = this.comments;
        return (
            <div className="comment-parent-container">
                {
                    Object.keys(comments).reverse().map( (i) => {
                        return <RenderComponents type="comment" key={i} json={comments[i]} data={this.data} store={this.store} />
                    })
                }
            </div>
        );
	}
}