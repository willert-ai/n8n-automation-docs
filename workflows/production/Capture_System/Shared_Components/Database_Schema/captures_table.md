# Database Schema - Captures Table

## Overview
The `captures` table is the primary storage for all captured web content, enriched with AI analysis and vector embeddings for semantic search capabilities.

## Table: `captures`

### Schema Definition

```sql
CREATE TABLE captures (
    -- Primary Identification
    capture_id TEXT PRIMARY KEY,
    
    -- URL Information
    url TEXT NOT NULL,
    url_normalized TEXT,
    domain TEXT,
    
    -- Content Metadata
    page_title TEXT,
    user_comment TEXT,
    
    -- Temporal Data
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    captured_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- AI Enrichment
    summary TEXT,
    keywords JSONB,
    key_insight TEXT,
    topic TEXT,
    
    -- Calendar Context
    event_title TEXT,
    event_description TEXT,
    event_attendees JSONB,
    
    -- Geolocation
    geo_latitude FLOAT,
    geo_longitude FLOAT,
    geo_accuracy FLOAT,
    
    -- Processing Metadata
    is_internal BOOLEAN DEFAULT FALSE,
    fetch_status TEXT,
    metadata JSONB,
    workflow_version TEXT,
    
    -- Vector Embedding
    embedding VECTOR(1536)
);

-- Indexes for Performance
CREATE INDEX idx_captures_captured_date ON captures(captured_date);
CREATE INDEX idx_captures_domain ON captures(domain);
CREATE INDEX idx_captures_embedding ON captures USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_captures_created_at ON captures(created_at DESC);
```

## Field Descriptions

### Identification Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **capture_id** | TEXT | Unique identifier for each capture | `cap_1736416898369_nozaoxe1e` |
| **created_at** | TIMESTAMP | Database insertion timestamp | `2025-01-09 10:30:45+00` |

### URL Information

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **url** | TEXT | Original captured URL | `https://example.com/page?utm_source=test` |
| **url_normalized** | TEXT | URL without tracking parameters | `https://example.com/page` |
| **domain** | TEXT | Extracted domain name | `example.com` |

### Content Metadata

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **page_title** | TEXT | HTML title of the page | `"Example Page Title"` |
| **user_comment** | TEXT | User's note when capturing | `"Good example for landing page"` |

### Temporal Data

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **captured_at** | TIMESTAMP | When user captured the page | `2025-01-09T10:30:45.123Z` |
| **captured_date** | DATE | Date portion for filtering | `2025-01-09` |

### AI Enrichment Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **summary** | TEXT | AI-generated 80-120 word summary | `"This page discusses..."` |
| **keywords** | JSONB | Array of 3-5 relevant keywords | `["design", "landing page", "conversion"]` |
| **key_insight** | TEXT | One-sentence essential value | `"Demonstrates effective CTA placement"` |
| **topic** | TEXT | 2-4 word category | `"Web Design"` |

### Calendar Context

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **event_title** | TEXT | Calendar event during capture | `"Marketing Team Meeting"` |
| **event_description** | TEXT | Event description | `"Weekly sync on campaigns"` |
| **event_attendees** | JSONB | Array of attendee emails | `["john@example.com", "jane@example.com"]` |

### Geolocation

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **geo_latitude** | FLOAT | Latitude coordinate | `53.5844` |
| **geo_longitude** | FLOAT | Longitude coordinate | `9.9922` |
| **geo_accuracy** | FLOAT | Accuracy in meters | `35.0` |

### Processing Metadata

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **is_internal** | BOOLEAN | Whether URL is internal/private | `false` |
| **fetch_status** | TEXT | Web fetch result status | `"success"`, `"failed"`, `"skipped_internal"` |
| **metadata** | JSONB | Extracted page metadata | `{"og_title": "...", "og_description": "..."}` |
| **workflow_version** | TEXT | Version of processing workflow | `"1.0"` |

### Vector Embedding

| Field | Type | Description | Details |
|-------|------|-------------|---------|
| **embedding** | VECTOR(1536) | OpenAI text-embedding-3-small vector | 1536-dimensional float array |

## JSONB Field Structures

### keywords (JSONB Array)
```json
[
  "keyword1",
  "keyword2",
  "keyword3"
]
```

### event_attendees (JSONB Array)
```json
[
  "email1@example.com",
  "email2@example.com"
]
```

### metadata (JSONB Object)
```json
{
  "og_title": "OpenGraph Title",
  "og_description": "OpenGraph Description",
  "meta_description": "Meta Description",
  "title": "Page Title"
}
```

## Indexes

### Primary Indexes
1. **Primary Key**: `capture_id` - Unique constraint and fast lookup
2. **Temporal Index**: `captured_date` - For date-range queries
3. **Domain Index**: `domain` - For filtering by website
4. **Creation Index**: `created_at DESC` - For recent captures

