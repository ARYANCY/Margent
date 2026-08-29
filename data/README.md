# AI Marketing Intelligence - Datasets

## Canonical Datasets Documentation

### 1. Campaign Performance Dataset (`data/raw/campaigns.csv`)
- **Dataset name**: Multi-Channel Marketing Campaign Baseline & Historical Records
- **Source**: Kaggle Marketing Analytics / Synthesized Normalized Benchmark
- **License**: CC0 Public Domain
- **Download Date**: 2026-08-29
- **Original Columns**: campaign_id, campaign_name, channel, audience, date, spend, impressions, clicks, conversions, revenue, engagements
- **Derived Metrics**:
  - `CTR` = clicks / impressions
  - `CPC` = spend / clicks
  - `Conversion Rate` = conversions / clicks
  - `ROAS` = revenue / spend
  - `Engagement Rate` = engagements / impressions
- **Known Limitations**: Baseline numbers represent historical cross-channel averages (Instagram, TikTok, X, YouTube, LinkedIn).

### 2. Real Trend Signals (`data/raw/trends.json`)
- **Dataset name**: Normalized Real Trend Signals & Topic Vectors
- **Source**: Google Trends & Social Signal Aggregator
- **Scoring Weights**:
  - Growth: 0.30
  - Interest: 0.20
  - Velocity: 0.15
  - Recency: 0.15
  - Relevance: 0.20
