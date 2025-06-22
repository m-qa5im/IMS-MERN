// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const DashboardPage = () => {
//   const [dashboardData, setDashboardData] = useState({
//     topSellingProducts: [],
//     lowStockProducts: [],
//     monthlySales: [],
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const fetchDashboardData = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/dashboard');
//       console.log('Dashboard response:', response.data);

//       const {
//         topSellingProducts = [],
//         lowStockProducts = [],
//         monthlySales = [],
//       } = response.data || {};

//       setDashboardData({ topSellingProducts, lowStockProducts, monthlySales });
//     } catch (err) {
//       console.error('Dashboard data fetch error:', err);
//       setError('Failed to load dashboard data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   if (loading) return <div>Loading dashboard...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="p-4 space-y-6">
//       <h2 className="text-2xl font-bold">Dashboard Overview</h2>

//       {/* Top Selling Products */}
//       <section>
//         <h3 className="text-xl font-semibold mb-2">Top Selling Products</h3>
//         {dashboardData.topSellingProducts.length === 0 ? (
//           <p>No top selling products available.</p>
//         ) : (
//           <ul className="list-disc pl-6">
//             {dashboardData.topSellingProducts.map((product) => (
//               <li key={product._id}>
//                 {product.name} — {product.totalSold} sold
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>

//       {/* Low Stock Products */}
//       <section>
//         <h3 className="text-xl font-semibold mb-2">Low Stock Products</h3>
//         {dashboardData.lowStockProducts.length === 0 ? (
//           <p>No low stock items.</p>
//         ) : (
//           <ul className="list-disc pl-6">
//             {dashboardData.lowStockProducts.map((product) => (
//               <li key={product._id}>
//                 {product.name} — only {product.quantity} left
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>

//       {/* Monthly Sales */}
//       <section>
//         <h3 className="text-xl font-semibold mb-2">Monthly Sales</h3>
//         {dashboardData.monthlySales.length === 0 ? (
//           <p>No sales data available.</p>
//         ) : (
//           <ul className="list-disc pl-6">
//             {dashboardData.monthlySales.map((sale, idx) => (
//               <li key={idx}>
//                 {sale.month}: ${sale.totalSales.toFixed(2)}
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// };

// export default DashboardPage;
