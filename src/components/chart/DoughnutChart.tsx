import React from 'react'
import { Doughnut } from 'react-chartjs-2'

export interface DoughnutChartProps {
  data: number[]
  labels: string[]
  backgroundColor: string[]
}

export default function DoughnutChart({ data, labels, backgroundColor }: DoughnutChartProps) {
  const dData = {
    labels: labels,
    datasets: [
      {
        label: 'Total eKYC',
        data: data,
        backgroundColor: backgroundColor,
      },
    ],
  }
  return (
    <>
      <Doughnut width={200} height={200} data={dData} />
    </>
  )
}
