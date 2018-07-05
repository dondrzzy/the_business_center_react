import React, { Component } from 'react';

 export default class NotFound extends Component {
    render (){
        return (
            <div className="container" id="main">
            <div className="not-found">
                <div className="row">
                    <div className="col">
                        <h4>Not found. If you manually entered the URL, please correct the URL</h4>
                    </div>
                </div>
            </div>
            </div>
        )
    }
 }