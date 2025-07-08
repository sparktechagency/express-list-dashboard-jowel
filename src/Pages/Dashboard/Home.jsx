import React from "react";
import { FaCalendarDay, FaDollarSign } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { MdOutlineHome } from "react-icons/md";
import { PiHouseLine } from "react-icons/pi";
import { Bar } from "react-chartjs-2";
import LineChart from "./LineChart"; // Importing LineChart Component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useCardStaticQuery, useRetailerLineCartQuery, useSubscriberBarChartQuery, useWholesalerLineChartQuery } from "../../redux/apiSlices/overviewApi";
import Loading from "../../components/common/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const {data:card, isLoading}=useCardStaticQuery()
  const {data:retailer}=useRetailerLineCartQuery()
  const {data:wholesaler, isLoading:wholesalerLoding}=useWholesalerLineChartQuery()
  const {data:subscriber}=useSubscriberBarChartQuery()
  const cardInfo=card?.data
 
   const subscriptionData = subscriber?.data?.map((item) => item.total);
   const RetailerData = retailer?.data?.map((item) => item.total);
   const wholesalerData = wholesaler?.data?.map((item) => item.total);
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Subscriptions",
        data: subscriptionData,
        backgroundColor: "#3FC7EE",
        borderColor: "#A1A1A1",
        borderWidth: 1,
        barThickness: 24,
        maxBarThickness: 24,
      },
    ],
  };

 
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: "#A1A1A1",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          suggestedMin: 0,
          suggestedMax: 100,
        },
        grid: {
          display: true,
          lineWidth: 2,
        },
      },
    },
  };

  if(isLoading) <Loading />

  return (
    <div>
      {/* Card Section */}
      <div className="grid grid-cols-4 gap-6 h-[120px] mb-9">
        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center">
              <MdOutlineHome color="#007BA5" size={24} />
            </div>
            <div>
              <h3 className="text-primary text-[32px] font-semibold">
                {cardInfo?.totalWholesalers}
              </h3>
              <h2 className="text-center text-2xl text-base">
                Total Wholesalers
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center">
              <PiHouseLine color="#007BA5" size={24} />
            </div>
            <div>
              <h3 className="text-primary text-[32px] font-semibold">
                {cardInfo?.totalRetailers}{" "}
              </h3>
              <h2 className="text-center text-2xl text-base">
                Total Retailers
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center">
              <HiMiniUsers color="#007BA5" size={24} />
            </div>
            <div>
              <h3 className="text-primary text-[32px] font-semibold">
                {cardInfo?.totalSubscribers}
              </h3>
              <h2 className="text-center text-2xl text-base">
                Total Subscribers
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center">
              <FaDollarSign color="#007BA5" size={24} />
            </div>
            <div>
              <h3 className="text-primary text-[32px] font-semibold">
                $ {cardInfo?.totalEarnings}
              </h3>
              <h2 className="text-center text-2xl text-base">Total Revenue</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart Section */}
      <div className="bg-white p-4 rounded-lg my-6">
        <div className="font-semibold mb-4 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="h-4 w-4 bg-[#3FC7EE] rounded-sm"></span>
            <span className="text-[#3FC7EE] text-sm font-medium">
              Retailers
            </span>
          </div>
          <span>&</span>
          <div className="flex items-center gap-1">
            <span className="h-4 w-4 bg-green-500 rounded-sm"></span>
            <span className="text-green-500 text-sm font-medium">
              Wholesalers
            </span>
          </div>
        </div>
        <LineChart retailer={RetailerData} wholesaler={wholesalerData} wholesalerLoding={wholesalerLoding}/>
      </div>
      {isLoading && (
        <div>
          <Loading />{" "}
        </div>
      )}

      {/* Subscription Section */}
      <div className="bg-white p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Subscription</h2>

        {/* Bar Chart */}
        <div className="mt-" style={{ height: "220px" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Home;
