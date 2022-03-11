import React, { useEffect, useState } from 'react'
import { deleteSpecificItem, getAll, updateBuyPrice, updateSellPrice, updateSpecificItemInfo } from '../../api/items.api';
import Modal from '../../components/modal/Modal';
import classes from './HomePage.module.css';

function HomePage(props) {
    
    const [items, setItems] = useState([]);
    const [modalId, setModalId] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);
    const [selectItem, setSelectItem] = useState({});
    const [updatePrice, setUpdatePrice] = useState(0);
    const [newProductName, setNewProductName] = useState('');
    const [newProductCategory, setNewProductCategory] = useState('');
    const [updateProductSold, setUpdateProductSold] = useState(0);
    const [updateProductQuantity, setUpdateProductQuantity] = useState(0);

    useEffect(() => {
        fetch(getAll,{
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
            if(data.statusCode === 200){
                setItems([...data.data.items]);
            }else{
                throw new Error('UnAuthorized');
            }
        })
        .catch(error => {
            alert(`${error.name} ${error.message}`);
        })
      
    }, []);

    // handler
    const updateProductInfoHandler = (_item) =>{
        const data = {};
        updateProductSold !== 0 ? (data['itemSold'] = updateProductSold) : (data['itemSold'] = _item.itemSold) ;
        newProductName.length > 0 ? (data['newItemName'] = newProductName) : (data['newItemName'] = _item.itemName);
        updateProductQuantity !== 0 ? (data['itemQuantity'] = updateProductQuantity) : (data['itemQuantity'] = _item.itemQuantity);
        newProductCategory.length > 0 ? (data['itemCatagory'] = newProductCategory) : (data['itemCatagory'] = _item.itemCatagory);
        console.log(_item);
        fetch(updateSpecificItemInfo,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body:JSON.stringify({
                oldItemName:_item.itemName,
                ...data,
            }),
        })
            .then(res => res.json())
            .then(data => {
                if(data.statusCode !== 200){
                    throw new Error(data.message);
                }
                setItems(() =>{
                    return items.map(item => {
                        if(item.itemName !== _item.itemName){
                            return item;
                        }else{
                            return {
                                ..._item,
                                itemName:newProductName.length > 0 ? newProductName : _item.itemName,
                                itemCatagory:newProductCategory.length > 0 ? newProductCategory : _item.itemCatagory,
                                itemSold:updateProductSold !== 0 ? updateProductSold : _item.itemSold,
                                itemQuantity:updateProductQuantity !== 0 ? updateProductQuantity : _item.itemQuantity,
                            }
                        }
                    });
                });
                setNewProductCategory('');
                setNewProductName('');
                setUpdateProductQuantity(0);
                setUpdateProductSold(0);
                handleClose();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const updateSellHandler = (_item) =>{
        fetch(updateSellPrice,{
            method:'put',
            mode:'cors',
            headers:{
                'Content-Type':'application/json',
                'authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body:JSON.stringify({
                itemName:_item.itemName,
                price:updatePrice
            }),
        })
            .then(res => {
                return res.json()
            })
            .then(data => {
                if(data.statusCode !== 200){
                    throw new Error(data.message);
                }
                setItems(() =>{
                    return items.map(item => {
                        if(item.itemName !== _item.itemName){
                            return item;
                        }else{
                            return {
                                ..._item,
                                itemSellPrice:updatePrice,
                            }
                        }
                    })
                });
                handleClose();
                setUpdatePrice(0);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const updateBuyHandler = (_item) =>{
        fetch(updateBuyPrice,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body:JSON.stringify({
                itemName:_item.itemName,
                price:updatePrice
            }),
        })
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data);
                if(data.statusCode !== 200){
                    throw new Error(data.message);
                }
                setItems(() =>{
                    return items.map(item => {
                        if(item.itemName !== _item.itemName){
                            return item;
                        }else{
                            return {
                                ..._item,
                                itemBuyPrice:updatePrice,
                            }
                        }
                    })
                });
                handleClose();
            })
            .catch(error => {
                console.log(error);
            });
    }



    const deleteProductHandler = (_item) =>{
        fetch(deleteSpecificItem,{
            method:'delete',
            headers:{
                'Content-Type':'application/json',
                'authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body:JSON.stringify({
                itemName:_item.itemName,
            }),
        })
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data);
                if(data.statusCode !== 200){
                    throw new Error(data.message);
                }
                setItems(() =>{
                    return items.filter(item => item.itemName !== _item.itemName)
                });
                handleClose();
            })
            .catch(error => {
                console.log(error);
            });
        
    }
    
    let inventoryItems = null;
    if(items.length > 0){
        inventoryItems = (
            items.map(item => {
                return(
                    <div className={["card text-center",classes.item].join(" ")} key={item.id}>
                        <div className="card-header">
                            {item.itemCatagory}
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{item.itemName}</h5>
                            <div className={classes.itemInfo}>
                                <p className="card-text">Quantity: {item.itemQuantity}</p>
                                <p className="card-text">Buy Price: {item.itemBuyPrice}</p>
                                <p className="card-text">Sell Price: {item.itemSellPrice}</p>
                                <p className="card-text">Remaining: {item.itemRemaining}</p>
                                <p className="card-text">sold: {item.itemSold}</p>
                            </div>
                            <button
                                type='button'
                                className={["btn", "btn-primary",classes.button].join(" ")}
                                onClick ={() =>{
                                    setSelectItem({...item});
                                    setModalId('viewProduct');
                                    handleOpen();
                                }}
                            >
                                View Product
                            </button>

                            <button
                                type='button'
                                onClick ={() =>{
                                    setSelectItem({...item});
                                    setModalId('updateBuyPrice');
                                    handleOpen();
                                }}
                                className={["btn", "btn-warning",classes.button].join(" ")}>Update Buy Price</button>
                            
                            <button
                                type='button'
                                onClick ={() =>{
                                    setSelectItem({...item});
                                    setModalId('updateSellPrice');
                                    handleOpen();
                                }}
                                className={["btn", "btn-warning",classes.button].join(" ")}
                            >
                                Update Sell Price
                            </button>
                            
                            <button 
                                onClick ={() =>{
                                    setSelectItem({...item});
                                    setModalId('updateProductInfo');
                                    handleOpen();
                                }}
                                type='button'
                                className={["btn", "btn-warning",classes.button].join(" ")}>Update Product Info</button>
                            
                            <button 
                                onClick ={() =>{
                                    setSelectItem({...item});
                                    setModalId('deleteProduct');
                                    handleOpen();
                                }}
                                type='button'
                                className={["btn", "btn-danger",classes.button].join(" ")}>Delete Product</button>
                        </div>
                        <div className="card-footer text-muted">
                            Item Added Date: {item.createdAt}
                        </div>
                    </div> 
                )
            })
        )
    }

    return (
        <div className={classes.homePage}>
           
            <div className={classes.items}>
                <nav className="navbar navbar-light">
                    <div className="container-fluid">
                        <form className="d-flex">
                            <input className="form-control me-10" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </nav>
                {inventoryItems}
            </div>

            {/* view modal product */}
            {
                modalId === 'viewProduct' &&
                <Modal 
                    modalOpen={modalOpen} 
                    handleClose={handleClose}
                >
                    <h5 className="modal-title">{modalId}</h5>
                    <hr />
                    <p>Product Name : {selectItem.itemName}</p>
                    <p>Product Category : {selectItem.itemCatagory}</p>
                    <p>Quantity : {selectItem.itemQuantity}</p>
                    <p>Buy Price : {selectItem.itemBuyPrice}</p>
                    <p>Sell Price : {selectItem.itemSellPrice}</p>
                    <p>Product Sold : {selectItem.itemSold}</p>
                    <p>Product Remaining : {selectItem.itemRemaining}</p>
                    <p>Product Added Date : {selectItem.createdAt}</p>
                </Modal>
            }

            {/* update buy price modal */}
            {
                modalId === 'updateBuyPrice' &&
                <Modal 
                    modalOpen={modalOpen} 
                    handleClose={handleClose}
                >
                    <h5 className="modal-title">{modalId}</h5>
                    <hr />
                    <p>Product Name : {selectItem.itemName}</p>
                    <p>Old Buy Price : {selectItem.itemBuyPrice}</p>
                    <div className="mb-3">
                        <label htmlFor="updateBuyPrice" className="form-label">New Buy Price :</label>
                        <input type="number" className="form-control" id="updateBuyPrice" 
                            value={updatePrice}
                            onChange={(event) => setUpdatePrice(event.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => updateBuyHandler(selectItem)}
                        type='button'
                        className={["btn", "btn-warning",classes.button].join(" ")}
                    >
                        Update Buy Price Product
                    </button>

                    <button 
                        type='button'
                        className={["btn", "btn-secondary",classes.button].join(" ")}
                        onClick={() => handleClose()}
                    >
                        Cancel
                    </button>
                </Modal>
            }

            {/* update sell price modal */}
            {
                modalId === 'updateSellPrice' &&
                <Modal 
                    modalOpen={modalOpen} 
                    handleClose={handleClose}
                >
                    <h5 className="modal-title">{modalId}</h5>
                    <hr />
                    <p>Product Name : {selectItem.itemName}</p>
                    <p>Old Sell Price : {selectItem.itemSellPrice}</p>
                    <div className="mb-3">
                        <label htmlFor="updateBuyPrice" className="form-label">New Sell Price :</label>
                        <input type="number" className="form-control" id="updateBuyPrice" 
                            value={updatePrice}
                            onChange={(event) => setUpdatePrice(event.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => updateSellHandler(selectItem)}
                        type='button'
                        className={["btn", "btn-warning",classes.button].join(" ")}
                    >
                        Update Sell Price Product
                    </button>

                    <button 
                        type='button'
                        className={["btn", "btn-secondary",classes.button].join(" ")}
                        onClick={() => handleClose()}
                    >
                        Cancel
                    </button>
                </Modal>
            }

            {/* update info modal */}
            {
                modalId === 'updateProductInfo' &&
                <Modal 
                    modalOpen={modalOpen} 
                    handleClose={handleClose}
                >
                    <h5 className="modal-title">{modalId}</h5>
                    <hr />
                    <p>Product Name : {selectItem.itemName}</p>
                    <div className="mb-3">
                        <label htmlFor="newProductName" className="form-label">New Product Name :</label>
                        <input type="text" className="form-control" id="newProductName" 
                            value={newProductName}
                            onChange={(event) => setNewProductName(event.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="productCategory" className="form-label">Update Product Category :</label>
                        <input type="text" className="form-control" id="productCategory" 
                            value={newProductCategory}
                            onChange={(event) => setNewProductCategory(event.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="updateQuantity" className="form-label">Update Product Quantity :</label>
                        <input type="number" className="form-control" id="updateQuantity" 
                            value={updateProductQuantity}
                            onChange={(event) => setUpdateProductQuantity(event.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="productSold" className="form-label">Update Product Sold :</label>
                        <input type="number" className="form-control" id="productSold" 
                            value={updateProductSold}
                            onChange={(event) => setUpdateProductSold(event.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => updateProductInfoHandler(selectItem)}
                        type='button'
                        className={["btn", "btn-warning",classes.button].join(" ")}
                    >
                        Update Product Info
                    </button>

                    <button 
                        type='button'
                        className={["btn", "btn-secondary",classes.button].join(" ")}
                        onClick={() => handleClose()}
                    >
                        Cancel
                    </button>
                </Modal>
            }

            {/* delete modal */}
            {
                modalId === 'deleteProduct' &&
                <Modal 
                    modalOpen={modalOpen} 
                    handleClose={handleClose}
                >
                    <h5 className="modal-title">{modalId}</h5>
                    <hr />
                    <p>Product Name : {selectItem.itemName}</p>
                    <button 
                        onClick={() => deleteProductHandler(selectItem)}
                        type='button'
                        className={["btn", "btn-danger",classes.button].join(" ")}
                    >
                        Delete Product
                    </button>

                    <button 
                        type='button'
                        className={["btn", "btn-secondary",classes.button].join(" ")}
                        onClick={() => handleClose()}
                    >
                        Cancel
                    </button>
                </Modal>
            }
            
        </div>
    )
}

export default HomePage;