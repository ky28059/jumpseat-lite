'use client'

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import MockPage from '@/app/(landing)/MockPage';
import { formatDate } from 'date-fns';


const priceData = [
    {
        "time": "2024-03-28",
        "price": 424
    },
    {
        "time": "2024-03-29",
        "price": 424
    },
    {
        "time": "2024-03-30",
        "price": 473
    },
    {
        "time": "2024-03-31",
        "price": 473
    },
    {
        "time": "2024-04-01",
        "price": 473
    },
    {
        "time": "2024-04-02",
        "price": 430
    },
    {
        "time": "2024-04-03",
        "price": 444
    },
    {
        "time": "2024-04-04",
        "price": 494
    },
    {
        "time": "2024-04-05",
        "price": 494
    },
    {
        "time": "2024-04-06",
        "price": 375
    },
    {
        "time": "2024-04-07",
        "price": 323
    },
    {
        "time": "2024-04-08",
        "price": 323
    },
    {
        "time": "2024-04-09",
        "price": 375
    },
    {
        "time": "2024-04-10",
        "price": 375
    },
    {
        "time": "2024-04-11",
        "price": 405
    },
    {
        "time": "2024-04-12",
        "price": 444
    },
    {
        "time": "2024-04-13",
        "price": 405
    },
    {
        "time": "2024-04-14",
        "price": 405
    },
    {
        "time": "2024-04-15",
        "price": 424
    },
    {
        "time": "2024-04-16",
        "price": 384
    },
    {
        "time": "2024-04-17",
        "price": 384
    },
    {
        "time": "2024-04-18",
        "price": 424
    },
    {
        "time": "2024-04-19",
        "price": 404
    },
    {
        "time": "2024-04-20",
        "price": 404
    },
    {
        "time": "2024-04-21",
        "price": 404
    },
    {
        "time": "2024-04-22",
        "price": 404
    },
    {
        "time": "2024-04-23",
        "price": 424
    },
    {
        "time": "2024-04-24",
        "price": 444
    },
    {
        "time": "2024-04-25",
        "price": 405
    },
    {
        "time": "2024-04-26",
        "price": 405
    },
    {
        "time": "2024-04-27",
        "price": 405
    },
    {
        "time": "2024-04-28",
        "price": 383
    },
    {
        "time": "2024-04-29",
        "price": 383
    },
    {
        "time": "2024-04-30",
        "price": 423
    },
    {
        "time": "2024-05-01",
        "price": 403
    },
    {
        "time": "2024-05-02",
        "price": 403
    },
    {
        "time": "2024-05-03",
        "price": 432
    },
    {
        "time": "2024-05-04",
        "price": 424
    },
    {
        "time": "2024-05-05",
        "price": 309
    },
    {
        "time": "2024-05-06",
        "price": 309
    },
    {
        "time": "2024-05-07",
        "price": 339
    },
    {
        "time": "2024-05-08",
        "price": 339
    },
    {
        "time": "2024-05-09",
        "price": 285
    },
    {
        "time": "2024-05-10",
        "price": 345
    },
    {
        "time": "2024-05-11",
        "price": 345
    },
    {
        "time": "2024-05-12",
        "price": 265
    },
    {
        "time": "2024-05-13",
        "price": 265
    },
    {
        "time": "2024-05-14",
        "price": 283
    },
    {
        "time": "2024-05-15",
        "price": 283
    },
    {
        "time": "2024-05-16",
        "price": 235
    },
    {
        "time": "2024-05-17",
        "price": 235
    },
    {
        "time": "2024-05-18",
        "price": 235
    },
    {
        "time": "2024-05-19",
        "price": 225
    },
    {
        "time": "2024-05-20",
        "price": 195
    },
    {
        "time": "2024-05-21",
        "price": 195
    },
    {
        "time": "2024-05-22",
        "price": 195
    },
    {
        "time": "2024-05-23",
        "price": 195
    },
    {
        "time": "2024-05-24",
        "price": 235
    },
    {
        "time": "2024-05-25",
        "price": 235
    },
    {
        "time": "2024-05-26",
        "price": 265
    },
    {
        "time": "2024-05-27",
        "price": 265
    }
]

