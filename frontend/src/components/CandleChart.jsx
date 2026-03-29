import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandleChart({ ohlcv, patterns }) {
  const chartRef = useRef();

  useEffect(() => {
    if (!ohlcv || ohlcv.length === 0) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
    });

    // ✅ Correct for v4
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#f43f5e",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#f43f5e",
    });

    const data = ohlcv.map((d) => ({
      time: d.date, // make sure format is correct (see below)
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candleSeries.setData(data);

    if (patterns && patterns.length > 0) {
      const markers = patterns.map((p) => ({
        time: p.detected_at,
        position: p.direction === "bearish" ? "aboveBar" : "belowBar",
        color: p.direction === "bullish" ? "green" : "red",
        shape: p.direction === "bearish" ? "arrowDown" : "arrowUp",
        text: p.name,
      }));

      // ✅ Correct for v4
      candleSeries.setMarkers(markers);
    }

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [ohlcv, patterns]);

  return <div ref={chartRef} style={{ width: "100%" }} />;
}