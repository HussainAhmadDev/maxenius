import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

const Dashboard = () => {
  const performanceChartOptions = {
    chart: {
      type: "bar",
      stacked: true,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr"],
    },
    colors: ["#0EA5E9", "#22D3EE", "#7DD3FC"],
    legend: {
      position: "top",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
  };

  const performanceChartSeries = [
    {
      name: "Creditworthiness",
      data: [400, 300, 500, 300],
    },
    {
      name: "Income Stability",
      data: [300, 400, 300, 400],
    },
    {
      name: "Consistency in Payments",
      data: [500, 600, 400, 500],
    },
  ];

  const tasksChartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Approved", "Denied"],
    colors: ["#0EA5E9", "#22D3EE"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const tasksChartSeries = [124, 50];

  const lineChartOptions = {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const cashFlowChartSeries = [
    {
      name: "Cash flow",
      data: [10, 20, 40, 20, 30, 30],
    },
  ];

  const insuranceRenewalsChartSeries = [
    {
      name: "Insurance renewals",
      data: [5, 15, 35, 20, 15, 25],
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white shadow-md lg:h-screen">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-blue-600">FairSplit</h1>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700"
          >
            <span className="mx-4">Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            <span className="mx-4">Agents</span>
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            <span className="mx-4">Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
              Welcome, Sara Smith
            </h2>
            <div className="flex items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="AI-Search"
                className="mr-4 px-3 py-2 border rounded-md flex-grow sm:flex-grow-0"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full sm:w-auto">
                Start Tasks
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Performance Risk Insight */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              PERFORMANCE RISK INSIGHT
            </h3>
            <p className="text-3xl font-bold text-blue-600">$50,000.00</p>
            <p className="text-sm text-gray-500 mb-4">Company Networth</p>
            <ReactApexChart
              options={performanceChartOptions as ApexOptions}
              series={performanceChartSeries}
              type="bar"
              height={300}
            />
          </div>

          {/* Tasks Status and Total Revenue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">TASKS STATUS</h3>
              <ReactApexChart
                options={tasksChartOptions as ApexOptions}
                series={tasksChartSeries}
                type="donut"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">TOTAL REVENUE</h3>
              <p className="text-3xl font-bold text-blue-600">$5,000.00</p>
              <p className="text-sm text-green-500">+20% Increase</p>
            </div>
          </div>

          {/* Cash Flow and Insurance Renewals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">CASH FLOW</h3>
              <ReactApexChart
                options={lineChartOptions as ApexOptions}
                series={cashFlowChartSeries}
                type="line"
                height={300}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">INSURANCE-RENEWALS</h3>
              <ReactApexChart
                options={lineChartOptions as ApexOptions}
                series={insuranceRenewalsChartSeries}
                type="line"
                height={300}
              />
            </div>
          </div>

          {/* Vendors Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Vendors</h3>
              <button className="text-blue-500">+ Add Vendor</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Good Standing + Z-score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unpaid Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(6)].map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">Company</td>
                      <td className="px-6 py-4 whitespace-nowrap">2.99</td>
                      <td className="px-6 py-4 whitespace-nowrap">$150,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        05/04/2024
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