const priceData2 = [
    {
        "time": "2024-03-29",
        "price": 163
    },
    {
        "time": "2024-03-30",
        "price": 284
    },
    {
        "time": "2024-03-31",
        "price": 296
    },
    {
        "time": "2024-04-01",
        "price": 296
    },
    {
        "time": "2024-04-02",
        "price": 294
    },
    {
        "time": "2024-04-03",
        "price": 294
    },
    {
        "time": "2024-04-04",
        "price": 106
    },
    {
        "time": "2024-04-05",
        "price": 235
    },
    {
        "time": "2024-04-06",
        "price": 235
    },
    {
        "time": "2024-04-07",
        "price": 235
    },
    {
        "time": "2024-04-08",
        "price": 205
    },
    {
        "time": "2024-04-09",
        "price": 205
    },
    {
        "time": "2024-04-10",
        "price": 205
    },
    {
        "time": "2024-04-11",
        "price": 205
    },
    {
        "time": "2024-04-12",
        "price": 175
    },
    {
        "time": "2024-04-13",
        "price": 125
    },
    {
        "time": "2024-04-14",
        "price": 125
    },
    {
        "time": "2024-04-15",
        "price": 125
    },
    {
        "time": "2024-04-16",
        "price": 106
    },
    {
        "time": "2024-04-17",
        "price": 106
    },
    {
        "time": "2024-04-18",
        "price": 106
    },
    {
        "time": "2024-04-19",
        "price": 151
    },
    {
        "time": "2024-04-20",
        "price": 151
    },
    {
        "time": "2024-04-21",
        "price": 151
    },
    {
        "time": "2024-04-22",
        "price": 151
    },
    {
        "time": "2024-04-23",
        "price": 151
    },
    {
        "time": "2024-04-24",
        "price": 151
    },
    {
        "time": "2024-04-25",
        "price": 151
    },
    {
        "time": "2024-04-26",
        "price": 151
    },
    {
        "time": "2024-04-27",
        "price": 151
    },
    {
        "time": "2024-04-28",
        "price": 151
    },
    {
        "time": "2024-04-29",
        "price": 151
    },
    {
        "time": "2024-04-30",
        "price": 106
    },
    {
        "time": "2024-05-01",
        "price": 106
    },
    {
        "time": "2024-05-02",
        "price": 106
    },
    {
        "time": "2024-05-03",
        "price": 106
    },
    {
        "time": "2024-05-04",
        "price": 106
    },
    {
        "time": "2024-05-05",
        "price": 106
    },
    {
        "time": "2024-05-06",
        "price": 96
    },
    {
        "time": "2024-05-07",
        "price": 96
    },
    {
        "time": "2024-05-08",
        "price": 151
    },
    {
        "time": "2024-05-09",
        "price": 138
    },
    {
        "time": "2024-05-10",
        "price": 96
    },
    {
        "time": "2024-05-11",
        "price": 96
    },
    {
        "time": "2024-05-12",
        "price": 96
    },
    {
        "time": "2024-05-13",
        "price": 96
    },
    {
        "time": "2024-05-14",
        "price": 96
    },
    {
        "time": "2024-05-15",
        "price": 96
    },
    {
        "time": "2024-05-16",
        "price": 135
    },
    {
        "time": "2024-05-17",
        "price": 135
    },
    {
        "time": "2024-05-18",
        "price": 123
    },
    {
        "time": "2024-05-19",
        "price": 96
    },
    {
        "time": "2024-05-20",
        "price": 96
    },
    {
        "time": "2024-05-21",
        "price": 123
    },
    {
        "time": "2024-05-22",
        "price": 123
    },
    {
        "time": "2024-05-23",
        "price": 123
    },
    {
        "time": "2024-05-24",
        "price": 135
    },
    {
        "time": "2024-05-25",
        "price": 123
    },
    {
        "time": "2024-05-26",
        "price": 123
    },
    {
        "time": "2024-05-27",
        "price": 123
    },
    {
        "time": "2024-05-28",
        "price": 153
    }
]

export default function PriceGraph() {
    const minPoint = priceData.reduce((a, b) => a.price <= b.price ? a : b)
    const maxPoint = priceData.reduce((a, b) => a.price > b.price ? a : b)

    return (
        <MockPage left className="h-96 flex flex-col">
            <h4 className="text-xl font-semibold mb-4">
                Prices are currently <span className="text-red-400 underline">high</span> for IND {'->'} SFO
            </h4>

            <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                <AreaChart
                    width={500}
                    height={300}
                    data={priceData}
                    margin={{
                        top: 10,
                        right: 0,
                        left: -15,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="40%" stopColor="#eab308" />
                            <stop offset="80%" stopColor="#84cc16" />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-tertiary dark:stroke-secondary"
                    />
                    <XAxis
                        dataKey="time"
                        // type="number"
                        domain={['auto', 'auto']}
                        className="text-xs [&_text]:!fill-secondary dark:[&_text]:!fill-primary"
                        tickFormatter={(iso) => formatDate(new Date(iso), 'M/d/yy')}
                        minTickGap={40}
                    />
                    <YAxis
                        domain={[minPoint.price - 50, maxPoint.price + 10]}
                        className="text-sm [&_text]:!fill-secondary dark:[&_text]:!fill-primary"
                        tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                        wrapperClassName="rounded !px-4 !py-2 dark:!bg-background !border-tertiary"
                        labelClassName="text-xs text-secondary dark:text-primary"
                        labelFormatter={(iso) => formatDate(new Date(iso), 'M/d/yyyy')}
                        formatter={(price: number) => [`$${price}`]}
                    />
                    <Area
                        dataKey="price"
                        stroke="url(#colorUv)"
                        strokeWidth="2"
                        fill="url(#colorUv)"
                        fillOpacity={0.3}
                        dot={{ r: 0 }}
                        activeDot={{ fill: '#000' }}
                    />

                    {/*
                    <ReferenceLine
                        x={maxPoint.time}
                        stroke="#ef4444"
                    />
                    <ReferenceLine
                        x={minPoint.time}
                        stroke="#84cc16"
                    />
                    */}
                </AreaChart>
            </ResponsiveContainer>
        </MockPage>
    );
}
