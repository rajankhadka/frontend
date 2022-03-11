import React, { useEffect, useRef, useState } from 'react';
import { addNewBill, getAllBill, sellItems } from '../../api/bills.api';
import Modal from '../../components/modal/Modal';

//homepage css
import classes from '../HomePage/HomePage.module.css';
import billClasses from './BillPage.module.css';

function BillPage() {
    const [bills, setBills] = useState([]);
    const [bill, setBill] = useState(null);
    const [modalId, setModalId] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);
    const [billData, setBillData] = useState({
        billName:'',
        billPaymantType:'',
        billType:'',
        billAddress:'',
        billContact:'',
        billregistration:'',
        // billDueAmount:0
    });

    const billTotalAmountRef = useRef(null);
    const billPaidAmountRef = useRef(null);

    const [addProductHTML, setAddProductHTML] = useState([{
        itemName:'',
        itemCatagory:'',
        itemQuantity:0,
        itemBuyPrice:0,
        itemSellPrice:0,
    }]);

    //sell Product
    const [sellProductHTML, setSellProductHTML] = useState([{
        itemName:'',
        itemQuantity:0,
    }]);

    useEffect(() => {
        fetch(getAllBill,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'authorization':`Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(res => {
            if(!(res.status === 200)) {
                throw new Error('UnAuthorized');
            };
            return res.json();
        })
        .then(data => {
            if(data.data.statusCode === 200){
                setBills([...data.data.bills]);
            }else{
                throw new Error('UnAuthorized');
            }
        })
        .catch(error => {
            alert(`${error.name} ${error.message}`);
        })
    }, []);
    

    let _bills = null;
    if(bills.length > 0){
        _bills =(
            bills.map((bill,index) => {
                return (
                    <div className={["card text-center",classes.item].join(" ")} key={index}>
                        <div className="card-header">
                            {bill.billName}
                        </div>

                        <div className="card-body">
                            <h5 className="card-title">Registration No. : {bill.billregistration}</h5>
                            <div className={classes.itemInfo}>
                                <p className="card-text">Payment Type: {bill.billPaymantType}</p>
                                <p className="card-text">Bill Type: {bill.billType}</p>
                                <p className="card-text">Bill Amount: {bill.billTotalAmount}</p>
                                <p className="card-text">Bill Paid: {bill.billpaidAmount}</p>
                                <p className="card-text">Bill Due: {bill.billDueAmount}</p>
                            </div>

                            <button
                                type='button'
                                className={["btn", "btn-primary",classes.button].join(" ")}
                                onClick ={() =>{
                                    setBill({...bill});
                                    handleOpen();
                                    setModalId('view bill');
                                }}
                            >
                                View Bill
                            </button>
                        </div>

                        <div className="card-footer text-muted">
                            Bill Added Date: {bill.createdAt}
                        </div>
                    </div>
                )
            })
        )
    }

    let _addProduct = null;
    if(addProductHTML.length > 0){
        _addProduct = addProductHTML.map((product,index) =>{
            return (
                <div key={index}>
                    <p className={billClasses.itemCenter}>{index + 1}</p>
                    <div className="row">
                        <div className="col form-floating">
                            <input type="text" className="form-control form-control-sm" placeholder="Product Name" 
                                id="itemName"
                                value={product.itemName}
                                onChange={(event) => productDataonChangeHandler(event,index)}
                                required
                            />
                            <label htmlFor="itemName">Product Name</label>
                        </div>

                        <div className="col form-floating">
                            <input type="text" className="form-control form-control-sm" placeholder="Product Category" 
                                id="itemCatagory"
                                required
                                value={product.itemCatagory}
                                onChange={(event) => productDataonChangeHandler(event,index)}
                            />
                            <label htmlFor="itemCatagory">Product Category</label>
                        </div>
                    </div>
                    <br />

                    <div className="row">
                        <div className="col form-floating">
                            <input type="number" className="form-control form-control-sm" placeholder="Product Quantity" 
                                id="itemQuantity"
                                required
                                value={product.itemQuantity}
                                onChange={(event) => productDataonChangeHandler(event,index)}
                            />
                            <label htmlFor="itemQuantity">Product Quantity</label>
                        </div>

                        <div className="col form-floating">
                            <input type="number" className="form-control form-control-sm" placeholder="Product Buy Price"  
                                id="itemBuyPrice"
                                required
                                value={product.itemBuyPrice}
                                onChange={(event) => productDataonChangeHandler(event,index)}
                            />
                            <label htmlFor="itemBuyPrice">Product Buy Price</label>

                        </div>

                        <div className="col form-floating">
                            <input type="number" className="form-control form-control-sm" placeholder="Product Sell Price" 
                                id="itemSellPrice"
                                required
                                value={product.itemSellPrice}
                                onChange={(event) => productDataonChangeHandler(event,index)}
                            />
                            <label htmlFor="itemSellPrice">Product Sell Price</label>
                        </div>
                        
                    </div>
                    <hr />
                </div>
            )
        })
    }

    let _addSellProduct = null;
    if(sellProductHTML.length > 0){
        _addSellProduct = sellProductHTML.map((sellProduct,index) =>{
            return(
                <div key={index}>
                    <p className={billClasses.itemCenter}>{index + 1}</p>
                    <div className="row">
                        <div className="col form-floating">
                            <input type="text" className="form-control form-control-sm" placeholder="Product Name" 
                                id="itemName"
                                value={sellProduct.itemName}
                                onChange={(event) => sellProductDataonChangeHandler(event,index)}
                                required
                            />
                            <label htmlFor="itemName">Product Name</label>
                        </div>

                        <div className="col form-floating">
                            <input type="text" className="form-control form-control-sm" placeholder="Product Category" 
                                id="itemQuantity"
                                required
                                value={sellProduct.itemQuantity}
                                onChange={(event) => sellProductDataonChangeHandler(event,index)}
                            />
                            <label htmlFor="itemCatagory">Product Quantity</label>
                        </div>
                    </div>
                    <hr />
                </div>
            );
        })
    }

    //handler
    const sellAddHandler = (event) =>{
        event.preventDefault();
        console.log(sellProductHTML);
        fetch(sellItems,{
            method:'POST',
            headers:{
                'content-type':'application/json',
                'authorization':`Bearer ${localStorage.getItem('accessToken')}`,
            },
            body:JSON.stringify({
                items:[...sellProductHTML]
            })
        })
            .then(res =>{
                if((res.status === 401)) {
                    throw new Error('UnAuthorized');
                };
                return res.json();
            })
            .then(data =>{
                console.log(data);
                if(!(data.statusCode === 200)) throw new Error(data.message);
                alert(data.message + "\nTotal Price :" + data.data.totalPrice);
                handleClose();
                setSellProductHTML([{
                    itemName:'',
                    itemQuantity:0,
                }])
            })
            .catch(error => {
                alert(`${error.name} ${error.message}`);
            })
    }

    const addSellProductHandler = () =>{
        setSellProductHTML((prevState) => {
            return [...prevState,{
                itemName:'',
                itemQuantity:0,
            }]
        });
    }

    const billDataonChangeHandler = (event) =>{
        const id = event.target.id;
        const value = event.target.value;
        const _data = {};
        _data[id] = (value);
        
        setBillData(() =>{
            return{
                ...billData,
                ..._data,
            }
        });
    }

    const addProductHandler = () =>{
        setAddProductHTML(prevState => {
            return [...prevState,{
                itemName:'',
                itemCatagory:'',
                itemQuantity:0,
                itemBuyPrice:0,
                itemSellPrice:0,
            }]
        });
    }

    const sellProductDataonChangeHandler = (event,index) =>{
        const {id,value} = event.target;
        let sellProduct = sellProductHTML;
        let _sellProduct =sellProduct[index];
        // console.log(id,value);
        if(id === 'itemQuantity'){
            _sellProduct[id] = parseInt(value);
        }else{
            _sellProduct[id] = (value);
        }
        setSellProductHTML([...sellProduct]);
    }

    const productDataonChangeHandler = (event,index) =>{
        const {id,value} = event.target;
        let product = addProductHTML;
        let _product = product[index];
        _product[id] = value;
        let _totalAmount = 0;
        for(let i=0;i<product.length ;i++){
            // console.log(product[i]);
            _totalAmount += product[i].itemBuyPrice * product[i].itemQuantity;
        }
        billTotalAmountRef.current.value = _totalAmount;
        setAddProductHTML([...product]);
    }

    const billAddHandler = (event) =>{
        event.preventDefault();
        const finalBillData = {
            ...billData,
            billTotalAmount:billTotalAmountRef.current.value,
            billpaidAmount:billPaidAmountRef.current.value,
            items:[...addProductHTML],
            billDueAmount:billTotalAmountRef.current.value - billPaidAmountRef.current.value,
        }

        // console.log(finalBillData);

        fetch(addNewBill,{
            method:'post',
            headers:{
                'content-type':'application/json',
                'authorization':`Bearer ${localStorage.getItem('accessToken')}`
            },
            body:JSON.stringify({
                ...finalBillData
            })
        })
            .then(res => {
                if(!(res.status === 201)) {
                    throw new Error('UnAuthorized');
                };
                return res.json();
            })
            .then(data => {
                // console.log(data);
                if(data.statusCode === 201){
                    setBills(prevState =>{

                        return [...prevState,{...finalBillData}];
    
                    });
                    setBillData({
                        billName:'',
                        billPaymantType:'',
                        billType:'',
                        billAddress:'',
                        billContact:'',
                        billregistration:'',
                    })
                    setAddProductHTML([{
                        itemName:'',
                        itemCatagory:'',
                        itemQuantity:0,
                        itemBuyPrice:0,
                        itemSellPrice:0,
                    }]);
                    billTotalAmountRef.current.value = null;
                    billPaidAmountRef.current.value = null;
                    handleClose();

                }else{
                    throw new Error(data.data.message);
                }
                
            })
            .catch(error => {
                alert(`${error.name} ${error.message}`);
            })
    }

    return (
        <div className={classes.homePage}>
            <div className={classes.items}>
                <nav className="navbar navbar-light">
                    <div className="container-fluid">
                        <button
                            type='button'
                            className={["btn", "btn-primary",classes.button].join(" ")}
                            onClick ={() =>{
                                handleOpen();
                                setModalId('add bill');
                            }}
                        >
                            Add Bill
                        </button>

                        <button
                            type='button'
                            className={["btn", "btn-dark",classes.button].join(" ")}
                            onClick ={() =>{
                                handleOpen();
                                setModalId('sell product')
                            }}
                        >
                            Sell Product
                        </button>
                    </div>
                </nav>
                { _bills }
            </div>


            {/* view bill */}
            {
                modalId === 'view bill' &&
                <Modal
                    modalOpen={modalOpen}
                    handleClose ={handleClose}
                >
                    <h5 className="modal-title">Bill Name : {bill.billName}</h5>
                    <hr />
                    <p> Bill Registration : {bill.billregistration} </p>
                    <p> Bill createdAt Date : {bill.date} </p>
                    <p> Bill Type : {bill.billType} </p>
                    <p> Bill Payment Type : {bill.billPaymantType} </p>
                    <p> Bill Address : {bill.billAddress} </p>
                    <p> Bill Contact : {bill.billContact} </p>
                    <p> Bill Total Amount : {bill.billTotalAmount} </p>
                    <p> Bill Paid Amount : {bill.billpaidAmount} </p>
                    <p> Bill Due Amount : {bill.billDueAmount} </p>
                </Modal>
            }

            {/* sell product  */}
            {
                modalId === 'sell product' &&
                <Modal
                    modalOpen={modalOpen}
                    handleClose={handleClose}
                    height={'90vh'}
                    overflowY = {'scroll'}
                >
                    <h5 className="modal-title">{modalId}</h5>
                    <hr />
                    {/* sell product form */}
                    {/* Add Product */}
                    <form onSubmit ={sellAddHandler}>
                        {_addSellProduct}
                        <div className="row">
                            <span onClick={addSellProductHandler} className="btn btn-primary">Add Product</span>
                        </div>
                        <br />
                        <div className="row">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                        <br />
                    </form>
                    
                </Modal>
            }

            {/* add bill */}
            {
                modalId === 'add bill' &&
                <Modal
                    modalOpen={modalOpen}
                    handleClose ={handleClose}
                    height = {'90vh'}
                    overflowY = {'scroll'}
                >
                    <h5 className="modal-title">{modalId}</h5>
                    <hr />
                    {/* add bill form  */}
                    <p>Add Bill Info</p>
                    <form onSubmit ={billAddHandler}>
                        <div className="row">
                            <div className="col">
                                <input type="text" className="form-control" placeholder="Bill Name"  
                                    id="billName"
                                    value={billData.billName}
                                    onChange={billDataonChangeHandler}
                                />
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" placeholder="Bill Registration" 
                                    value={billData.billregistration}
                                    id="billregistration"
                                    onChange={billDataonChangeHandler}
                                />
                            </div>
                        </div>
                        <br />

                        <div className="row">
                            <div className="col">
                                <input type="text" className="form-control" placeholder="Bill Type"  
                                    value={billData.billType}
                                    id="billType"
                                    onChange={billDataonChangeHandler}
                                />
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" placeholder="Bill Payment Type" 
                                    value={billData.billPaymantType}
                                    id="billPaymantType"
                                    onChange={billDataonChangeHandler}
                                />
                            </div>
                        </div>
                        <br />

                        <div className="row">
                            <div className="col">
                                <input type="text" className="form-control" placeholder="Bill Address"  
                                    value={billData.billAddress}
                                    id="billAddress"
                                    onChange={billDataonChangeHandler}
                                />
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" placeholder="Bill Contact" 
                                    value={billData.billContact}
                                    id="billContact"
                                    onChange={billDataonChangeHandler}
                                />
                            </div>
                        </div>
                        <br />

                        <div className="row">
                            <div className="col">
                                <input type="number" className="form-control" placeholder="Bill Total Amount"  
                                    id="billTotalAmount"
                                    ref={billTotalAmountRef}
                                    disabled
                                />
                            </div>
                        </div>
                        <br />

                        <div className="row">
                            <div className="col">
                                <input type="number" className="form-control" placeholder="Bill Paid Amount" 
                                    id="billpaidAmount"
                                    ref={billPaidAmountRef}
                                />
                            </div>
                            {/* <div className="col">
                                <input type="number" className="form-control" placeholder="Bill Due Amount"  
                                    id="billDueAmount"
                                    disabled
                                    value={billData.billDueAmount}
                                />
                            </div> */}
                            
                        </div>
                        <br />

                        <div>
                            {_addProduct}
                        </div>

                        {/* Add Product */}
                        <div className="row">
                            <span onClick={addProductHandler} className="btn btn-primary">Add Product</span>
                        </div>
                        <br />
                        <div className="row">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </Modal>
            }
        </div>
    )
}

export default BillPage;