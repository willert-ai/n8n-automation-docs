# Google Sheets Setup Templates for Dropscan Document Management

## Document Index Sheet Setup

### Sheet Name: `DocumentIndex`

### Column Headers (Row 1):
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Index | Area | Type | Year | Sender | Topic | Date | Original |

### Sample Data (Rows 2-4):
| Index | Area | Type | Year | Sender | Topic | Date | Original |
|-------|------|------|------|--------|-------|------|----------|
| 000001 | PRIV | INVO | 2025 | TELKO | Mobilfunk | 20250101 | dropscan_001.pdf |
| 000002 | BUSI | CONT | 2025 | SIEMENS | Service | 20250115 | document_xyz.pdf |
| 000003 | MEDI | REPO | 2025 | LABOR | Blutbild | 20250130 | scan_report.pdf |

---

## Audit Log Sheet Setup

### Sheet Name: `AuditLog`

### Column Headers (Row 1):
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Timestamp | Action | Original | New | Status | Notes |

### Sample Data (Rows 2-3):
| Timestamp | Action | Original | New | Status | Notes |
|-----------|--------|----------|-----|--------|-------|
| 2025-08-11T11:37:39.454Z | RENAME | dropscan_001.pdf | 000001 PRIV INVO 2025 TELKO Mobilfunk 20250101.pdf | SUCCESS | Automated processing completed |
| 2025-08-11T11:45:22.123Z | ERROR | corrupted_file.pdf | - | FAILED | Unable to analyze document content |

---

## Google Sheets Configuration Steps

### Step 1: Create Document Index Sheet
1. Open Google Sheets: https://sheets.google.com
2. Create new spreadsheet
3. Name it: "Dropscan Document Index"
4. Set up columns A-H as shown above
5. Add sample data for testing
6. **Copy the Sheet ID** from URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`

### Step 2: Create Audit Log Sheet  
1. Create another new spreadsheet
2. Name it: "Dropscan Audit Log"
3. Set up columns A-F as shown above
4. Add sample data for testing
5. **Copy the Sheet ID** from URL

### Step 3: Update n8n Workflow Configuration
Replace the placeholder values in the `DropscanConfig` node:

```javascript
// Before (in workflow)
{
  "indexSheetId": "YOUR_GOOGLE_SHEET_ID_HERE",
  "auditSheetId": "YOUR_AUDIT_SHEET_ID_HERE"
}

