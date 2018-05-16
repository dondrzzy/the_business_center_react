import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import swal from 'sweetalert';

export default class Business extends Component{
    constructor(){
        super();
        this.state = {
            open: false,
            showDelete: false,
            deleteAlert: null
        }
    };

    onOpenModal(){
        this.setState({ open: true });
    }

    onCloseModal(){
        this.setState({ open: false });
    }

    mountAlertComponent(){
        const deleteComponent = () => (
            swal({
                title: "Are you sure?",
                type: "warning",
                showCancelButton:true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Delete",
                closeOnConfirm: false,
                closeOnCancel: false
            },
                (isConfirm) => {
                    if(isConfirm){
                        swal({
                            title:"Deleted!",
                            text:"Your imaginary file has been deleted.",
                            type:"success",
                        })
                    }else{
                        swal("Cancelled", "", "error");
                    }
                }
            )
        );
        this.setState({ deleteAlert: deleteComponent()})
        // console.log('sweetalert');
    }

    unmountAlertComponent(){

    }

    render(){
        const { open } = this.state;
        return(
            <div className="business-item">
                <div className="row">
                    <div className="col-md-12">
                        <div className="jumbotron">
                            <h3>Business | <span>Category</span></h3>
                            <p>We at Business are tailored to suit your needs</p>   
                            <hr />     
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#updateBusiness" className="btn btn-primary btn-sm">
                                Update Business
                            </button>        
                            <button type="button" onClick={() => { this.mountAlertComponent()}} className="btn btn-danger btn-sm">Delete</button>
                            {this.state.deleteAlert}        
                        </div>                        
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <h4>Description</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum quam ad nam molestiae. Qui tempore, laudantium ex. Quaerat unde aperiam quo, voluptatibus adipisci. Laudantium ut delectus cumque voluptatem minima blanditiis.</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="card border-light mb-3">
                            <div className="card-header">Our Services</div>
                            <div className="card-body">
                                <h6>Perferendis</h6>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, aut at et, ratione id debitis, necessitatibus iure repellendus eveniet explicabo labore perferendis! Maiores nobis minima error impedit ab officia amet?</p>
                                <hr/>
                                <h6>Impedit ab Officia</h6>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, aut at et, ratione id debitis, necessitatibus iure repellendus eveniet explicabo labore perferendis! Maiores nobis minima error impedit ab officia amet?</p>
                                <hr/>
                                <h6>Ratione id Debitis</h6>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis, aut at et, ratione id debitis, necessitatibus iure repellendus eveniet explicabo labore perferendis! Maiores nobis minima error impedit ab officia amet?</p>
                                <hr />
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="modal fade" id="updateBusiness" tabIndex="-1" role="dialog" aria-labelledby="updateBusinessLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="updateBusinessLabel">Update Business</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form  action="" method="POST">
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="name">Business Name:</label>
                                        <input type="text" name="name" className="form-control" value="" />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="location">Location:</label>
                                        <select name="location" id="" className="form-control">
                                            <option value="">Kampala</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="cat">Category:</label>
                                        <select name="cat" className="form-control" id="cat">
                                            <option value="">Consultancy</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <input type="submit" value="Update" className="btn btn-block btn-primary" />	
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
