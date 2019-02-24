import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {crossBrowserFetch} from '../model/crossBrowserFetch';
import Calendar from '../controllers/calendar';
import classNames from 'classnames';

class ShopItems extends React.Component {

    state = {
        items: [],
        itemsFiltered: [],
        itemsColors: [],
        
        cartCount: 0,
        cartItems: [],

        showModal: false,

        calendarRangeFlr: {},
        priceRangeFlr: { from: 0, to: 1000 },
        inStockFlr: false,
        colorFlr: 'All'
    }

    componentDidMount() {
        crossBrowserFetch('store.json')
            .then(json=>{
                const items = json.items.reduce((res, el)=>[...res,{...el, quanity: 0}],[]);
                const itemsFiltered = items;
                this.setState({
                    items, itemsFiltered,
                    itemsColors: json.items.reduce((res,el)=>~res.indexOf(el.Color) ? res : [...res,el.Color], ['All']),
                })
            });
    }

    filterItems = () => {
        const { items, calendarRangeFlr, inStockFlr, priceRangeFlr, colorFlr } = this.state;

        const { calendarFromValue: fromClnd, calendarToValue: toClnd } = calendarRangeFlr;

        let itemsFiltered = items.filter( (el) => {
            const elDate = new Date(el['Issue date']);
            return elDate >= fromClnd && elDate <= toClnd;
        }); 
        // Calendar filter

        if ( inStockFlr ) { itemsFiltered = itemsFiltered.filter( (el) => el.InStock ) }
        // Instock filter

        if ( colorFlr !== 'All' ) { itemsFiltered = itemsFiltered.filter( (el) => el.Color ===  colorFlr) }
        // Color filter

        const { from: fromPrice, to: toPrice } = priceRangeFlr;
        
        itemsFiltered = itemsFiltered.filter( (el) => parseInt(el.Price) >= fromPrice && parseInt(el.Price) <= toPrice );
        // Price filter

        this.setState({ itemsFiltered: itemsFiltered });
    }

    orderItem = (id) => {
        let items = [...this.state.items];
        items = items.map((el) => el.id === id ? {...el, quanity: el.quanity+1} : el);
        
        const cartItems = items.filter( (el) => el.quanity );

        const cartCount = cartItems.reduce( (res,el) => res+el.quanity, 0 );
        
        this.setState({ cartItems, cartCount, items });
    }

    calendarChangeHandler = (calendarRangeFlr) => {
        
        let newRange = {
            ...this.state.calendarRangeFlr,
            ...calendarRangeFlr
        };

        this.setState({calendarRangeFlr: newRange}, this.filterItems);
    }

    inStockFlrChangeHandler = ({ target: { checked } }) => this.setState({ inStockFlr: checked }, this.filterItems);

    priceChangeHandler = (method, { target: {value} }) => {
        const valueInt = parseInt( value );

        const { priceRangeFlr } = this.state;
        const {from, to} = priceRangeFlr;
        let newRange;

        if ( valueInt > from && method === 'to' || valueInt < to && method === 'from' ) { 
            newRange = {...priceRangeFlr, [method]: valueInt};
        } else if ( method === 'to' ) {
            newRange = {...priceRangeFlr, [method]: from + 1};
        } else {
            newRange = {...priceRangeFlr, [method]: to - 1};
        }
        this.setState({ priceRangeFlr: newRange}, this.filterItems);
    }

    colorChangeHandler = ({ target: { options } }) => this.setState({ colorFlr: options[options.selectedIndex].value }, this.filterItems);

    modalShow = () => this.setState({ showModal: !this.state.showModal });

