import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateSellingPriceChart = async (customPrices) => {
  const inputData = customPrices
    .map((item) => ({
      date: new Date(item.date).toISOString(),
      value: Number(item.sellingPrice),
    }))
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

  const prompt = `
You are a professional data visualization expert.

Analyze the following selling price time-series data and generate a complete
chart configuration that can be consumed by Chart.js.

The input contains:
- date: ISO-8601 timestamp
- value: selling price

IMPORTANT:

DATA:
- Preserve EVERY input data point.
- Do NOT invent any data.
- Do NOT remove any data point.
- Do NOT aggregate data.
- Do NOT interpolate data.
- Do NOT modify the values.
- Do NOT round the values.
- Sort the data chronologically.
- Keep dates as ISO-8601 strings.
- Values must remain numbers.

CHART:
- Use a line chart.
- The X-axis represents time.
- The Y-axis represents selling price.

X-AXIS:
Analyze the provided date range and choose the most appropriate configuration.

Allowed time units:
- minute
- hour
- day
- week
- month
- quarter
- year

Choose:
- appropriate timeUnit
- readable displayFormat
- useful tooltipFormat

Examples:

For hourly data:
timeUnit = "hour"
displayFormat = "HH:mm"

For daily data:
timeUnit = "day"
displayFormat = "dd MMM"

For monthly data:
timeUnit = "month"
displayFormat = "MMM yyyy"

For yearly data:
timeUnit = "year"
displayFormat = "yyyy"

Y-AXIS:
Analyze the minimum and maximum selling price.

Choose:
- sensible suggestedMin
- sensible suggestedMax
- sensible stepSize

Rules:
- suggestedMin should provide a small amount of space below the minimum value.
- suggestedMax should provide a small amount of space above the maximum value.
- Do not automatically start from zero.
- Avoid excessive empty space.
- Make changes in selling price visually clear.
- If all values are positive, suggestedMin should normally remain positive.
- stepSize should produce readable Y-axis ticks.

DATASET:
- label must be "Selling Price".
- tension should normally be between 0 and 0.4.
- pointRadius should normally be between 2 and 5.

Return ONLY valid JSON.
Do NOT return markdown.
Do NOT return JavaScript.
Do NOT return explanations.

Return EXACTLY this structure:

{
  "chartType": "line",
  "title": "Selling Price Performance",

  "xAxis": {
    "type": "time",
    "label": "Date",
    "timeUnit": "day",
    "displayFormat": "dd MMM",
    "tooltipFormat": "dd MMM yyyy, HH:mm"
  },

  "yAxis": {
    "label": "Selling Price",
    "beginAtZero": false,
    "suggestedMin": 0,
    "suggestedMax": 0,
    "stepSize": 0
  },

  "dataset": {
    "label": "Selling Price",
    "tension": 0.3,
    "pointRadius": 3
  },

  "data": [
    {
      "date": "ISO-8601 DATE",
      "value": 123.45
    }
  ]
}

INPUT DATA:

${JSON.stringify(inputData)}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite', //gemini-3.5-flash
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error('Gemini returned an empty response');
    }

    const chart = JSON.parse(text);

    return chart;
  } catch (error) {
    console.error('Gemini chart generation failed:', error);

    throw new Error(
      `Failed to generate selling price chart: ${error.message}`
    );
  }
};