// After (with your actual IDs)
{
  "indexSheetId": "1AbC2dEf3GhI4jKl5MnO6pQr7StU8vWx9YzA1bC2dE",
  "auditSheetId": "1BcD3eFg4HiJ5kLm6NoP7qRs8TuV9wXy0ZaB2cD3eF"
}
```

---

## Field Definitions & Examples

### Area Classification:
- **PRIV**: Private/Personal documents
- **BUSI**: Business/Commercial documents  
- **MEDI**: Medical/Health documents
- **LEGA**: Legal documents
- **FINA**: Financial documents

### Type Classification:
- **INVO**: Invoice/Bill
- **CONT**: Contract/Agreement
- **LETT**: Letter/Correspondence
- **CERT**: Certificate/Diploma
- **REPO**: Report/Statement
- **RECE**: Receipt/Proof of purchase
- **NOTI**: Notification/Notice
- **FORM**: Form/Application

### Sender Abbreviations (4-6 characters):
- **TELKO**: Telekom
- **SIEMEN**: Siemens
- **VOLKSB**: Volksbank
- **AUDI**: Audi
- **BMW**: BMW
- **GOVT**: Government office
- **INSUR**: Insurance company
- **UTIL**: Utility company

### Topic Examples (max 10 characters):
- **Mobilfunk**: Mobile phone
- **Internet**: Internet service
- **Strom**: Electricity
- **Gas**: Gas utility
- **Miete**: Rent
- **Versicher**: Insurance
- **Wartung**: Maintenance
- **Kauf**: Purchase
- **Service**: Service
- **Rechnung**: Invoice/Bill
- **Vertrag**: Contract
- **Kuendigung**: Cancellation

### Date Format:
- **Format**: YYYYMMDD
- **Examples**: 
  - 20250101 (January 1, 2025)
  - 20250315 (March 15, 2025)
  - 20251225 (December 25, 2025)

---

## Permissions Setup

### Google Drive Permissions
Ensure n8n has access to:
- **Dropscan Folder**: Read/Write access
- **File Operations**: Rename, move, read content

### Google Sheets Permissions  
Ensure n8n has access to:
- **Document Index Sheet**: Read/Write access
- **Audit Log Sheet**: Read/Write access
- **Cell Operations**: Read, append, update

### Required Google APIs
Enable these APIs in Google Cloud Console:
- Google Drive API
- Google Sheets API
- Google Cloud Storage API (for large files)

---

## Testing Checklist

### Before Going Live:
- [ ] Both Google Sheets created with correct headers
- [ ] Sample data added to test sheets
- [ ] Sheet IDs copied and updated in n8n workflow
- [ ] Google Drive permissions verified
- [ ] Google Sheets permissions verified
- [ ] OpenAI API key configured
- [ ] Test document uploaded to Dropscan folder
- [ ] Workflow executed manually to test all components
- [ ] Check Document Index for new entry
- [ ] Check Audit Log for processing record
- [ ] Verify file renamed correctly in Google Drive

### Post-Deployment Monitoring:
- [ ] Daily: Check last successful execution
- [ ] Weekly: Review classification accuracy
- [ ] Monthly: Analyze processing statistics
- [ ] Quarterly: Optimize AI prompts and performance

---

## Common Naming Convention Examples

### Invoice Examples:
```
000478 PRIV INVO 2025 TELKO Mobilfunk 20250101.pdf
000479 BUSI INVO 2025 SIEMEN Software 20250102.pdf
000480 PRIV INVO 2025 STADTW Strom 20250103.pdf
```

### Contract Examples:
```
000481 BUSI CONT 2025 MICRO Lizenz 20250104.pdf
000482 PRIV CONT 2025 VERSIC Haftpfl 20250105.pdf
000483 BUSI CONT 2025 LEASING Auto 20250106.pdf
```

### Medical Examples:
```
000484 MEDI REPO 2025 LABOR Blutbild 20250107.pdf
000485 MEDI CERT 2025 ARZT Impfung 20250108.pdf
000486 MEDI INVO 2025 ZAHNARZT Reinigung 20250109.pdf
```

### Legal Examples:
```
000487 LEGA NOTI 2025 GERICHT Termin 20250110.pdf
000488 LEGA CONT 2025 ANWALT Mandate 20250111.pdf
000489 LEGA CERT 2025 NOTAR Vollmacht 20250112.pdf
```

---

## Advanced Configuration Options

### Custom Classification Rules
Add specific rules for your document types in the OpenAI prompt:

```javascript
// Enhanced classification prompt
"Analyze this German document and classify according to these specific rules:

AREA Classification:
- PRIV: Personal documents (utilities, insurance, private purchases)
- BUSI: Business documents (B2B contracts, software licenses, equipment)
- MEDI: Medical documents (lab reports, doctor visits, prescriptions)
- LEGA: Legal documents (court notices, notary documents, contracts)
- FINA: Financial documents (bank statements, investment reports, taxes)

TYPE Classification based on document purpose:
- INVO: Any invoice, bill, or payment request
- CONT: Contracts, agreements, terms of service
- LETT: Letters, notifications, correspondence
- CERT: Certificates, diplomas, official confirmations
- REPO: Reports, statements, analysis documents
- RECE: Receipts, proof of purchase, payment confirmations
- NOTI: Official notices, summons, announcements
- FORM: Forms, applications, questionnaires

SENDER Guidelines:
- Use official company abbreviations when possible
- Maximum 6 characters
- Use CAPS format
- Common examples: TELKO, SIEMEN, VOLKSB, AUDI, BMW

TOPIC Guidelines:
- German terms preferred for German documents
- Maximum 10 characters
- No spaces or special characters
- Describe the main subject/service

Document content: {{ $json.content }}

Return JSON only: {area, type, year, sender, topic, date}"
```

### Error Handling Enhancement
Add retry logic and fallback naming:

```javascript
// Fallback naming if AI analysis fails
if (!analysisResult || analysisResult.error) {
  return {
    area: "UNKN",
    type: "DOC",
    year: new Date().getFullYear().toString(),
    sender: "SYSTEM",
    topic: "Unclass",
    date: new Date().toISOString().slice(0,10).replace(/-/g, '')
  };
}
```

---

## Maintenance Schedule

### Daily (Automated):
- Health check execution
- Error notification monitoring
- Index sequence validation

### Weekly (Manual):
- Review processing accuracy
- Check for new document types
- Update sender abbreviations
- Clean up failed attempts

### Monthly (Strategic):
- Analyze classification patterns
- Optimize AI prompts
- Review performance metrics
- Plan enhancement features

### Quarterly (Comprehensive):
- Full system audit
- Security review
- Backup verification
- Capacity planning

---

**Ready for immediate setup! Follow the step-by-step guide above to configure your Google Sheets and activate the automation.**