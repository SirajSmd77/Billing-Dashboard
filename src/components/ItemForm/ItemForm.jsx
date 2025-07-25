import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assests";
import { AppContext } from '../../context/AppContext';
import axios from "axios";
import { addItem } from "../../Service/ItemService";
import toast from "react-hot-toast";



const ItemForm = () => {

    const { categories, itemsData, setItemsData, setCategories } = useContext(AppContext);


    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        categoryId: "",
        price: "",
        description: "",
    });

    const onChangeHandler = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setData((data) => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("item", JSON.stringify(data));
        formData.append("file", image);

        try {
            if (!image) {
                toast.error("Please Select image");
                return;
            }
            console.log("item form data...", formData)
            const response = await addItem(formData);
            if (response.status === 201) {
                console.log("inside if >>>>>>")
                setItemsData([...itemsData, response.data]);
                setCategories((prevCategories) => prevCategories.map((category) => category.categoryId === data.categoryId ? { ...category, items: category.items + 1 } : category))
                toast.success("Item added Successfully");
                setData({
                    name: "",
                    price: "",
                    description: "",
                    categoryId: "",
                });
                setImage(false);
            } else {
                console.log("inside else ...... :")
                toast.error("Unable to add items");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to add items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("categories", categories);
        console.log("data", data);

    }, [])

    return (
        // <div className="item-form-container"style={{height:'100vh',overflowY:'auto',overflowX:'hidden'}}>
        <div className="item-form-container" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden', paddingBottom: '80px' }}>
            <div className="row mt-4 mb-5">



                <div className="row">
                    <div className="card col-md-8 form-containeer">
                        <div className="card-body">
                            <form onSubmit={onSubmitHandler}>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">
                                        <img src={image ? URL.createObjectURL(image) : assets.upload} alt="" width={48} />
                                    </label>
                                    <input type="file" name="image" id="image" className="form-control" hidden onChange={(e) => { setImage(e.target.files[0]) }} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text"
                                        name="name"
                                        id="name"
                                        className="form-control"
                                        placeholder="Item Name"
                                        onChange={onChangeHandler}
                                        value={data.name}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-lable" htmlFor="category">
                                        Category
                                    </label>
                                    <select name="categoryId"
                                        id="category"
                                        className="form-control"
                                        onChange={onChangeHandler}
                                        value={data.categoryId}
                                        required >
                                        <option value="">--SELECT CATEGORY--</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category.categoryId}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input type="number"
                                        name="price"
                                        id="price"
                                        className="form-control"
                                        placeholder="&#8377;200.00"
                                        onChange={onChangeHandler}
                                        value={data.price}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea rows="5"
                                        name="description"
                                        id="description"
                                        className="form-control"
                                        placeholder="Write comment here.."
                                        onChange={onChangeHandler}
                                        value={data.description} />

                                </div>
                                <button type="submit" className="btn btn-warning w-100" disabled={loading}>{loading ? "Loading..." : "Save"}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ItemForm; 