import React, {Component} from 'react';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import swal from 'sweetalert';
import * as BusinessActions from '../../actions/BusinessActions';
import BusinessStore from '../../stores/BusinessStore';

export default class DeleteBusiness extends Component{
    constructor(props){
        super(props);
        this.state = {
            showDelete: false,
            deleteAlert: null
        }
    };

    onOpenModal = () => {
        this.setState({ open: true });
    }

    onCloseModal = () => {
        this.setState({ open: false });
    }

    // use swal elements to prompt the user on deleting a business
    mountAlertComponent = () => {
        const deleteComponent = () => {
            return swal({
                title: "Are you sure?",
                type: "warning",
                showCancelButton:true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Delete",
                closeOnConfirm: false,
                closeOnCancel: false,
                showLoaderOnConfirm: true
            },
                (isConfirm) => {
                    if(isConfirm){
                        BusinessActions.deleteBusiness(this.props.business.id)
                        BusinessStore.on('delete', ()=>{
                            swal({
                                title:"Deleted!",
                                text:"Business has been deleted successfully.",
                                type:"success",
                            })
                        });
                    }else{
                        swal("Cancelled", "", "error");
                    }
                }
            )
        };
        this.setState({ deleteAlert: deleteComponent()})
    }

    render(){
        return(
            <div className="owner-btn">  
                <button 
                    type="button"
                    onClick={() => { this.mountAlertComponent()}}
                    className="btn btn-danger btn-block btn-sm">
                        <span className="mr1">Delete</span>
                        <i className="fas fa-trash-alt"></i>
                </button>
                {this.state.deleteAlert}
            </div>
        )
    }
}
