# Webhook API Specification

## Overview
This document specifies the webhook API endpoint that receives capture data from the Chrome extension and triggers the n8n workflow for processing.

## Endpoint Details

### Base Information
- **URL**: `https://willertai.app.n8n.cloud/webhook/19a5d8b7-edca-4284-8656-356c0c56e6bf`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Authentication**: None (webhook ID serves as authentication)

### Endpoint Components
- **Base URL**: `https://willertai.app.n8n.cloud`
- **Path**: `/webhook/19a5d8b7-edca-4284-8656-356c0c56e6bf`
- **Webhook ID**: `19a5d8b7-edca-4284-8656-356c0c56e6bf` (unique identifier)

## Request Specification

### HTTP Headers
```http
POST /webhook/19a5d8b7-edca-4284-8656-356c0c56e6bf HTTP/1.1
Host: willertai.app.n8n.cloud
Content-Type: application/json
Content-Length: <calculated>
```

### Request Body Schema

```typescript
interface CaptureRequest {
  url: string;           // Required: The URL being captured
  title?: string;        // Optional: Page title
  comment?: string;      // Optional: User's comment/note
  captured_at: string;   // Required: ISO 8601 timestamp
  geo_location?: {       // Optional: User's location
    latitude: number;
    longitude: number;
    accuracy: number;    // Accuracy in meters
  } | null;
}
```

### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **url** | string | Yes | Complete URL of the captured page | `"https://example.com/page"` |
| **title** | string | No | HTML title of the page | `"Example Page Title"` |
| **comment** | string | No | User's note about the capture | `"Good example for landing page"` |
| **captured_at** | string | Yes | ISO 8601 timestamp of capture | `"2025-01-09T10:30:45.123Z"` |
| **geo_location** | object/null | No | User's location at capture time | See below |

### Geolocation Object

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **latitude** | number | Latitude coordinate | `53.5844` |
| **longitude** | number | Longitude coordinate | `9.9922` |
| **accuracy** | number | Accuracy radius in meters | `35.0` |

## Request Examples

### Full Request with All Fields
```json
{
  "url": "https://stripe.com/docs/payments",
  "title": "Accept online payments - Stripe Documentation",
  "comment": "Good example of technical documentation layout",
  "captured_at": "2025-01-09T10:30:45.123Z",
  "geo_location": {
    "latitude": 53.5844,
    "longitude": 9.9922,
    "accuracy": 35.0
  }
}
```

### Minimal Request (Required Fields Only)
```json
{
  "url": "https://example.com/page",
  "captured_at": "2025-01-09T10:30:45.123Z"
}
```

### Request without Location
```json
{
  "url": "https://example.com/page",
  "title": "Example Page",
  "comment": "Interesting article",
  "captured_at": "2025-01-09T10:30:45.123Z",
  "geo_location": null
}
```

## Response Specification

### Success Response (200 OK)
```json
{
  "status": "received"
}
```