    render(){

        const modalClassName = classNames('modal', { 'modal--show': this.state.showModal });
        const authorized = this.props.email;

        if (!authorized) {
            return (
                <header className="row mb-4 header">
                    <div className="col-5"></div>
                    
                    <div className="col-4">
                        <Link to="/register" className="mr-5">Sign up</Link>
                        <Link to="/">Log in</Link>
                    </div>
                    
                    <div className="col-3" onClick={ this.modalShow }>
                        <span>Cart: {this.state.cartCount} items</span>
                    </div>
                
                </header>)
        }

        return (
            <>
                <header className="row mb-4 header">
                    
                    <div className="col-5"></div>
                    
                    <div className="col-4">
                        <span className="text-success">Authorized as {authorized}</span>
                    </div>
                    
                    <div className="col-3" onClick={ this.modalShow }>
                        <span className="header__cart">Cart: {this.state.cartCount} items</span>
                    </div>
                
                </header>

                <article className="row mb-4 filter">

                    <div className="row col-12 mb-4 justify-content-center">
                        
                        <Calendar 
                            calendarChangeHandler = { this.calendarChangeHandler.bind(this) }
                        />
                    
                        <div className="row col-4 align-items-center">
                            <span className="filter__stock-mark">In stock only</span>
                            <input 
                                className="filter__stock-check" 
                                type="checkbox"
                                onChange = {this.inStockFlrChangeHandler}
                                checked = { this.state.inStockFlr } 
                            />
                        </div>

                    </div>
                
                    <div className="row col-12 justify-content-center">

                        <div className="row col-4 col-xl-3 align-items-center">
                            <span className="filter__caption mr-2">Price from:</span>
                            <input 
                                type="number" 
                                className="form-control filter__price-input"
                                onChange={this.priceChangeHandler.bind(this,'from')}
                                value = { this.state.priceRangeFlr.from }
                            />
                        </div>

                        <div className="row col-4 col-xl-3 align-items-center">
                            <span className="mr-2 filter__caption filter__caption--price-to">to:</span>
                            <input 
                                type="number" 
                                className="form-control filter__price-input"
                                onChange={this.priceChangeHandler.bind(this,'to')}
                                value = { this.state.priceRangeFlr.to }
                            />
                        </div>

                        <div className="row col-4 align-items-center">
                            <span className="filter__stock-mark">Color: </span>
                            <select 
                                className="form-control filter__stock-select" 
                                value={this.state.colorFlr}
                                onChange={this.colorChangeHandler}
                            >
                                {this.state.itemsColors.length && this.state.itemsColors.map(elem=>(
                                    <option key={elem} value={elem}>{elem}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                </article>

                <hr className="my-4" />

                <main className="row items-wrap">
                
                    {this.state.itemsFiltered.length && this.state.itemsFiltered.map((elem)=>(
                                
                    <div className="row col-12 items__item p-4 mb-4 border border-secondary" key={elem.id}>
                        
                        <div className="col-2">
                            <img src={elem.Image} className="img-fluid" alt="" />
                        </div>
                        
                        <div className="row col-10">
                            <div className="col-12 row mb-2">
                                <span className="col-4">{elem.Name}</span>
                                <span className="col-4">{elem['Issue date']}</span>
                                <span className="col-4">{elem.Price}</span>
                            </div>

                            <div className="col-12 row align-items-center">
                                <span className="col-4 text-info">{elem.Color}</span>
                                <span className="col-4 text-secondary">{elem.InStock ? 'In stock' : 'Not in stock'}</span>
                                <button 
                                    type="button" 
                                    className="btn btn-warning"
                                    onClick={this.orderItem.bind(this,elem.id)}
                                >
                                    Order
                                </button>
                            </div>
                        
                        </div>

                    </div>    
                                 
                    ) )}

                </main>
                
                <div className={ modalClassName }  onClick={this.modalShow}>
                    <div className="modal-dialog modal-lg">
                    <div className="modal-header bg-white">
                        <h5 className="modal-title" id="exampleModalLabel">Your cart</h5>
                        <button type="button" className="close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                        <div className="modal-content p-4">
                            {this.state.cartItems.length && this.state.cartItems.map((elem,index)=>(
                                <div className="row border p-2 mb-4 col-10 mx-auto" key={elem.id}>
                                    <div className="col-2 align-self-center">
                                        <img src={elem.Image} className="img-fluid" alt="" />
                                    </div>
                                    
                                    <div className="row col-10">
                                        <div className="col-12 row mb-2">
                                            <span className="col-4">{elem.Name}</span>
                                            <span className="col-4">{elem['Issue date']}</span>
                                            <span className="col-4">{elem.Price}</span>
                                        </div>

                                        <div className="col-12 row align-items-center">
                                            <span className="col-4 text-info">{elem.Color}</span>
                                            <span className="col-4 text-secondary">{elem.InStock ? 'In stock' : 'Not in stock'}</span>
                                            <span> Quanity: {elem.quanity}</span>
                                        </div>
                                    
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            
            </>
        )
    }
}

export default connect(store=>store)(ShopItems);
