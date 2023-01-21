import React from "react";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const total_Games = 17;
const wins = 10;
const losses = 7;
const serves = 10; // how many times you served
const total_points = wins * 2 - losses * 1;

export const SAMPLE_DATA = {
  labels: ["Total Games", "Total Points", "Losses", "Serves", "Wins"],
  datasets: [
    {
      data: [total_Games, total_points, losses, serves, wins * 1.2],
      backgroundColor: "rgba(255, 159, 64, 0.8)",
      borderColor: "rgba(255, 159, 64, 1)",
      borderWidth: 0.5,
    },
  ],
};

const LOADING_DATA = {
  ...SAMPLE_DATA,
  datasets: [
    {
      ...SAMPLE_DATA.datasets[0],
      data: SAMPLE_DATA.datasets[0].data.map(() => 0),
    },
  ],
};

const PlayerStatsChart = ({
  data = SAMPLE_DATA,
  isLoading,
}: {
  data: typeof SAMPLE_DATA;
  isLoading: boolean;
}) => {
  return (
    <Radar
      data={isLoading ? data : LOADING_DATA}
      options={{
        responsive: true,
      }}
    />
  );
};

export default PlayerStatsChart;
