import React, {Component} from 'react';

class FormContainer extends Component {
    state = {
        value: ''
    };

    handleChange = (e) => {
        this.setState({value: e.target.value});
    };

    handleSubmit = (e) => {
        let value = this.state.value.trim();

        if (value.length > 0) {
            this.props.onSubmit(value);
            this.setState({value: ''});
        }

        e.preventDefault();
    };

    render() {
        return (
            <div className='form-container'>
                <form onSubmit={this.handleSubmit}>

                    <div className='input-group'>
                        <textarea className='form-control' placeholder='Say something already...' value={this.state.value}
                                  onChange={this.handleChange} rows={3}/>
                        <div className='input-group-append'>
                            <button className='btn btn-secondary input-group-text' type='submit'>
                                <i className='fas fa-arrow-alt-circle-up fa-2x'/>
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        );
    }
}

export default FormContainer;