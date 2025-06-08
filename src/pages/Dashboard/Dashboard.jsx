import { useEffect, useState } from 'react';
import './Dashboard.css';
import { fetchDashboardData } from '../../Service/DashboardService';
import toast from 'react-hot-toast';




const Dashboard = () => {


    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await fetchDashboardData();
                setData(response.data);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to fetch dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    if (loading) {
        return <div className="dashboard-loading">Loading Dashboard...</div>
    }

    if (!data) {
        return <div className="dashboard-error">No data available.</div>
    }




    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <div className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon ">
                            <i className="bi bi-currency-rupee">
                            </i>
                        </div>

                        <div className="stat-content">
                            <h3>Todays Sales</h3>
                            <p>₹{data.todaySales.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="bi bi-cart-check">
                            </i>
                        </div>

                        <div className="stat-content">
                            <h3>
                                Todays Orders
                            </h3>
                            <p>{data.todayOrderCount}</p>
                        </div>
                    </div>
                </div>

                <div className="recent-orders-card">
                    <h3 className="recent-orders-title">
                        <i className="bi bi-clock-history">
                            Recent Orders
                        </i>
                    </h3>

                    <div className="orders-table-container">

                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.recentOrders.map((order) => (
                                    <tr key={order.orderId}>
                                        <td>{order.orderId.substring(0, 8)}....</td>
                                        <td>
                                            {order.customerName}<br />
                                            {/* <small className="text-muted">{order.phoneNumber}</small> */}
                                        </td>
                                        <td>₹{order.grandTotal.toFixed(2)}</td>

                                        <td>
                                            <span className={`payment-method ${order.paymentMethod?.toLowerCase}`}>
                                                {order.paymentMethod}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={`status-badge ${order.paymentDetails.status?.toLowerCase}`}>
                                                {order.paymentDetails.status? 'COMPLETED' : 'PENDING'}
                                            </span>
                                        </td>

                                        <td>{new Date(order.createdAt).toLocaleDateString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}

                                        </td>
                                    </tr>
                                ))}
                            </tbody> 
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}


export default Dashboard; 