import React from 'react';
import Calendar from 'react-calendar';
import propTypes from 'prop-types';

export default class FilterCalendar extends React.Component {

    state = {
        calendarFromValue: new Date(2018,1,1),
        calendarToValue: new Date(2019,11,1),
        calendarVisible: null
    }

    componentDidMount(){
        const {calendarFromValue, calendarToValue} = this.state;
        
        this.props.calendarChangeHandler({ 
            calendarToValue,
            calendarFromValue
        });
    }

    calendarViewHandler = (method) => this.setState({calendarVisible: method});

    calendarChangeHandler = (method, value ) => {
        const {calendarFromValue, calendarToValue} = this.state;
        
        if ( value >= calendarToValue && method === 'from' || value <= calendarFromValue && method === 'to' ) { 
            
            this.setState({ calendarVisible: null });
            
            return; 

        } else {
            let methodProp = method === 'to' ? 'calendarToValue' : 'calendarFromValue';
            
            this.setState({ 
                calendarVisible: null,
                [methodProp]: value
            });
            
            this.props.calendarChangeHandler({ [methodProp]: value });
    }

    }

    render(){
        const { calendarFromValue, calendarToValue, calendarVisible } = this.state;
        return (
            <React.Fragment>
                <div className="row col-4 col-xl-3 align-items-center">
                    <span className="mr-2 filter__caption">From:</span>
                    <input 
                        type="text" 
                        className="form-control filter__date-input"
                        onClick={this.calendarViewHandler.bind(this,'from')}
                        value={calendarFromValue.toLocaleDateString('en-US')}
                        readOnly={true}
                    />
                    <i className="fa fa-calendar filter__date-icon" aria-hidden="true"></i>
                    <Calendar 
                        className={calendarVisible==='from' ? "react-calendar--show" : ""} 
                        onChange={this.calendarChangeHandler.bind(this,'from')}
                        value={calendarFromValue}
                    />
                </div>
            
                <div className="row col-4 col-xl-3 align-items-center">
                    <span className="mr-2 filter__caption">To:</span>
                    <input 
                        type="text" 
                        className="form-control filter__date-input"
                        onClick={this.calendarViewHandler.bind(this,'to')}
                        value={calendarToValue.toLocaleDateString('en-US')}
                        readOnly={true}
                    />
                    <i className="fa fa-calendar filter__date-icon" aria-hidden="true"></i>
                    <Calendar 
                        className={calendarVisible==='to' ? "react-calendar--show" : ""} 
                        onChange={this.calendarChangeHandler.bind(this,'to')}
                        value={calendarToValue}
                    />
                </div>
            </React.Fragment>
        )
    }
}

FilterCalendar.propTypes = {
    calendarChangeHandler: propTypes.func.isRequired
}