### Vector Search Index
```sql
CREATE INDEX idx_captures_embedding 
ON captures 
USING ivfflat (embedding vector_cosine_ops);
```
- **Type**: IVFFlat (Inverted File with Flat compression)
- **Operation**: Cosine similarity for semantic search
- **Purpose**: Efficient nearest-neighbor search

## Query Examples

### Insert New Capture
```sql
INSERT INTO captures (
    capture_id, url, url_normalized, page_title, 
    user_comment, captured_at, captured_date,
    summary, keywords, key_insight, topic,
    event_title, event_attendees,
    geo_latitude, geo_longitude,
    is_internal, fetch_status, metadata,
    embedding, workflow_version
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
);
```

### Semantic Search Query
```sql
SELECT 
    capture_id,
    url,
    page_title,
    summary,
    user_comment,
    1 - (embedding <=> $1::vector) as similarity
FROM captures
WHERE embedding IS NOT NULL
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

### Recent Captures with Calendar Context
```sql
SELECT 
    capture_id,
    url,
    page_title,
    event_title,
    captured_at
FROM captures
WHERE 
    event_title IS NOT NULL
    AND captured_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY captured_at DESC;
```

### Domain Statistics
```sql
SELECT 
    domain,
    COUNT(*) as capture_count,
    MAX(captured_at) as last_captured
FROM captures
GROUP BY domain
ORDER BY capture_count DESC
LIMIT 20;
```

## Storage Considerations

### Size Estimates
- **Average row size**: ~10KB
  - Text fields: ~2KB
  - Embedding vector: ~6KB (1536 floats × 4 bytes)
  - JSONB fields: ~1KB
  - Other fields: ~1KB

### Growth Projections
| Captures/Month | Storage/Month | Annual Storage |
|----------------|---------------|----------------|
| 1,000 | 10 MB | 120 MB |
| 10,000 | 100 MB | 1.2 GB |
| 100,000 | 1 GB | 12 GB |

## Maintenance

### Recommended Maintenance Tasks

1. **Vacuum Operations**
   ```sql
   VACUUM ANALYZE captures;
   ```
   - Frequency: Weekly
   - Purpose: Reclaim space and update statistics

2. **Index Maintenance**
   ```sql
   REINDEX INDEX idx_captures_embedding;
   ```
   - Frequency: Monthly
   - Purpose: Optimize vector search performance

3. **Data Archival**
   ```sql
   -- Archive captures older than 1 year
   INSERT INTO captures_archive 
   SELECT * FROM captures 
   WHERE captured_date < CURRENT_DATE - INTERVAL '1 year';
   
   DELETE FROM captures 
   WHERE captured_date < CURRENT_DATE - INTERVAL '1 year';
   ```

## Security Considerations

### Row Level Security (RLS)
If implementing user-specific captures:
```sql
-- Enable RLS
ALTER TABLE captures ENABLE ROW LEVEL SECURITY;

-- Create policy for user access
CREATE POLICY "Users can view own captures" ON captures
    FOR ALL
    USING (auth.uid() = user_id);
```

### Data Privacy
- **PII Handling**: User comments and event attendees may contain PII
- **Encryption**: Supabase provides encryption at rest
- **Access Control**: Use Supabase Auth with RLS policies
- **Audit Trail**: Consider adding audit columns (created_by, updated_by)

## Performance Optimization

### Query Optimization Tips
1. **Use indexes**: Always filter on indexed columns when possible
2. **Limit vector searches**: Use pre-filters before semantic search
3. **Batch operations**: Insert/update multiple rows in single transaction
4. **Connection pooling**: Use Supabase connection pooler for high traffic

### Vector Search Optimization
```sql
-- Pre-filter before vector search for better performance
SELECT * FROM (
    SELECT *, embedding <=> $1::vector as distance
    FROM captures
    WHERE captured_date >= CURRENT_DATE - INTERVAL '30 days'
    AND domain = 'example.com'
) subquery
WHERE distance < 0.5
ORDER BY distance
LIMIT 10;
```

## Migration Scripts

### Initial Table Creation
See the schema definition at the top of this document.

### Future Migration Example
```sql
-- Add user_id for multi-tenant support
ALTER TABLE captures 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Add full-text search
ALTER TABLE captures 
ADD COLUMN search_vector tsvector;

CREATE INDEX idx_captures_search 
ON captures USING gin(search_vector);
```

## Related Documentation
- [Workflow Documentation](../../Workflows/Capture/Capture_URL/)
- [API Documentation](../API_Documentation/)
- [Supabase Documentation](https://supabase.com/docs)

---

*Database Schema for Capture System*  
*Last Updated: January 9, 2025*