### Response Headers
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 21
```

### Error Responses

#### 400 Bad Request
Returned when request body is invalid or missing required fields.
```json
{
  "error": "Invalid request body",
  "message": "Missing required field: url"
}
```

#### 404 Not Found
Returned when webhook ID is incorrect.
```json
{
  "error": "Webhook not found"
}
```

#### 500 Internal Server Error
Returned when workflow execution fails.
```json
{
  "error": "Workflow execution failed",
  "message": "Internal server error"
}
```

#### 504 Gateway Timeout
Returned when workflow execution exceeds 30 seconds.
```json
{
  "error": "Workflow timeout",
  "message": "Execution exceeded maximum time"
}
```

## Validation Rules

### URL Validation
- Must be a valid HTTP or HTTPS URL
- Must match pattern: `/^https?:\/\/.+/`
- Maximum length: 2048 characters

### Timestamp Validation
- Must be valid ISO 8601 format
- Must not be in the future
- Format: `YYYY-MM-DDTHH:mm:ss.sssZ`

### Comment Validation
- Maximum length: 500 characters
- Optional field (can be empty string or omitted)

### Geolocation Validation
- Latitude: -90 to 90
- Longitude: -180 to 180
- Accuracy: positive number (meters)
- Can be null or omitted entirely

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider:
- **Recommended limit**: 100 requests per minute per IP
- **Burst allowance**: 10 requests per second
- **Implementation**: Use n8n's built-in rate limiting or external API gateway

## Security Considerations

### Authentication
- **Current**: Webhook ID serves as a shared secret
- **Recommendation**: Consider adding HMAC signature validation for production

### HTTPS Only
- All requests must use HTTPS
- HTTP requests will be rejected or redirected

### Input Sanitization
- All input is validated in the workflow's validation node
- HTML/JavaScript in comments is escaped before storage

### CORS Policy
- Currently allows all origins for webhook endpoints
- Consider restricting to specific domains if needed

## Integration Examples

### JavaScript (Chrome Extension)
```javascript
async function sendToWebhook(captureData) {
  const webhookUrl = 'https://willertai.app.n8n.cloud/webhook/19a5d8b7-edca-4284-8656-356c0c56e6bf';
  
  const payload = {
    url: captureData.url,
    title: captureData.title || '',
    comment: captureData.comment || '',
    captured_at: new Date().toISOString(),
    geo_location: captureData.location || null
  };
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Capture successful:', result);
  } catch (error) {
    console.error('Capture failed:', error);
  }
}
```

### cURL
```bash
curl -X POST https://willertai.app.n8n.cloud/webhook/19a5d8b7-edca-4284-8656-356c0c56e6bf \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "title": "Example Page",
    "comment": "Test capture",
    "captured_at": "2025-01-09T10:30:45.123Z",
    "geo_location": null
  }'
```

### Python
```python
import requests
import json
from datetime import datetime

webhook_url = 'https://willertai.app.n8n.cloud/webhook/19a5d8b7-edca-4284-8656-356c0c56e6bf'

payload = {
    'url': 'https://example.com',
    'title': 'Example Page',
    'comment': 'Test capture',
    'captured_at': datetime.now().isoformat() + 'Z',
    'geo_location': None
}

response = requests.post(
    webhook_url,
    headers={'Content-Type': 'application/json'},
    data=json.dumps(payload)
)

if response.status_code == 200:
    print('Capture successful:', response.json())
else:
    print('Capture failed:', response.status_code, response.text)
```

## Webhook Workflow Integration

### n8n Workflow Connection
- **Workflow ID**: `ybqL6Lybsmegr8xk`
- **Workflow Name**: `Capture_URL_v1.0`
- **Trigger Node**: Webhook node (Node 1)
- **Response Node**: Respond to Webhook (Node 2)

### Processing Pipeline
1. Webhook receives POST request
2. Immediate response sent (`{"status": "received"}`)
3. Validation node processes input
4. Workflow continues asynchronously
5. Data stored in Supabase

### Monitoring
- Access execution logs: https://willertai.app.n8n.cloud/workflow/ybqL6Lybsmegr8xk/executions
- Check webhook test: https://willertai.app.n8n.cloud/webhook-test/19a5d8b7-edca-4284-8656-356c0c56e6bf

## Testing

### Test Webhook Endpoint
For testing purposes, you can use:
```
https://willertai.app.n8n.cloud/webhook-test/19a5d8b7-edca-4284-8656-356c0c56e6bf
```

This endpoint will show the received data without processing it through the workflow.

### Health Check
To verify the webhook is active:
1. Send a minimal valid request
2. Expect `200 OK` with `{"status": "received"}`
3. Check n8n execution history for processing

## Error Handling

### Client-Side Retry Logic
```javascript
async function captureWithRetry(data, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await sendToWebhook(data);
      if (response.ok) return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

### Webhook Timeout Handling
- Default timeout: 30 seconds
- Recommendation: Set client timeout to 35 seconds
- If timeout occurs, check n8n execution history

## Versioning

### Current Version
- **Version**: 1.0
- **Status**: Production
- **Stability**: Stable

### Backward Compatibility
- Future versions will maintain backward compatibility
- Deprecation notices will be provided 30 days in advance
- Version headers may be added in future updates

## Related Documentation
- [Chrome Extension Documentation](../../Extensions/Chrome/)
- [Workflow Documentation](../../Workflows/Capture/Capture_URL/)
- [Database Schema](../Database_Schema/)
- [n8n Webhook Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)

---

*API Documentation for Capture System Webhook*  
*Last Updated: January 9, 2025*
