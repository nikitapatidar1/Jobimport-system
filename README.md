# Scalable Job Importer with Queue Processing & History Tracking 🚀

## Objective
This project is a **scalable job import system** that:  
- Fetches jobs from multiple external APIs (XML format)  
- Converts XML to JSON  
- Queues jobs using Redis + BullMQ  
- Inserts/updates jobs in MongoDB using worker processes  
- Tracks import history with detailed logs in a separate collection  

---

## Key Functionalities

### 1. Job Source API Integration
- Fetches jobs from multiple feeds:
  - https://jobicy.com/?feed=job_feed
  - https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time
  - https://jobicy.com/?feed=job_feed&job_categories=design-multimedia
  - https://jobicy.com/?feed=job_feed&job_categories=data-science
  - https://jobicy.com/?feed=job_feed&job_categories=copywriting
  - https://jobicy.com/?feed=job_feed&job_categories=business
  - https://jobicy.com/?feed=job_feed&job_categories=management
  - https://www.higheredjobs.com/rss/articleFeed.cfm
- Converts XML response to JSON before storing in MongoDB.
- Runs periodically (via cron job every 1 hour).

### 2. Queue-Based Background Processing
- Redis + BullMQ handles job queue.
- Worker processes with configurable concurrency.
- Handles and logs failures (DB errors, validation errors, invalid data).

### 3. Import History Tracking
- Each import run logs:
  - `timestamp`
  - `totalFetched`
  - `totalImported`
  - `newJobs`
  - `updatedJobs`
  - `failedJobs` with reasons
- Stored in `import_logs` MongoDB collection.

---

## Tech Stack
- **Frontend:** Next.js (Admin UI to view Import History)  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (Mongoose)  
- **Queue:** BullMQ  
- **Queue Store:** Redis  

---

## Setup Instructions

1. **Clone the repository**  
```bash
git clone https://github.com/nikitapatidar1/Jobimport-system.git
cd Jobimport-system













## Import History Sample Output 📊

| File Name           | Total | New | Updated | Failed | Timestamp                |
|--------------------|-------|-----|---------|--------|--------------------------|
| higheredjobs.xml    | 0     | 0   | 0       | 1      | 11/13/2025, 9:00 AM     |
| design.xml          | 37    | 0   | 37      | 0      | 11/13/2025, 10:00 AM    |
| smm.xml             | 3     | 0   | 3       | 0      | 11/13/2025, 11:00 AM    |
| jobicy.xml          | 50    | 0   | 50      | 0      | 11/13/2025, 12:00 PM    |
| jobicy.xml          | 50    | 0   | 50      | 0      | 11/13/2025, 1:00 PM     |
| jobicy.xml          | 50    | 0   | 50      | 0      | 11/13/2025, 2:00 PM     |
| ...                  | ...   | ... | ...     | ...    | ...                      |
| test-feed.xml       | 10    | 5   | 3       | 0      | 11/13/2025, 8:00 AM     |

