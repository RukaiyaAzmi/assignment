import { Tabs } from 'flowbite-react'
import React from 'react'
import SEO from '@components/common/SEO'
import DashboardLayout from '@components/layout/DashboardLayout'
import Auth from '@components/auth/Auth'
import Statistics from '@components/analytics/Statistics'
import StatisticsAbs from '@components/analytics/StatisticsAbs'
import StatisticsCbs from '@components/analytics/StatisticsCbs'
import { AiOutlineBarChart, AiOutlineLineChart, AiOutlinePieChart } from 'react-icons/ai'

export default function Stat(): JSX.Element {
  return (
    <Auth code="6.1">
      <>
        <SEO />
        <DashboardLayout>
          <Tabs.Group aria-label="Full width tabs" style="fullWidth">
            <Tabs.Item active icon={AiOutlineBarChart} title={<div className=" text-xs">ALL</div>}>
              <Statistics />
            </Tabs.Item>
            <Tabs.Item icon={AiOutlineLineChart} title={<div className=" text-xs">ABS</div>}>
              <StatisticsAbs />
            </Tabs.Item>
            <Tabs.Item icon={AiOutlinePieChart} title={<div className=" text-xs">CBS</div>}>
              <StatisticsCbs />
            </Tabs.Item>
          </Tabs.Group>
        </DashboardLayout>
      </>
    </Auth>
  )
}
